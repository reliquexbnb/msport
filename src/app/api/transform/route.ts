import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { hasModel, resolveModel } from "@/lib/ai";
import { AnatomySchema, CREATOR_SCHEMAS, type CreatorOutput } from "@/lib/schema";
import { CREATOR_SYSTEM_PROMPT, creatorUserPrompt } from "@/lib/prompts";
import { CREATOR_FORMATS } from "@/lib/config";

export const runtime = "nodejs";
export const maxDuration = 120;

const FormatSchema = z.enum(["article", "podcast", "interview", "newsletter", "social", "video"]);

const BodySchema = z.object({
  format: FormatSchema,
  anatomy: AnatomySchema,
});

export async function POST(req: Request) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "That request wasn't valid." }, { status: 400 });
  }

  const meta = CREATOR_FORMATS.find((f) => f.id === body.format)!;

  if (!hasModel()) {
    return NextResponse.json(
      { error: "The analysis service isn't configured. Add an API key on the server." },
      { status: 503 }
    );
  }

  try {
    const { object } = await generateObject({
      model: resolveModel(),
      schema: CREATOR_SCHEMAS[body.format],
      system: CREATOR_SYSTEM_PROMPT,
      prompt: creatorUserPrompt({
        format: body.format,
        formatLabel: meta.label,
        anatomy: body.anatomy,
        source: { kind: "paste" },
      }),
      temperature: 0.5,
      maxRetries: 2,
    });

    const output = { format: body.format, data: object } as CreatorOutput;
    return NextResponse.json({ output });
  } catch (err) {
    console.error("[mSport] transform failed:", err);
    return NextResponse.json(
      { error: `The ${meta.label} didn't come back cleanly. Try again.` },
      { status: 502 }
    );
  }
}

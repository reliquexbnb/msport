import type { Metadata } from "next";
import { AnalyzeWorkspace } from "./AnalyzeWorkspace";

export const metadata: Metadata = {
  title: "Analyze",
  description:
    "Drop in a game, player, team, article, transcript, interview or notes and build an mSport Anatomy.",
};

export default function AnalyzePage() {
  return <AnalyzeWorkspace />;
}

import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { BRAND } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What mSport does and doesn't collect.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy" updated="August 2026">
      <LegalSection heading="No accounts">
        <p>
          mSport has no sign-in and no sign-up. We don&apos;t create a profile for you, and we
          don&apos;t ask for your name, email address or payment details.
        </p>
      </LegalSection>

      <LegalSection heading="What you send us">
        <p>
          When you build an Anatomy, the material you provide — pasted text, a question, or the
          content retrieved from a URL you supply — is sent to our server and passed to the AI model
          provider that generates the analysis.
        </p>
        <p>
          We don&apos;t store your material or your results on our servers. Your most recent
          analysis is kept in your own browser&apos;s session storage so it survives a page
          refresh, and it&apos;s cleared when you close the tab.
        </p>
        <p>
          Material sent to the model provider is subject to that provider&apos;s own handling
          policies. Don&apos;t paste anything you&apos;re not comfortable sending to a third-party
          AI service — embargoed reporting, confidential sources, or personal information about
          others.
        </p>
      </LegalSection>

      <LegalSection heading="Free trial counter">
        <p>
          Your remaining free analyses are stored in your browser&apos;s local storage. It never
          leaves your device. Clearing your site data resets it.
        </p>
      </LegalSection>

      <LegalSection heading="URLs you submit">
        <p>
          When you submit a link, our server requests that page directly to extract its readable
          text. We validate the address first and refuse private, local and internal network
          destinations. We don&apos;t retain the fetched page.
        </p>
      </LegalSection>

      <LegalSection heading="Payments">
        <p>
          Payments are not live. There is no wallet connection, no payment processor and no
          financial data of any kind in the product today. When pay-as-you-go launches, this page
          will be updated before it does.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>Questions about any of this can go to the account listed in the footer at {BRAND.domain}.</p>
      </LegalSection>
    </LegalPage>
  );
}

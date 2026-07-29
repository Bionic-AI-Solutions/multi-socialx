export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import {
  LegalPage,
  LegalSection,
} from '@gitroom/frontend/components/legal/legal.page';

export const metadata: Metadata = {
  title: 'Bionic - Terms of Service',
  description: '',
};

export default async function Terms() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="29 July 2026">
      <LegalSection heading="1. Who provides the Service">
        <p>
          Bionic (the &quot;Service&quot;) is operated by{' '}
          <strong>[LEGAL ENTITY NAME]</strong>, registered at{' '}
          <strong>[REGISTERED ADDRESS]</strong> (&quot;we&quot;,
          &quot;us&quot;). These Terms govern your use of the Service.
        </p>
      </LegalSection>

      <LegalSection heading="2. Eligibility and accounts">
        <p>
          You must be at least 18 years old, or the age of majority in your
          jurisdiction, to use the Service. You are responsible for keeping your
          credentials confidential, for the accuracy of your account
          information, and for reporting any unauthorised access to us promptly.
        </p>
      </LegalSection>

      <LegalSection heading="3. The Service">
        <p>
          The Service provides scheduling, publishing, analytics and
          collaboration tools for social and chat channels. Features may be
          added, changed, removed or discontinued at any time. Where a material
          change affects paid subscribers, we will give reasonable notice.
        </p>
      </LegalSection>

      <LegalSection heading="4. Subscriptions, fees and billing">
        <p>
          Paid plans renew automatically unless cancelled before the renewal
          date. Fees are non-refundable except where required by law. You are
          responsible for applicable taxes. We will give at least 30 days&apos;
          notice of any price change.
        </p>
      </LegalSection>

      <LegalSection heading="5. Free plans, trials and beta features">
        <p>
          Free, trial and beta offerings are provided &quot;as is&quot; without
          warranty and may be changed or discontinued at any time without
          notice.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your content">
        <p>
          You retain all ownership and intellectual property rights in the
          content you submit (&quot;Your Content&quot;). You grant us a
          worldwide, non-exclusive licence to host, store, reproduce and
          distribute Your Content solely in order to operate the Service and to
          publish to the channels you connect.
        </p>
      </LegalSection>

      <LegalSection heading="7. Acceptable use">
        <p>You must not use the Service to:</p>
        <ul className="list-disc ps-[20px] flex flex-col gap-[4px]">
          <li>publish unlawful, hateful, or infringing content;</li>
          <li>send spam or generate fake engagement;</li>
          <li>circumvent rate limits or technical restrictions;</li>
          <li>reverse engineer or resell the Service without authorisation;</li>
          <li>distribute malware or attempt to disrupt the Service.</li>
        </ul>
        <p>
          Breach may result in content removal and suspension or termination of
          your account.
        </p>
      </LegalSection>

      <LegalSection heading="8. Third-party platforms and integrations">
        <p>
          The Service publishes to external platforms. You authenticate those
          accounts and authorise us to act on your behalf. We are not
          responsible for the availability, policies or API changes of any
          third-party platform. You may revoke our access at any time.
        </p>
      </LegalSection>

      <LegalSection heading="9. AI features">
        <p>
          AI-generated output may be inaccurate, incomplete or unsuitable for
          your purpose. You are solely responsible for reviewing it and ensuring
          compliance with applicable rules before publishing. Prompts may be
          transmitted to third-party providers as described in the Privacy
          Policy.
        </p>
      </LegalSection>

      <LegalSection heading="10. Our intellectual property">
        <p>
          Except for Your Content, we retain ownership of the Service and all
          related software, designs and materials. You receive a limited,
          non-exclusive, non-transferable licence to use the Service for its
          intended purpose for the duration of your subscription.
        </p>
      </LegalSection>

      <LegalSection heading="11. Feedback">
        <p>
          If you send us feedback or suggestions, you grant us a perpetual,
          irrevocable, worldwide, royalty-free licence to use it for any purpose
          without compensation or attribution.
        </p>
      </LegalSection>

      <LegalSection heading="12. Privacy and data protection">
        <p>
          Our processing of personal data is governed by the Privacy Policy.
          Where we act as a processor on your behalf, a data processing
          addendum applies.
        </p>
      </LegalSection>

      <LegalSection heading="13. Suspension and termination">
        <p>
          You may stop using the Service and close your account at any time. We
          may suspend or terminate access immediately for breach of these Terms,
          non-payment, or where continued provision would create legal risk.
          Account data may be deleted after a reasonable retention period.
        </p>
      </LegalSection>

      <LegalSection heading="14. Disclaimers">
        <p>
          The Service is provided &quot;as is&quot; and &quot;as
          available&quot;, without warranties of any kind to the extent
          permitted by law. We do not guarantee that any post will be delivered
          or accepted by a third-party platform, or that analytics figures are
          complete or accurate.
        </p>
      </LegalSection>

      <LegalSection heading="15. Limitation of liability">
        <p>
          To the maximum extent permitted by law, our total liability arising
          out of or relating to the Service is limited to the greater of (a) the
          fees you paid in the 12 months preceding the claim, or (b){' '}
          <strong>[LIABILITY CAP]</strong>. We are not liable for indirect,
          incidental or consequential damages, or for lost profits or data.
        </p>
      </LegalSection>

      <LegalSection heading="16. Indemnification">
        <p>
          You agree to indemnify us against claims arising from Your Content,
          your use of the Service, your breach of these Terms, your violation of
          law, or disputes relating to content you publish.
        </p>
      </LegalSection>

      <LegalSection heading="17. Marketing communications">
        <p>
          You may receive marketing email, which you can opt out of at any time.
          Transactional email relating to your account is required while the
          account is active.
        </p>
      </LegalSection>

      <LegalSection heading="18. Cookies">
        <p>
          The Service uses cookies as described in the Privacy Policy, subject
          to your consent where required.
        </p>
      </LegalSection>

      <LegalSection heading="19. Changes to these Terms">
        <p>
          We will give advance notice of material changes. Continuing to use the
          Service after a change takes effect constitutes acceptance.
        </p>
      </LegalSection>

      <LegalSection heading="20. Governing law and disputes">
        <p>
          These Terms are governed by the laws of{' '}
          <strong>[GOVERNING JURISDICTION]</strong>, and its courts have
          exclusive jurisdiction, except that we may bring proceedings for
          intellectual property infringement in any competent court.
        </p>
      </LegalSection>

      <LegalSection heading="21. General">
        <p>
          These Terms, together with the Privacy Policy, form the entire
          agreement between you and us regarding the Service. If any provision
          is found unenforceable, the remaining provisions continue in effect.
        </p>
      </LegalSection>

      <LegalSection heading="22. Contact">
        <p>
          Questions about these Terms can be sent to{' '}
          <strong>[CONTACT EMAIL]</strong>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

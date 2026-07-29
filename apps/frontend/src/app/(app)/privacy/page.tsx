export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import {
  LegalPage,
  LegalSection,
} from '@gitroom/frontend/components/legal/legal.page';

export const metadata: Metadata = {
  title: 'Bionic - Privacy Policy',
  description: '',
};

export default async function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="29 July 2026"
      pending={false}
    >
      <LegalSection heading="1. Who we are">
        <p>
          Bionic (the &quot;Service&quot;) is operated by{' '}
          <strong>Bionic AI Solutions</strong>, registered at{' '}
          <strong>3403 West Lake Sammamish Pkwy SE, Bellevue, WA 98008, USA</strong>, which is the data controller
          for the personal data described in this policy.
        </p>
      </LegalSection>

      <LegalSection heading="2. The Service in brief">
        <p>
          The Service schedules and publishes content to the social and chat
          channels you connect, and reports analytics on that content. Doing so
          requires us to process account data, the content you create, and
          tokens issued by the platforms you authorise.
        </p>
      </LegalSection>

      <LegalSection heading="3. The data we collect">
        <ul className="list-disc ps-[20px] flex flex-col gap-[4px]">
          <li>
            <strong>Account data</strong> — name, email address, company,
            password hash, and preferences.
          </li>
          <li>
            <strong>Content</strong> — posts, media, comments and schedules you
            create.
          </li>
          <li>
            <strong>Integration data</strong> — access and refresh tokens, and
            channel identifiers for the platforms you connect.
          </li>
          <li>
            <strong>Usage data</strong> — log entries, device and browser
            information, and feature interactions.
          </li>
          <li>
            <strong>Billing data</strong> — where applicable, processed by our
            payment provider; we do not store full card numbers.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. How we use data, and our legal bases">
        <p>
          We process data to provide and secure the Service (performance of a
          contract), to comply with legal obligations, and — where you have
          consented or where we have a legitimate interest that does not
          override your rights — to improve the Service and send marketing.
        </p>
      </LegalSection>

      <LegalSection heading="5. AI-assisted features">
        <p>
          Where you use AI features, your prompts and the relevant content may
          be sent to third-party model providers to generate a response. We do
          not use your content to train our own models.
        </p>
      </LegalSection>

      <LegalSection heading="6. Controller and processor roles">
        <p>
          We act as a controller for account, billing and usage data. Where you
          upload content on behalf of an organisation, we generally act as a
          processor on that organisation&apos;s instructions.
        </p>
      </LegalSection>

      <LegalSection heading="7. Who we share data with">
        <p>
          We share data with infrastructure and subprocessor providers (hosting,
          storage, email, analytics, payments, AI providers), and with the social
          platforms you explicitly connect. We do not sell personal data.
        </p>
      </LegalSection>

      <LegalSection heading="8. International transfers">
        <p>
          Data may be processed outside your country. Where required, we rely on
          appropriate safeguards such as standard contractual clauses.
        </p>
      </LegalSection>

      <LegalSection heading="9. Data retention">
        <p>
          We keep personal data for as long as your account is active, and after
          closure only as long as needed for legal, accounting or dispute
          resolution purposes.
        </p>
      </LegalSection>

      <LegalSection heading="10. Security">
        <p>
          We apply technical and organisational measures including encryption in
          transit, access controls and audit logging. No system is completely
          secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection heading="11. Your rights">
        <p>
          Subject to your jurisdiction, you may have the right to access,
          correct, delete, export or restrict processing of your personal data,
          to object to processing, and to withdraw consent. Contact us to
          exercise these rights.
        </p>
      </LegalSection>

      <LegalSection heading="12. Regional rights">
        <p>
          Residents of certain regions have additional rights under local law.
          The regimes we recognise for this Service are the{' '}
          <strong>CCPA/CPRA</strong> for California residents and the{' '}
          <strong>DPDP Act</strong> for residents of India.
        </p>
        <p>
          Under the CCPA/CPRA, California residents may request disclosure of
          the categories and specific pieces of personal information collected,
          request deletion or correction, and opt out of any sale or sharing of
          personal information. We do not sell personal data. You will not be
          discriminated against for exercising these rights.
        </p>
        <p>
          Under the DPDP Act, residents of India may request access to and
          correction or erasure of their personal data, nominate another person
          to exercise their rights, and raise a grievance with us before
          escalating to the Data Protection Board.
        </p>
      </LegalSection>

      <LegalSection heading="13. Children">
        <p>
          The Service is not directed at children under 18, and we do not
          knowingly collect their personal data.
        </p>
      </LegalSection>

      <LegalSection heading="14. Marketing and cookie choices">
        <p>
          You can unsubscribe from marketing email at any time. Cookies are used
          for authentication and, where consented, analytics; you can manage
          them in your browser.
        </p>
      </LegalSection>

      <LegalSection heading="15. Third-party sites and services">
        <p>
          The Service links to and integrates with third-party services governed
          by their own privacy policies. We are not responsible for their
          practices.
        </p>
      </LegalSection>

      <LegalSection heading="16. Changes to this policy">
        <p>
          We will give notice of material changes. Continuing to use the Service
          after a change takes effect constitutes acceptance.
        </p>
      </LegalSection>

      <LegalSection heading="17. Contact us">
        <p>
          Privacy questions and rights requests can be sent to{' '}
          <strong>legal@baisoln.com</strong>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

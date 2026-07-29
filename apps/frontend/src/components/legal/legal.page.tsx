import { ReactNode } from 'react';

// Shared chrome for the legal pages (/terms, /privacy) so both read the same.
// `pending` renders a visible notice — these documents carry placeholders for
// facts that cannot be invented (legal entity, registered address, governing
// jurisdiction), and must not be mistaken for reviewed legal text.
export const LegalPage = ({
  title,
  lastUpdated,
  pending = true,
  children,
}: {
  title: string;
  lastUpdated: string;
  pending?: boolean;
  children: ReactNode;
}) => {
  return (
    <div className="w-full min-h-screen bg-primary text-textColor">
      <div className="max-w-[820px] mx-auto px-[20px] py-[48px]">
        <h1 className="text-[32px] font-[600] mb-[8px]">{title}</h1>
        <p className="text-[13px] opacity-70 mb-[24px]">
          Last updated: {lastUpdated}
        </p>

        {pending && (
          <div className="mb-[32px] p-[16px] rounded-[8px] border border-[#612BD3] bg-[#612BD3]/10 text-[13px] leading-[20px]">
            <strong>Draft — pending legal review.</strong> Passages marked{' '}
            <code className="px-[4px] bg-black/30 rounded-[3px]">
              [LIKE THIS]
            </code>{' '}
            must be completed with the operating entity&apos;s details before
            this document is relied upon.
          </div>
        )}

        <div className="flex flex-col gap-[24px] text-[14px] leading-[22px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export const LegalSection = ({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) => {
  return (
    <section className="flex flex-col gap-[8px]">
      <h2 className="text-[18px] font-[600]">{heading}</h2>
      <div className="flex flex-col gap-[8px] opacity-90">{children}</div>
    </section>
  );
};

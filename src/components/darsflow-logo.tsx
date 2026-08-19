interface DarsFlowLogoProps {
  compact?: boolean;
  inverse?: boolean;
}

export function DarsFlowMark({ inverse = false }: { inverse?: boolean }) {
  const primary = inverse ? "#ffffff" : "#0f766e";
  const secondary = inverse ? "#99f6e4" : "#14b8a6";
  const accent = inverse ? "#fcd34d" : "#d6a936";

  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="DarsFlow mark" className="size-full">
      <path d="M8 7.5h14.5C33.3 7.5 41 14 41 24s-7.7 16.5-18.5 16.5H8z" fill="none" stroke={primary} strokeWidth="5" strokeLinejoin="round" />
      <path d="M15 15.5h8.5c4.6 0 8.2 3.5 8.2 8.5" fill="none" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
      <path d="M15 24h13" fill="none" stroke={primary} strokeWidth="3" strokeLinecap="round" />
      <path d="M15 32.5h8.5c4.6 0 8.2-3.5 8.2-8.5" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="24" r="2.5" fill={primary} />
    </svg>
  );
}

export function DarsFlowLogo({ compact = false, inverse = false }: DarsFlowLogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="DarsFlow home">
      <span className="block size-9 shrink-0 sm:size-10" aria-hidden="true">
        <DarsFlowMark inverse={inverse} />
      </span>
      {!compact && (
        <span className={`text-xl font-bold tracking-[-0.035em] ${inverse ? "text-white" : "text-slate-950"}`}>
          Dars<span className={inverse ? "text-teal-200" : "text-teal-700"}>Flow</span>
        </span>
      )}
    </span>
  );
}

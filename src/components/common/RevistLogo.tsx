interface RevistLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

/**
 * Geometric R + return-arrow brand mark adapted from Revist's existing emblem
 * into the Revist 2.0 emerald identity.
 */
export function RevistLogo({
  size = 34,
  showWordmark = true,
  className = '',
}: RevistLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 42H43C55.8 42 63.5 48.6 63.5 58.6C63.5 66.2 58.4 71.8 50 73.8L64.5 99H50.2L37.4 75H29.5V99H16V42ZM29.5 52.8V64.8H42C47.8 64.8 50.6 62.3 50.6 58.8C50.6 55.2 47.8 52.8 42 52.8H29.5Z"
          fill="var(--accent-primary)"
        />
        <path
          d="M52.5 95.8H69.5C87.2 95.8 98.5 79.4 98.5 58.2C98.5 36.8 86.8 22.8 67.5 22.8H54.5"
          stroke="var(--accent-primary)"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M54.5 9.8L30.5 22.8L54.5 35.8V9.8Z"
          fill="var(--bg-primary)"
          stroke="var(--accent-primary)"
          strokeWidth="6"
          strokeLinejoin="miter"
        />
      </svg>
      {showWordmark && (
        <span className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Revist
        </span>
      )}
    </span>
  );
}

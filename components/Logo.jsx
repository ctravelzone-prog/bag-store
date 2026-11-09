// Luxury logo — gold double-ring emblem + handbag line art + serif wordmark.
export default function LogoMark({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-label="Touch of Sabrina logo">
      <circle cx="50" cy="50" r="47" stroke="#c9a227" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="41" stroke="#c9a227" strokeWidth="1" />
      <g stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M35 48 L31 70 a3 3 0 0 0 3 3.5 h32 a3 3 0 0 0 3-3.5 L65 48 Z" />
        <path d="M35 48 h30" />
        <path d="M42 48 v-6 a8 8 0 0 1 16 0 v6" />
        <circle cx="50" cy="58" r="2.5" fill="#c9a227" stroke="none" />
      </g>
    </svg>
  );
}
export function Logo({ dark = false, size = 44 }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="leading-none">
        <span className={"block font-serif font-bold tracking-wide " + (dark ? "text-white" : "text-white")} style={{ fontSize: size * 0.42 }}>Touch of Sabrina</span>
        <span className="block text-[10px] tracking-[0.3em] text-gold mt-1">LUXURY BAGS</span>
      </span>
    </span>
  );
}
export function LogoLight({ size = 44 }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="leading-none">
        <span className="block font-serif font-bold tracking-wide text-maroon" style={{ fontSize: size * 0.42 }}>Touch of Sabrina</span>
        <span className="block text-[10px] tracking-[0.3em] text-gold-dark mt-1">LUXURY BAGS</span>
      </span>
    </span>
  );
}

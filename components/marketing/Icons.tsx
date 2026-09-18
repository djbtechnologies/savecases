export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function Check() {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 10 3.2 3.2L15 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function Phone() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5.6 3.5 3.1-.5 2 5-2.2 1.7a14 14 0 0 0 5.8 5.8l1.7-2.2 5 2-.5 3.1c-.2 1.2-1.3 2.1-2.5 2-7.8-.7-13.7-6.6-14.4-14.4-.1-1.2.8-2.3 2-2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>;
}
export function Brand({ footer = false }: { footer?: boolean }) {
  return <a className={`sc-brand${footer ? " sc-brand-footer" : ""}`} href="#top" aria-label="SaveCases home"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><rect x=".5" y=".5" width="39" height="39" rx="3" stroke="currentColor" /><path d="M25 12H16a5 5 0 0 0 0 10h8a4 4 0 0 1 0 8H13M15 8v8m10 10v7" stroke="currentColor" strokeWidth="1.5" /><path d="M12 25h16" stroke="currentColor" strokeWidth=".7" opacity=".45" /></svg><span>SaveCases<span className="sc-brand-period">.</span></span></a>;
}

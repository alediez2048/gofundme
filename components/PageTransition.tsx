/**
 * FR-017: Page mount animation — 150ms opacity fade-in.
 * Wrap page content to animate on mount. Uses CSS animation
 * so it respects prefers-reduced-motion from globals.css.
 */

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
}

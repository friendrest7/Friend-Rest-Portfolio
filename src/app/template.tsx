/** Re-mounts on navigation, giving each page a subtle entrance (disabled for reduced motion in CSS). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}

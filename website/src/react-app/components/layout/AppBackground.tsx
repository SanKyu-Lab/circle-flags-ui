export default function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0" aria-hidden>
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_-30%,var(--accent-soft),transparent_66%)]" />
    </div>
  )
}

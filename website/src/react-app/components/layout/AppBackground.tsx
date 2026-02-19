export default function AppBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-noise opacity-40" />
      <div className="absolute -left-28 -top-40 h-136 w-136 rounded-full bg-[radial-gradient(circle,var(--flag-blue-glow),transparent_62%)] blur-3xl animate-float-slow" />
      <div
        className="absolute -right-28 top-[18%] h-112 w-md rounded-full bg-[radial-gradient(circle,var(--flag-green-glow),transparent_60%)] blur-3xl animate-float"
        style={{ animationDuration: '9s' }}
      />
      <div className="absolute left-1/3 top-[68%] h-96 w-[24rem] rounded-full bg-[radial-gradient(circle,var(--flag-red-glow),transparent_64%)] blur-3xl animate-float-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-30">
        <div
          className="absolute w-3 h-3 rounded-full bg-(--flag-blue) animate-orbit"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute w-2 h-2 rounded-full bg-(--flag-red) animate-orbit"
          style={{ animationDelay: '-5s', animationDuration: '15s' }}
        />
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-(--flag-gold) animate-orbit"
          style={{ animationDelay: '-10s', animationDuration: '18s' }}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--accent) to-transparent opacity-55" />
    </>
  )
}

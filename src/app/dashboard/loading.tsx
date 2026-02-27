export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-30 h-14 border-b border-amber-200/60 bg-white/70 backdrop-blur-md" />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 h-8 w-64 animate-pulse rounded-lg bg-amber-100" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl bg-white/60"
            />
          ))}
        </div>
      </main>
    </div>
  );
}

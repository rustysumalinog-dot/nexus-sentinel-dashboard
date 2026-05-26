export default function Loading() {
  return (
    <>
      <header className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
        <div className="pl-10 lg:pl-0 space-y-2">
          <div className="skeleton h-6 w-40 rounded" />
          <div className="skeleton h-3 w-56 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="skeleton h-9 w-24 rounded-lg" />
          <div className="skeleton h-9 w-9 rounded-lg" />
          <div className="skeleton h-9 w-9 rounded-lg" />
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-9 w-9 rounded-lg" />
              </div>
              <div className="skeleton h-7 w-32 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="skeleton h-5 w-40 rounded" />
            <div className="skeleton h-[260px] w-full rounded" />
          </div>
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="skeleton h-5 w-32 rounded" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-6 w-full rounded" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

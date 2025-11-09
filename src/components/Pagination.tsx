interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isDisabled?: boolean
}

const createRange = (start: number, end: number) => {
  const length = end - start + 1
  return Array.from({ length }, (_, index) => start + index)
}

export const Pagination = ({ currentPage, totalPages, onPageChange, isDisabled = false }: PaginationProps) => {
  if (totalPages <= 1) {
    return null
  }

  const clampedPage = Math.min(Math.max(currentPage, 1), totalPages)
  const visibleCount = 5
  const half = Math.floor(visibleCount / 2)

  let start = Math.max(clampedPage - half, 1)
  let end = Math.min(start + visibleCount - 1, totalPages)

  if (end - start < visibleCount - 1) {
    start = Math.max(end - visibleCount + 1, 1)
  }

  const pages = createRange(start, end)

  const handleChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || isDisabled) {
      return
    }
    onPageChange(page)
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full border border-white/10 px-4 py-2 text-slate-200 transition hover:border-sky-400/60 hover:text-white disabled:cursor-not-allowed disabled:border-white/5 disabled:text-slate-500"
          onClick={() => handleChange(currentPage - 1)}
          disabled={clampedPage <= 1 || isDisabled}
        >
          Previous
        </button>
        <button
          type="button"
          className="rounded-full border border-white/10 px-4 py-2 text-slate-200 transition hover:border-sky-400/60 hover:text-white disabled:cursor-not-allowed disabled:border-white/5 disabled:text-slate-500"
          onClick={() => handleChange(currentPage + 1)}
          disabled={clampedPage >= totalPages || isDisabled}
        >
          Next
        </button>
      </div>

      <div className="flex items-center gap-1">
        {start > 1 && (
          <>
            <button
              type="button"
              onClick={() => handleChange(1)}
              className="rounded-full border border-white/10 px-3 py-1 text-slate-300 transition hover:border-sky-400/60 hover:text-white"
              disabled={isDisabled}
            >
              1
            </button>
            {start > 2 && <span className="px-2 text-slate-500">…</span>}
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => handleChange(page)}
            disabled={isDisabled}
            className={`rounded-full px-3 py-1 transition ${
              page === clampedPage
                ? 'border border-sky-400/70 bg-sky-500/15 text-white'
                : 'border border-white/10 text-slate-300 hover:border-sky-400/60 hover:text-white'
            }`}
          >
            {page}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-2 text-slate-500">…</span>}
            <button
              type="button"
              onClick={() => handleChange(totalPages)}
              className="rounded-full border border-white/10 px-3 py-1 text-slate-300 transition hover:border-sky-400/60 hover:text-white"
              disabled={isDisabled}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <span className="text-slate-400">
        Page {clampedPage} of {totalPages}
      </span>
    </nav>
  )
}


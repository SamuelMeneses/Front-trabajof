'use client';

interface Meta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface PaginationProps {
  meta: Meta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages } = meta;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const visiblePages = pages.filter(
    pageNumber => pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - page) <= 1
  );

  return (
    <div className="flex flex-col gap-3 rounded-[28px] border border-slate-800/60 bg-slate-950/90 p-4 shadow-[0_20px_50px_-40px_rgba(56,189,248,0.25)] sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-400">Página {page} de {totalPages} — {meta.total} boletos totales.</div>
      <nav className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>
        {visiblePages.map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out ${pageNumber === page ? 'border-sky-400 bg-sky-500/15 text-white' : 'border-slate-700 bg-slate-900/90 text-slate-300 hover:border-sky-400 hover:bg-slate-900 hover:text-white'}`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Siguiente
        </button>
      </nav>
    </div>
  );
}

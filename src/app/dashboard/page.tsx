'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../../components/Pagination';
import TicketModal from '../../components/TicketModal';
import type { GameType, TicketStatus, Ticket } from '../../types';

const initialMeta = { total: 0, page: 1, pageSize: 20, totalPages: 1 };
const STATUS_OPTIONS: (TicketStatus | '')[] = ['', 'Pendiente', 'Ganado', 'Perdido'];
const GAME_TYPE_OPTIONS: (GameType | '')[] = ['', 'Lotería', 'Rifa', 'Sorteo', 'Boleta', 'Juego ocasional'];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [meta, setMeta] = useState(initialMeta);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [gameTypeFilter, setGameTypeFilter] = useState<GameType | ''>('');

  const isFiltering = Boolean(debouncedSearch || statusFilter || gameTypeFilter);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, router, user]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, gameTypeFilter]);

  const loadTickets = useCallback(async (page = 1) => {
    setLoadingTickets(true);
    setError('');

    try {
      const params: Record<string, unknown> = { page, pageSize: 20 };

      if (debouncedSearch) {
        params.q = debouncedSearch;
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      if (gameTypeFilter) {
        params.gameType = gameTypeFilter;
      }

      const endpoint = user?.role === 'admin' ? '/admin/tickets' : '/tickets';
      const response = await apiClient.get(endpoint, { params });
      const items = response.data.data as Ticket[];
      setTickets(items ?? []);
      setMeta(response.data.meta ?? initialMeta);
    } catch (fetchError) {
      setError('No se pudieron cargar los tickets. Intenta de nuevo.');
    } finally {
      setLoadingTickets(false);
    }
  }, [debouncedSearch, statusFilter, gameTypeFilter, user?.role]);

  useEffect(() => {
    loadTickets(currentPage);
  }, [currentPage, loadTickets, refreshKey]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setGameTypeFilter('');
  };

  const openNewTicket = () => {
    setSelectedTicket(undefined);
    setModalOpen(true);
  };

  const openEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const metrics = useMemo(() => {
    const now = new Date();
    return {
      totalGames: meta.total,
      upcomingDraws: tickets.filter(ticket => new Date(ticket.gameDate) > now).length,
      pendingGames: tickets.filter(ticket => ticket.status === 'Pendiente').length,
    };
  }, [meta.total, tickets]);

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="sticky top-8 flex min-h-[calc(100vh-4rem)] flex-col justify-between rounded-[32px] border border-slate-800/60 bg-slate-950/90 p-6 shadow-[0_20px_60px_-40px_rgba(56,189,248,0.24)]">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-400/80">Panel</p>
              <h2 className="text-3xl font-semibold text-white">Control</h2>
              <p className="text-sm leading-6 text-slate-400">Tus boletas ordenadas.</p>
            </div>

            <div className="space-y-3 text-sm text-slate-500">
              <p className="uppercase tracking-[0.35em] text-slate-500/80">Usuario</p>
              <p className="text-lg font-semibold text-white">{user.name}</p>
              <p className="break-words text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={openNewTicket}
              className="w-full rounded-full border border-slate-700 bg-slate-900/90 px-5 py-4 text-left text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:bg-slate-900/95"
            >
              + Nuevo ticket
            </button>
            <button
              onClick={logout}
              className="w-full rounded-full border border-slate-700 bg-transparent px-5 py-4 text-sm font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <section className="space-y-8">
          <div className="rounded-[32px] border border-slate-800/60 bg-slate-950/90 p-8 shadow-[0_20px_60px_-40px_rgba(56,189,248,0.24)]">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-[28px] bg-slate-900/80 p-6 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:bg-slate-900/95">
                <p className="text-xs uppercase tracking-[0.35em] text-sky-400/80">Total</p>
                <p className="mt-4 text-6xl font-semibold text-white">{metrics.totalGames}</p>
              </div>
              <div className="rounded-[28px] bg-slate-900/80 p-6 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:bg-slate-900/95">
                <p className="text-xs uppercase tracking-[0.35em] text-sky-400/80">Próximos sorteos</p>
                <p className="mt-4 text-6xl font-semibold text-white">{metrics.upcomingDraws}</p>
              </div>
              <div className="rounded-[28px] bg-slate-900/80 p-6 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:bg-slate-900/95">
                <p className="text-xs uppercase tracking-[0.35em] text-sky-400/80">Pendientes</p>
                <p className="mt-4 text-6xl font-semibold text-white">{metrics.pendingGames}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-800/60 bg-slate-950/90 p-8 shadow-[0_20px_60px_-40px_rgba(56,189,248,0.24)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-sky-400/80">Buscar</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Filtrar boletas</h2>
                <p className="mt-2 text-sm text-slate-400">Busca por título, número, lugar o email en todo tu historial.</p>
              </div>
              <div className="text-sm text-slate-500">Página {meta.page} de {meta.totalPages}</div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1.7fr_1fr_1fr_auto]">
              <label className="flex flex-col gap-2 text-sm text-slate-300">
                <span className="text-slate-400">Buscar</span>
                <input
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  placeholder="Título, número, lugar o email"
                  className="rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-300 ease-in-out focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-300">
                <span className="text-slate-400">Estado</span>
                <select
                  value={statusFilter}
                  onChange={event => setStatusFilter(event.target.value as TicketStatus | '')}
                  className="rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15"
                >
                  <option value="">Todos los estados</option>
                  {STATUS_OPTIONS.filter(Boolean).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-300">
                <span className="text-slate-400">Tipo</span>
                <select
                  value={gameTypeFilter}
                  onChange={event => setGameTypeFilter(event.target.value as GameType | '')}
                  className="rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15"
                >
                  <option value="">Todos los tipos</option>
                  {GAME_TYPE_OPTIONS.filter(Boolean).map(gameType => (
                    <option key={gameType} value={gameType}>{gameType}</option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={clearFilters}
                disabled={!isFiltering}
                className="inline-flex h-full items-center justify-center rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Limpiar
              </button>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-800/60 bg-slate-950/90 p-6 shadow-[0_20px_60px_-40px_rgba(56,189,248,0.24)]">
            {loadingTickets ? (
              <div className="space-y-3 py-8">
                <div className="h-14 rounded-3xl bg-slate-900" />
                <div className="h-14 rounded-3xl bg-slate-900" />
                <div className="h-14 rounded-3xl bg-slate-900" />
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-600 bg-red-950/80 px-6 py-5 text-sm text-red-300">{error}</div>
            ) : tickets.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900 px-6 py-10 text-center text-slate-400">
                {isFiltering ? 'No se encontraron resultados con los filtros activos.' : 'No hay tickets disponibles. Crea uno nuevo para comenzar.'}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-3 px-4 text-xs uppercase tracking-[0.25em] text-slate-500 sm:grid-cols-[2.2fr_0.9fr_0.9fr_0.9fr] sm:px-0">
                  <span className="hidden sm:inline-block">Sorteo</span>
                  <span>Tipo</span>
                  <span>Fecha</span>
                  <span className="text-right">Número</span>
                </div>
                <div className="space-y-3">
                  {tickets.map(ticket => (
                    <div
                      key={ticket.id}
                      className="rounded-[28px] border border-slate-800/50 bg-slate-950/90 p-4 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400/30 hover:bg-slate-900/85"
                    >
                      <div className="grid gap-3 text-sm sm:grid-cols-[2.2fr_0.9fr_0.9fr_0.9fr]">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white">{ticket.title}</p>
                          <p className="text-xs text-slate-500">{ticket.place ?? 'Sin lugar'}</p>
                        </div>
                        <p className="text-slate-300">{ticket.gameType}</p>
                        <p className="text-slate-300">{new Date(ticket.gameDate).toLocaleDateString('es-ES')}</p>
                        <p className="text-right text-slate-300">{ticket.gameNumber ?? '—'}</p>
                      </div>
                      <div className="mt-4 flex flex-col gap-4 border-t border-slate-800/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${ticket.status === 'Ganado' ? 'bg-sky-400' : ticket.status === 'Pendiente' ? 'bg-slate-500' : 'bg-slate-600'}`}
                          />
                          {ticket.status}
                        </div>
                        <p className="text-sm text-slate-200">{ticket.amount != null ? `$${ticket.amount}` : '—'}</p>
                        <button
                          onClick={() => openEditTicket(ticket)}
                          className="inline-flex rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-xs font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:bg-slate-900"
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination meta={meta} onPageChange={page => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
              </div>
            )}
          </div>
        </section>
      </div>

      <button
        type="button"
        onClick={openNewTicket}
        className="fixed bottom-6 right-6 z-20 rounded-full border border-slate-700 bg-slate-900/95 px-5 py-4 text-sm font-semibold text-white shadow-[0_15px_40px_-20px_rgba(56,189,248,0.65)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:bg-slate-800 lg:hidden"
      >
        Nuevo ticket
      </button>

      <TicketModal
        ticket={selectedTicket}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setRefreshKey(prev => prev + 1)}
      />
    </main>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../../components/Pagination';
import type { Ticket } from '../../types';

interface AdminTicket extends Ticket {
  user?: {
    name?: string;
    email?: string;
  };
  ownerName?: string;
  ownerEmail?: string;
}

const initialMeta = { total: 0, page: 1, pageSize: 20, totalPages: 1 };

export default function AdminPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [meta, setMeta] = useState(initialMeta);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [gameType, setGameType] = useState('');
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    if (!loading && user && user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [loading, router, user]);

  const loadAdminTickets = async () => {
    setLoadingTickets(true);
    setError('');

    try {
      const response = await apiClient.get('/admin/tickets', {
        params: {
          page: currentPage,
          pageSize: 20,
          q: query || undefined,
          status: status || undefined,
          gameType: gameType || undefined,
        },
      });

      const items = response.data.data as AdminTicket[];
      setTickets(items ?? []);
      setMeta(response.data.meta ?? initialMeta);
    } catch (fetchError) {
      setError('No se pudieron cargar las boletas de administrador.');
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminTickets();
    }
  }, [currentPage, query, status, gameType, refreshKey, user]);

  const displayedTickets = useMemo(() => tickets, [tickets]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-500">Panel de administrador</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Boletas de todos los alumnos</h1>
            <p className="mt-2 text-sm text-slate-600">Filtra por estado, tipo de juego o búsqueda global.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={logout} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Cerrar sesión
            </button>
          </div>
        </header>

        <div className="mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft lg:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={event => { setQuery(event.target.value); setCurrentPage(1); }}
            placeholder="Buscar por título, número o email del dueño"
            className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <select
              value={status}
              onChange={event => { setStatus(event.target.value); setCurrentPage(1); }}
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Ganado">Ganado</option>
              <option value="Perdido">Perdido</option>
            </select>
            <select
              value={gameType}
              onChange={event => { setGameType(event.target.value); setCurrentPage(1); }}
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            >
              <option value="">Todos los tipos</option>
              <option value="Lotería">Lotería</option>
              <option value="Rifa">Rifa</option>
              <option value="Sorteo">Sorteo</option>
              <option value="Boleta">Boleta</option>
              <option value="Juego ocasional">Juego ocasional</option>
            </select>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          {loadingTickets ? (
            <div className="space-y-3">
              <div className="h-14 rounded-3xl bg-slate-100" />
              <div className="h-14 rounded-3xl bg-slate-100" />
              <div className="h-14 rounded-3xl bg-slate-100" />
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">{error}</div>
          ) : displayedTickets.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-600">
              No se encontraron boletas con estos filtros.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-4 font-medium text-slate-700">Estudiante</th>
                      <th className="px-4 py-4 font-medium text-slate-700">Sorteo</th>
                      <th className="px-4 py-4 font-medium text-slate-700">Tipo</th>
                      <th className="px-4 py-4 font-medium text-slate-700">Fecha</th>
                      <th className="px-4 py-4 font-medium text-slate-700">Número</th>
                      <th className="px-4 py-4 font-medium text-slate-700">Lugar</th>
                      <th className="px-4 py-4 font-medium text-slate-700">Estado</th>
                      <th className="px-4 py-4 font-medium text-slate-700">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {displayedTickets.map(ticket => {
                      const ownerName = ticket.user?.name ?? ticket.ownerName ?? 'Sin nombre';
                      const ownerEmail = ticket.user?.email ?? ticket.ownerEmail ?? 'Sin email';

                      return (
                        <tr key={ticket.id}>
                          <td className="px-4 py-4 text-slate-700">
                            <div className="font-medium text-slate-900">{ownerName}</div>
                            <div className="text-xs text-slate-500">{ownerEmail}</div>
                          </td>
                          <td className="px-4 py-4 text-slate-700">{ticket.title}</td>
                          <td className="px-4 py-4 text-slate-700">{ticket.gameType}</td>
                          <td className="px-4 py-4 text-slate-700">{new Date(ticket.gameDate).toLocaleDateString('es-ES')}</td>
                          <td className="px-4 py-4 text-slate-700">{ticket.gameNumber ?? '—'}</td>
                          <td className="px-4 py-4 text-slate-700">{ticket.place ?? '—'}</td>
                          <td className="px-4 py-4 text-slate-700">{ticket.status}</td>
                          <td className="px-4 py-4 text-slate-700">{ticket.amount != null ? `$${ticket.amount}` : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination meta={meta} onPageChange={page => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

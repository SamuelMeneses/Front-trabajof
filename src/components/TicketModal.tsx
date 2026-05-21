'use client';

import { FormEvent, useEffect, useState } from 'react';
import apiClient from '../api/client';
import type { Ticket } from '../types';

interface TicketModalProps {
  ticket?: Ticket;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const gameTypeOptions = ['Lotería', 'Rifa', 'Sorteo', 'Boleta', 'Juego ocasional'];
const statusOptions = ['Pendiente', 'Ganado', 'Perdido'];

export default function TicketModal({ ticket, open, onClose, onSuccess }: TicketModalProps) {
  const [title, setTitle] = useState('');
  const [gameType, setGameType] = useState('Lotería');
  const [gameDate, setGameDate] = useState('');
  const [status, setStatus] = useState('Pendiente');
  const [gameNumber, setGameNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [place, setPlace] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ticket) {
      setTitle('');
      setGameType('Lotería');
      setGameDate('');
      setStatus('Pendiente');
      setGameNumber('');
      setAmount('');
      setPlace('');
      setNotes('');
      setError('');
      return;
    }

    setTitle(ticket.title);
    setGameType(ticket.gameType);
    setGameDate(ticket.gameDate ? ticket.gameDate.slice(0, 16) : '');
    setStatus(ticket.status);
    setGameNumber(ticket.gameNumber ?? '');
    setAmount(ticket.amount?.toString() ?? '');
    setPlace(ticket.place ?? '');
    setNotes(ticket.notes ?? '');
    setError('');
  }, [ticket, open]);

  if (!open) return null;

  const submitLabel = ticket ? 'Guardar cambios' : 'Crear ticket';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('El título del sorteo es obligatorio.');
      return;
    }

    if (!gameDate) {
      setError('La fecha del sorteo es obligatoria.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      title: title.trim(),
      gameType,
      gameNumber: gameNumber.trim() || undefined,
      gameDate: new Date(gameDate).toISOString(),
      amount: amount ? parseFloat(amount) : undefined,
      place: place.trim() || undefined,
      status,
      notes: notes.trim() || undefined,
    };

    try {
      if (ticket) {
        await apiClient.put(`/tickets/${ticket.id}`, payload);
      } else {
        await apiClient.post('/tickets', payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      setError(extractErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!ticket) return;

    const decision = window.confirm('¿Estás seguro de eliminar este ticket? Esta acción no se puede deshacer.');
    if (!decision) return;

    setSaving(true);
    try {
      await apiClient.delete(`/tickets/${ticket.id}`);
      onSuccess();
      onClose();
    } catch (error) {
      setError(extractErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-[min(100vw-2rem,40rem)] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[32px] border border-slate-800/70 bg-slate-950/95 p-8 shadow-[0_40px_100px_-60px_rgba(15,23,42,0.8)] transition-all duration-300 ease-in-out">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">{ticket ? 'Editar ticket' : 'Crear ticket'}</h2>
            <p className="mt-2 text-sm text-slate-400">Completa los detalles del sorteo en un flujo simple de una sola columna.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-slate-200 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:text-white"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">Título del sorteo</label>
            <input
              name="title"
              id="title"
              value={title}
              onChange={event => setTitle(event.target.value)}
              className="w-full border-b border-slate-700 bg-transparent px-0 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-sky-400"
              placeholder="Boleta del jueves"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">Tipo de juego</label>
            <select
              name="gameType"
              id="gameType"
              value={gameType}
              onChange={event => setGameType(event.target.value)}
              className="w-full border-b border-slate-700 bg-transparent px-0 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-sky-400"
            >
              {gameTypeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">Fecha del sorteo</label>
            <input
              type="datetime-local"
              name="gameDate"
              id="gameDate"
              value={gameDate}
              onChange={event => setGameDate(event.target.value)}
              className="w-full border-b border-slate-700 bg-transparent px-0 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-sky-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">Estado</label>
            <select
              name="status"
              id="status"
              value={status}
              onChange={event => setStatus(event.target.value)}
              className="w-full border-b border-slate-700 bg-transparent px-0 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-sky-400"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">Número del juego</label>
            <input
              name="gameNumber"
              id="gameNumber"
              value={gameNumber}
              onChange={event => setGameNumber(event.target.value)}
              className="w-full border-b border-slate-700 bg-transparent px-0 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-sky-400"
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">Valor apostado</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              id="amount"
              value={amount}
              onChange={event => setAmount(event.target.value)}
              className="w-full border-b border-slate-700 bg-transparent px-0 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-sky-400"
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">Lugar de compra</label>
            <input
              name="place"
              id="place"
              value={place}
              onChange={event => setPlace(event.target.value)}
              className="w-full border-b border-slate-700 bg-transparent px-0 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-sky-400"
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">Notas</label>
            <textarea
              name="notes"
              id="notes"
              value={notes}
              onChange={event => setNotes(event.target.value)}
              rows={4}
              className="w-full border-b border-slate-700 bg-transparent px-0 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-sky-400"
              placeholder="Opcional"
            />
          </div>

          {error ? (
            <p className="rounded-3xl border border-red-600/40 bg-red-950/80 px-4 py-3 text-sm text-red-300">{error}</p>
          ) : null}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            {ticket ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="rounded-full border border-slate-700 bg-slate-900/90 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-red-400 hover:bg-red-950/95 disabled:opacity-50"
              >
                Eliminar
              </button>
            ) : null}
            <div className="flex flex-1 justify-end gap-3 sm:flex-none">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-700 bg-transparent px-5 py-3 text-sm font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full border border-slate-700 bg-slate-900/90 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:bg-slate-900/95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Guardando...' : submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function extractErrorMessage(error: unknown) {
  if (!error || typeof error !== 'object' || !('response' in error)) {
    return 'Error inesperado. Intenta de nuevo.';
  }

  const axiosError = error as { response?: { data?: { error?: string } } };
  return axiosError.response?.data?.error ?? 'Error inesperado. Intenta de nuevo.';
}

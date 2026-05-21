'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [loading, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setSubmitting(true);

    try {
      await register({ name: name.trim(), email: email.trim(), password });
    } catch (registerError) {
      const message = registerError instanceof Error ? registerError.message : 'Error en el registro.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.4fr_1fr]">
        <section className="relative flex flex-col justify-center overflow-hidden rounded-[32px] border border-slate-800/60 bg-slate-950/90 p-12 shadow-[0_30px_80px_-55px_rgba(56,189,248,0.28)]">
          <div className="absolute -left-16 top-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
          <p className="text-xs uppercase tracking-[0.4em] text-sky-400/70">Registro</p>
          <h1 className="mt-8 text-5xl font-semibold leading-tight text-white">inicia tu cuenta con nosotros.</h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400">
            
          </p>
        </section>

        <section className="flex items-center justify-center bg-black/80 px-4 py-8">
          <div className="w-full max-w-[440px]">
            <div className="mb-8 space-y-3 rounded-[28px] border border-slate-800/60 bg-slate-950/95 p-8 shadow-[0_20px_60px_-40px_rgba(56,189,248,0.24)] transition-all duration-300 ease-in-out">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-400/80">Crea tu cuenta</p>
              <h2 className="text-3xl font-semibold text-white">Comienza ahora</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">Regístrate y accede a la gestión de tus tickets y sorteos.</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">Nombre</label>
                  <input
                    value={name}
                    onChange={event => setName(event.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full border-b border-slate-700 bg-transparent px-0 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-sky-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full border-b border-slate-700 bg-transparent px-0 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-sky-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-[0.25em] text-slate-500">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    placeholder="********"
                    className="w-full border-b border-slate-700 bg-transparent px-0 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-sky-400"
                  />
                </div>

                {error ? (
                  <p className="rounded-3xl border border-red-600/40 bg-red-950/80 px-4 py-3 text-sm text-red-300">{error}</p>
                ) : null}

                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex rounded-full border border-slate-700 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:bg-slate-900/95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Registrando...' : 'Crear cuenta'}
                  </button>
                </div>
              </form>
            </div>

            <p className="text-center text-sm text-slate-500">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="font-semibold text-sky-400 transition hover:text-sky-300">
                Inicia sesión
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

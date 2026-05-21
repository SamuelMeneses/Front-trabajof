import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.5fr_0.9fr]">
        <section className="relative flex flex-col justify-center overflow-hidden rounded-[32px] border border-slate-800/60 bg-slate-950/90 p-12 shadow-[0_30px_80px_-55px_rgba(56,189,248,0.28)]">
          <div className="absolute -right-16 top-1/2 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
          <p className="text-xs uppercase tracking-[0.35em] text-sky-400/70">Ultra Minimalista</p>
          <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
            Tu gestor de boletos con foco total y una experiencia visual limpia.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400">
            Una interfaz premium en negro absoluto, con jerarquías claras y un ritmo visual que respira. Accede, filtra y gestiona tus tickets sin distracciones.
          </p>
        </section>

        <section className="flex items-center rounded-[32px] border border-slate-800/60 bg-slate-950/95 p-10 shadow-[0_20px_60px_-40px_rgba(56,189,248,0.24)]">
          <div className="w-full space-y-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-400/80">Bienvenido</p>
              <h2 className="text-3xl font-semibold text-white">Inicia sesión o crea una cuenta</h2>
            </div>

            <div className="space-y-4">
              <Link
                href="/login"
                className="block rounded-full border border-slate-700 bg-slate-900/85 px-6 py-4 text-center text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:bg-slate-900/95"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="block rounded-full border border-slate-700 bg-transparent px-6 py-4 text-center text-sm font-semibold text-slate-100 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-400 hover:bg-slate-900/20"
              >
                Crear cuenta
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { createRouteClickHandler } from '../utils/routes.js';

export default function NotFoundPage({ currentPath, onNavigate }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header currentPath={currentPath} onNavigate={onNavigate} />
      <main className="mx-auto flex min-h-[60vh] max-w-[900px] flex-col items-center justify-center px-5 text-center">
        <h1 className="font-rams mb-4 text-4xl font-bold uppercase">Página não encontrada</h1>
        <a
          className="border-2 border-black px-6 py-3 text-sm uppercase tracking-[1px] text-black no-underline transition hover:bg-black hover:text-white"
          href="/"
          onClick={createRouteClickHandler('/', onNavigate)}
        >
          Voltar para a home
        </a>
      </main>
      <Footer showOnDesktop />
    </div>
  );
}

import { useState } from 'react';
import { portfolioProjects } from '../data/projects.js';
import { createRouteClickHandler } from '../utils/routes.js';

const navItems = [
  { href: '/projetos', label: 'Projetos' },
  { href: '/obras', label: 'Obras Concluídas' },
  { href: '/sobre', label: 'Info' },
  { href: '/contato', label: 'Contato' },
];

function getCurrentNavLabel(currentPath) {
  if (currentPath === '/') {
    return '';
  }

  if (currentPath.startsWith('/projetos/')) {
    const slug = currentPath.replace('/projetos/', '');

    return portfolioProjects[slug]?.title || 'Projetos';
  }

  return navItems.find((item) => item.href === currentPath)?.label || '';
}

function getMobileLabelClasses(label) {
  if (label.length > 24) {
    return 'max-w-[175px] text-[10px] leading-[1.08] tracking-[0.12em]';
  }

  if (label.length > 18) {
    return 'max-w-[185px] text-[11px] leading-[1.08] tracking-[0.12em]';
  }

  return 'max-w-[190px] text-[12px] leading-none tracking-[0.12em]';
}

export default function Header({
  currentPath = typeof window === 'undefined' ? '/' : window.location.pathname,
  onNavigate = () => {},
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentNavLabel = getCurrentNavLabel(currentPath);
  const closeAndNavigate = (href) => (event) => {
    setIsMenuOpen(false);
    createRouteClickHandler(href, onNavigate)(event);
  };
  const isActive = (href) => currentPath === href || (href === '/projetos' && currentPath.startsWith('/projetos/'));

  return (
    <>
      <header className="site-header relative z-[100] flex h-[90px] w-full max-w-[100vw] items-center justify-between overflow-hidden rounded-b-[25px] bg-white px-5 py-2.5 shadow-[0_4px_8px_rgba(0,0,0,0.1)] max-[1201px]:fixed max-[1201px]:left-0 max-[1201px]:right-0 max-[1201px]:top-0 max-[1201px]:m-0 max-[1201px]:h-[74px] max-[1201px]:w-full max-[1201px]:max-w-none max-[1201px]:overflow-visible max-[1201px]:rounded-none max-[1201px]:px-0 max-[1201px]:py-0 max-[1201px]:shadow-none">
        <a
          className="max-[1201px]:flex max-[1201px]:h-full max-[1201px]:w-[112px] max-[1201px]:items-center max-[1201px]:justify-start max-[1201px]:pl-8"
          href="/"
          aria-label="Studio Catá Arquitetura"
          onClick={closeAndNavigate('/')}
        >
          <div className="logo">
            <img
              className="ml-[30px] max-h-[70px] w-auto pt-[5px] max-[1201px]:ml-0 max-[1201px]:max-h-[44px] max-[1201px]:p-0"
              src="/img/logopreta.PNG"
              alt="Logo"
            />
          </div>
        </a>

        {currentNavLabel ? (
          <span
            className={`font-rams pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 whitespace-normal break-words text-center font-bold uppercase text-black [text-wrap:balance] max-[1201px]:block ${getMobileLabelClasses(currentNavLabel)}`}
          >
            {currentNavLabel}
          </span>
        ) : null}

        <nav className="max-[1201px]:contents">
          <ul
            className={`nav-list flex list-none transition-transform duration-300 ease-in-out max-[1201px]:fixed max-[1201px]:left-0 max-[1201px]:top-0 max-[1201px]:z-[150] max-[1201px]:m-0 max-[1201px]:h-screen max-[1201px]:w-full max-[1201px]:flex-col max-[1201px]:items-center max-[1201px]:justify-center max-[1201px]:overflow-y-auto max-[1201px]:bg-[rgba(255,255,255,0.98)] max-[1201px]:p-0 max-[1201px]:shadow-none ${
              isMenuOpen ? 'max-[1201px]:translate-y-0' : 'max-[1201px]:-translate-y-[150%]'
            }`}
          >
            <li className="logo-item mb-5 w-full text-center min-[1200px]:hidden">
              <a href="/" onClick={closeAndNavigate('/')}>
                <div className="logo">
                  <img
                    className="mx-auto max-h-[72px] w-auto p-0"
                    src="/img/logopreta.PNG"
                    alt="Logo"
                  />
                </div>
              </a>
            </li>

            {navItems.map((item) => (
              <li
                className="nav-item relative mr-[50px] max-[1201px]:m-0 max-[1201px]:w-full max-[1201px]:text-center"
                key={item.href}
              >
                <a
                  className={`nav-link font-rams relative text-xl font-bold uppercase tracking-[2px] text-black no-underline min-[1200px]:after:absolute min-[1200px]:after:-bottom-2.5 min-[1200px]:after:left-0 min-[1200px]:after:h-[3px] min-[1200px]:after:rounded-[1px] min-[1200px]:after:bg-black min-[1200px]:after:transition-all max-[1201px]:block max-[1201px]:w-full max-[1201px]:py-5 max-[1201px]:text-2xl ${
                    isActive(item.href)
                      ? 'min-[1200px]:after:w-full'
                      : 'min-[1200px]:after:w-0 min-[1200px]:hover:after:w-full'
                  }`}
                  href={item.href}
                  onClick={closeAndNavigate(item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="mobile-menu hidden h-9 w-9 shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px] bg-transparent p-0 text-black max-[1201px]:relative max-[1201px]:z-[200] max-[1201px]:mr-8 max-[1201px]:flex"
          type="button"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span
            className={`block h-[2px] w-[24px] bg-black transition duration-300 ${
              isMenuOpen ? 'translate-y-[7px] rotate-45' : ''
            }`}
            aria-hidden="true"
          />
          <span
            className={`block h-[2px] w-[24px] bg-black transition duration-300 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
            aria-hidden="true"
          />
          <span
            className={`block h-[2px] w-[24px] bg-black transition duration-300 ${
              isMenuOpen ? '-translate-y-[7px] -rotate-45' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      </header>
      <div className="hidden max-[1201px]:block max-[1201px]:h-[74px]" aria-hidden="true" />
    </>
  );
}

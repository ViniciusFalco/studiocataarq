import { useEffect, useMemo, useState } from 'react';
import { portfolioProjects } from './data/projects.js';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import Home from './pages/Home.jsx';
import ListingPage from './pages/ListingPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PortfolioPage from './pages/PortfolioPage.jsx';
import { normalizePath } from './utils/routes.js';

function getPathFromLocation() {
  return normalizePath(window.location.pathname);
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(getPathFromLocation);

  useEffect(() => {
    const normalizedPath = getPathFromLocation();

    if (window.location.pathname !== normalizedPath) {
      window.history.replaceState({}, '', normalizedPath);
    }

    const handlePopState = () => {
      setCurrentPath(getPathFromLocation());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const titleByPath = {
      '/': 'Studio Catá Arquitetura',
      '/projetos': 'Projetos',
      '/obras': 'Studio Catá Arquitetura',
      '/sobre': 'Studio Catá Arquitetura',
      '/contato': 'Contato - Studio Cata',
    };

    const slug = currentPath.replace('/projetos/', '');
    document.title = portfolioProjects[slug]?.title || titleByPath[currentPath] || 'Studio Catá Arquitetura';
  }, [currentPath]);

  const navigate = useMemo(
    () => (href) => {
      const nextPath = normalizePath(href);

      if (nextPath !== currentPath) {
        window.history.pushState({}, '', nextPath);
        setCurrentPath(nextPath);
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    },
    [currentPath],
  );

  let page;

  if (currentPath === '/projetos') {
    page = <ListingPage type="projects" currentPath={currentPath} onNavigate={navigate} />;
  } else if (currentPath === '/obras') {
    page = <ListingPage type="works" currentPath={currentPath} onNavigate={navigate} />;
  } else if (currentPath === '/sobre') {
    page = <AboutPage currentPath={currentPath} onNavigate={navigate} />;
  } else if (currentPath === '/contato') {
    page = <ContactPage currentPath={currentPath} onNavigate={navigate} />;
  } else if (currentPath.startsWith('/projetos/')) {
    const slug = currentPath.replace('/projetos/', '');
    const project = portfolioProjects[slug];

    if (project) {
      page = <PortfolioPage project={project} currentPath={currentPath} onNavigate={navigate} />;
    }
  } else if (currentPath === '/') {
    page = <Home currentPath={currentPath} onNavigate={navigate} />;
  }

  return (
    <div className="page-transition" key={currentPath}>
      {page || <NotFoundPage currentPath={currentPath} onNavigate={navigate} />}
    </div>
  );
}

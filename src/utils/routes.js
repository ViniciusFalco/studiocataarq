const legacyRoutes = {
  '/index.html': '/',
  '/projetos.html': '/projetos',
  '/obras.html': '/obras',
  '/sobrenos.html': '/sobre',
  '/contato.html': '/contato',
  '/pags/anexo.html': '/projetos/anexo',
  '/pags/apesiqueira.html': '/projetos/apesiqueira',
  '/pags/cozinhaminas.html': '/projetos/cozinhaminas',
  '/pags/domus.html': '/projetos/domus',
  '/pags/ecosuites.html': '/projetos/ecosuites',
  '/pags/escolatekopora.html': '/projetos/escolatekopora',
  '/pags/maxhaus.html': '/projetos/maxhaus',
  '/pags/nostra.html': '/projetos/nostra',
  '/pags/panamby.html': '/projetos/panamby',
  '/pags/ribeiraodasneves.html': '/projetos/ribeiraodasneves',
  '/pags/rochedo.html': '/projetos/rochedo',
  '/pags/tucunare.html': '/projetos/tucunare',
};

export function normalizePath(pathname) {
  const pathWithoutTrailingSlash =
    pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  return legacyRoutes[pathWithoutTrailingSlash] || pathWithoutTrailingSlash || '/';
}

export function isInternalRoute(href) {
  return href.startsWith('/') && !href.startsWith('//');
}

export function createRouteClickHandler(href, navigate) {
  return (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      !isInternalRoute(href)
    ) {
      return;
    }

    event.preventDefault();
    navigate(href);
  };
}

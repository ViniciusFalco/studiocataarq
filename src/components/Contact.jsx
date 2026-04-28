const contactLinks = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/+5532998124309?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20sobre%20um%20projeto%20de%20arquitetura.',
    ariaLabel: 'Falar no WhatsApp',
    icon: (
      <path d="M20.52 3.48A11.94 11.94 0 0 0 12.01 0C5.39 0 .03 5.36.03 11.98c0 2.11.55 4.16 1.61 5.98L0 24l6.2-1.62a12.02 12.02 0 0 0 5.81 1.48h.01c6.62 0 11.98-5.36 11.98-11.99A11.93 11.93 0 0 0 20.52 3.48ZM12.02 21.5h-.01a9.49 9.49 0 0 1-4.84-1.33l-.35-.2-3.69.96.99-3.6-.23-.37a9.49 9.49 0 1 1 8.13 4.54Zm5.49-7.2c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.18.2-.35.22-.65.07-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.13 3.26 5.17 4.57.72.31 1.28.5 1.73.64.73.23 1.39.2 1.92.12.59-.09 1.77-.72 2.02-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/studiocataarquitetura',
    ariaLabel: 'Visitar perfil no Instagram',
    icon: (
      <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7Zm0 2h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3Zm11 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
    ),
  },
];

export default function Contact() {
  return (
    <section className="flex min-h-[calc(100vh-90px)] items-center bg-white px-5 py-24 text-black max-[1201px]:min-h-[calc(100vh-74px)] max-[768px]:py-16">
      <div className="mx-auto w-full max-w-[760px]">
        <h1 className="font-rams text-[clamp(2.25rem,6vw,5rem)] font-bold uppercase leading-none tracking-normal text-black">
          Contato
        </h1>

        <nav className="mt-14 border-y border-black max-[768px]:mt-10" aria-label="Contato">
          {contactLinks.map((link, index) => (
            <a
              className={`group flex min-h-[86px] items-center justify-between gap-6 px-0 py-6 text-black no-underline transition-all duration-300 hover:px-5 hover:bg-black hover:text-white max-[768px]:min-h-[74px] max-[768px]:gap-4 max-[768px]:py-5 ${
                index > 0 ? 'border-t border-black' : ''
              }`}
              href={link.href}
              target="_blank"
              rel="noopener"
              aria-label={link.ariaLabel}
              key={link.label}
            >
              <span className="flex min-w-0 items-center gap-5 max-[768px]:gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center border border-current max-[768px]:h-10 max-[768px]:w-10">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    {link.icon}
                  </svg>
                </span>
                <span className="font-rams text-[clamp(1.35rem,3vw,2rem)] font-bold uppercase leading-tight">
                  {link.label}
                </span>
              </span>
              <span
                className="h-px w-12 shrink-0 bg-current transition-transform duration-300 group-hover:translate-x-1 max-[768px]:w-8"
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

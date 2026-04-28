export default function Footer({ showOnDesktop = false }) {
  return (
    <footer
      className={`site-footer relative z-10 w-full border-t border-[#e0e0e0] bg-[#f8f8f8] py-5 text-center font-sans max-[768px]:py-[15px] ${
        showOnDesktop ? '' : 'min-[1201px]:hidden'
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-5">
        <p className="m-0 font-sans text-sm font-extralight tracking-[0.5px] text-[#666] normal-case max-[768px]:text-xs">
          Studio Catá Arquitetura - Todos os direitos reservados - 2026
        </p>
      </div>
    </footer>
  );
}

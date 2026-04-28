export default function ScrollToSectionButton({ targetRef, children = 'Conheça mais sobre o projeto' }) {
  return (
    <section className="my-10 px-5 text-center max-[768px]:my-[30px] max-[480px]:my-[25px]">
      <div className="mx-auto max-w-[600px]">
        <button
          className="group relative cursor-pointer overflow-hidden border-2 border-[#333] bg-transparent px-[30px] py-[15px] text-base font-extralight tracking-[0.5px] text-[#333] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#333] hover:text-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] active:translate-y-0 max-[768px]:px-[25px] max-[768px]:py-3 max-[768px]:text-[15px] max-[480px]:px-5 max-[480px]:py-2.5 max-[480px]:text-sm"
          type="button"
          onClick={() => targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          {children}
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
        </button>
      </div>
    </section>
  );
}

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { createRouteClickHandler } from '../utils/routes.js';

const sections = [
  {
    kind: 'project',
    href: '/projetos/apesiqueira',
    image: '/img/projetos/apesiqueira/lite/b8a47d3f0a324c9694fb42988bd2a6ed.jpg',
    imageAlt: 'Apê Siqueira',
    projectTitle: 'Apê Siqueira',
    projectSubtitle: 'Cataguases, MG - 2025',
    title: 'Nossa Arquitetura',
    paragraphs: [
      'Somos um estúdio de arquitetura sediado em Cataguases, MG. Iniciamos nossa atuação em 2020 com projetos em Minas Gerais, Rio de Janeiro e São Paulo. Desenvolvemos trabalhos em diversas escalas e segmentos, com ênfase em projetos residenciais, culturais e institucionais, buscando sempre uma relação harmônica entre a edificação e o meio em que se insere, seja ele urbano ou rural.',
      'Nossa Arquitetura baseia-se na relação harmônica e na integração entre os diferentes elementos que compõem os espaços e os ambientes, no uso de formas puras, na racionalidade estrutural e no uso de materiais em sua essência. Buscamos sempre alcançar soluções criativas e inovadoras e procuramos tirar o melhor proveito dos condicionantes naturais: o sol, a ventilação, a vegetação local, e a topografia.',
      'Somos um pequeno estúdio e dessa forma podemos oferecer um serviço pessoal e personalizado aos nossos clientes.',
    ],
  },
  {
    image: '/img/sobrenos/Mariela_2.jpg',
    imageAlt: 'Quem sou?',
    title: 'Quem sou?',
    imageClass: 'object-center min-[1201px]:object-[center_20%]',
    paragraphs: [
      'Mariela Salgado Lacerda de Oliveira nasceu em Cataguases, MG e formou-se em Arquitetura e Urbanismo pela Universidade Federal do Rio de Janeiro (UFRJ) em 2013. Recebeu, ainda neste ano, o Prêmio Arquiteto do Amanhã, concedido pelo Instituto dos Arquitetos do Brasil (IAB-RJ) com seu trabalho final de graduação.',
      'Entre 2013 e 2017 atuou como arquiteta em dois grandes escritórios do Rio de Janeiro, com uma breve passagem por São Paulo em 2014. Concluiu, em 2017, o Mestrado Profissional em Projeto e Patrimônio pelo Programa de Pós-graduação em Arquitetura da UFRJ (PROARQ) e lecionou, entre 2017 e 2019, as disciplinas de Concepção da Forma Arquitetônica II, Desenho de Observação I e Gráfica Digital no Departamento de Análise e Representação da Forma da Universidade Federal do Rio de Janeiro (DARF/UFRJ).',
      'Neste mesmo período atuou como bolsista da Fundação Casa de Rui Barbosa desenvolvendo, junto ao Núcleo de Preservação Arquitetônica (NPARQ), a pesquisa "Plano de Conservação Preventiva do Museu Casa de Rui Barbosa: Conservação Programada do Jardim Histórico". Em 2020 retornou à Cataguases e fundou o Studio Catá Arquitetura.',
    ],
  },
  {
    kind: 'project',
    href: '/projetos/escolatekopora',
    image: '/img/projetos/08 - ESCOLA TEKO PORÃ - MANAUS, AM - 2024/escolatekopora_2.jpg',
    imageAlt: 'Escola Teko Porã',
    projectTitle: 'Escola Teko Porã',
    projectSubtitle: 'Manaus, AM - 2025',
    title: 'Diálogo',
    paragraphs: [
      'Na elaboração de nossos projetos, procuramos compreender as necessidades e objetivos de cada cliente. A cada projeto, buscamos alcançar um resultado de excelência e não medimos esforços nesse processo. Entendemos que este é um importante investimento, muitas vezes um projeto de vida, e, por isso, buscamos sempre o diálogo como forma de construir uma proposta coerente com as expectativas, as necessidades e a identidade dos nossos clientes, resultando assim em projetos autênticos em seus aspectos conceituais e construtivos.',
    ],
  },
];

function ImagePanel({ section, onNavigate }) {
  const img = (
    <img
      className={`block w-full object-cover transition duration-500 min-[1201px]:h-[540px] min-[1201px]:group-hover:scale-[1.015] min-[1201px]:group-hover:brightness-[0.72] ${
        section.imageClass || ''
      }`}
      src={section.image}
      alt={section.imageAlt}
      loading="lazy"
    />
  );

  if (section.kind !== 'project') {
    return (
      <div className="relative w-full overflow-hidden bg-[#f6f6f6]">
        {img}
      </div>
    );
  }

  return (
    <div className="group relative w-full overflow-hidden bg-[#f6f6f6]">
      <a
        className="relative block text-black no-underline"
        href={section.href}
        aria-label={`Ver projeto ${section.projectTitle}`}
        onClick={createRouteClickHandler(section.href, onNavigate)}
      >
        {img}
        <h3 className="font-rams pointer-events-none absolute left-1/2 top-[45%] z-10 m-0 w-[90%] -translate-x-1/2 text-center text-[42px] font-bold uppercase leading-tight text-white opacity-0 [text-shadow:0_2px_8px_rgba(0,0,0,.45)] transition-opacity duration-300 group-hover:opacity-100 max-[1200px]:hidden">
          {section.projectTitle}
        </h3>
        <h2 className="font-rams pointer-events-none absolute left-1/2 top-[62%] z-10 m-0 w-[90%] -translate-x-1/2 text-center text-sm font-normal uppercase text-white opacity-0 [text-shadow:0_2px_8px_rgba(0,0,0,.45)] transition-opacity duration-300 group-hover:opacity-100 max-[1200px]:hidden">
          {section.projectSubtitle}
        </h2>
        <span className="absolute inset-0 opacity-0 transition duration-300 group-hover:bg-black/35 group-hover:opacity-100 max-[1200px]:hidden" />
      </a>
    </div>
  );
}

export default function AboutPage({ currentPath, onNavigate }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header currentPath={currentPath} onNavigate={onNavigate} />
      <main className="mx-auto flex max-w-[1180px] flex-col gap-[96px] px-10 py-[110px] max-[1200px]:gap-0 max-[1200px]:px-0 max-[1200px]:py-0">
        {sections.map((section) => (
          <section
            className="grid grid-cols-[minmax(280px,430px)_minmax(0,620px)] items-start gap-[88px] border-t border-black/15 pt-[56px] first:border-t-0 first:pt-0 max-[1200px]:flex max-[1200px]:min-h-0 max-[1200px]:flex-col max-[1200px]:gap-0 max-[1200px]:overflow-hidden max-[1200px]:border-t-0 max-[1200px]:pt-0"
            key={section.title}
          >
            <ImagePanel section={section} onNavigate={onNavigate} />
            <article className="max-w-[620px] p-0 max-[1200px]:max-w-none max-[1200px]:px-5 max-[1200px]:py-10">
              <h3 className="font-rams mb-10 text-[42px] font-bold uppercase leading-tight tracking-normal text-black max-[1200px]:mb-7 max-[1200px]:text-[35px]">
                {section.title}
              </h3>
              {section.paragraphs.map((paragraph) => (
                <p
                  className="font-comfortaa mb-7 text-left text-[17px] font-normal leading-[1.9] text-[#222] last:mb-0 max-[1200px]:text-base max-[1200px]:leading-[1.8]"
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </article>
          </section>
        ))}
      </main>
      <Footer showOnDesktop />
    </div>
  );
}

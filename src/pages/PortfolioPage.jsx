import { useMemo, useRef } from 'react';
import BackToTopButton from '../components/BackToTopButton.jsx';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import PortfolioGallery from '../components/PortfolioGallery.jsx';
import ScrollToSectionButton from '../components/ScrollToSectionButton.jsx';
import { normalizeGalleryImages } from '../data/projects.js';

function ProjectIntro({ intro, targetRef }) {
  if (!intro) {
    return null;
  }

  return (
    <section
      ref={targetRef}
      className="mx-auto mb-10 mt-20 max-w-[1400px] px-5 max-[768px]:mb-[30px] max-[768px]:mt-[60px] max-[768px]:px-[15px] max-[480px]:mb-[25px] max-[480px]:mt-[50px] min-[3840px]:max-w-[1800px] min-[3840px]:mt-[100px] min-[3840px]:mb-[50px]"
    >
      <div className="rounded-xl border border-white/20 bg-[linear-gradient(135deg,#fafafa_0%,#f5f5f5_100%)] px-[50px] py-[60px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] max-[768px]:px-[30px] max-[768px]:py-10 max-[480px]:px-5 max-[480px]:py-[30px] min-[3840px]:px-[60px] min-[3840px]:py-20">
        <h2 className="font-rams mb-10 text-left text-[32px] font-bold leading-tight tracking-normal text-[#2c2c2c] max-[768px]:mb-[30px] max-[768px]:text-[26px] max-[480px]:mb-[25px] max-[480px]:text-[22px] min-[3840px]:mb-[50px] min-[3840px]:text-[40px]">
          {intro.heading}{' '}
          <strong className="font-normal text-[#1a1a1a]">{intro.headingHighlight}</strong>
        </h2>
        <div>
          {intro.paragraphs.map((paragraph) => (
            <p
              className={`font-comfortaa mb-7 text-justify text-lg font-normal leading-[1.8] text-[#444] last:mb-0 max-[768px]:text-base max-[768px]:leading-[1.7] max-[480px]:text-[15px] min-[3840px]:mb-8 min-[3840px]:text-[22px] ${
                paragraph.highlight
                  ? 'text-xl italic text-[#1a1a1a] max-[768px]:text-lg max-[480px]:text-base min-[3840px]:text-2xl'
                  : ''
              }`}
              key={paragraph.text}
            >
              {paragraph.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectMeta({ meta }) {
  if (!meta?.length) {
    return null;
  }

  return (
    <div className="font-comfortaa mx-auto -mt-6 mb-10 max-w-[900px] px-5 text-center text-sm leading-relaxed text-[#444] max-[1200px]:-mt-4 max-[1200px]:text-xs">
      {meta.map((line) => (
        <p className="m-0" key={line}>
          {line}
        </p>
      ))}
    </div>
  );
}

function ProjectTitle({ title }) {
  if (!title) {
    return null;
  }

  return (
    <h1 className="font-rams mx-auto mb-8 mt-14 hidden max-w-[1400px] px-5 text-center text-[34px] font-bold uppercase leading-tight tracking-[0.08em] text-black min-[1202px]:block min-[3840px]:max-w-[1800px] min-[3840px]:text-[46px]">
      {title}
    </h1>
  );
}

export default function PortfolioPage({ project, currentPath, onNavigate }) {
  const detailsRef = useRef(null);
  const images = useMemo(() => normalizeGalleryImages(project.images), [project.images]);

  return (
    <div className="min-h-screen bg-white text-black">
      <Header currentPath={currentPath} onNavigate={onNavigate} />
      <BackToTopButton />
      <main>
        <ProjectTitle title={project.title} />
        <ProjectMeta meta={project.meta} />
        {project.intro && <ScrollToSectionButton targetRef={detailsRef} />}
        <PortfolioGallery images={images} columns={project.columns} />
        <ProjectIntro intro={project.intro} targetRef={detailsRef} />
      </main>
      <Footer showOnDesktop />
    </div>
  );
}

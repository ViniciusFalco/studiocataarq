import Header from '../components/Header.jsx';
import Projects from '../components/Projects.jsx';
import Footer from '../components/Footer.jsx';
import { projectCards, workCards } from '../data/projects.js';

export default function ListingPage({ type, currentPath, onNavigate }) {
  const isWorks = type === 'works';
  const items = isWorks ? workCards : projectCards;

  return (
    <div className="min-h-screen bg-white text-black">
      <Header currentPath={currentPath} onNavigate={onNavigate} />
      <main>
        <Projects
          items={items}
          variant={isWorks ? 'works' : 'list'}
          onNavigate={onNavigate}
        />
      </main>
      <Footer />
    </div>
  );
}

import Header from '../components/Header.jsx';
import Projects from '../components/Projects.jsx';
import Footer from '../components/Footer.jsx';

export default function Home({ currentPath = '/', onNavigate = () => {} }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header currentPath={currentPath} onNavigate={onNavigate} />
      <main>
        <Projects onNavigate={onNavigate} />
      </main>
      <Footer />
    </div>
  );
}

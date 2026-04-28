import Header from '../components/Header.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';

export default function ContactPage({ currentPath, onNavigate }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header currentPath={currentPath} onNavigate={onNavigate} />
      <main>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

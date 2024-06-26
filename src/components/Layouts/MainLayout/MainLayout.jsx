import Footer from '../../Footer/Footer';
import TopMainNav from '../../Navigation/TopMainNav/TopMainNav';
import '../../App/App.css';

export default function MainLayout({ children }) {
  return (
    <div>
      <TopMainNav />
      <div>{children}</div>
      <Footer />
    </div>
  );
}

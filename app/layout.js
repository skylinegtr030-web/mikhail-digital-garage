import './globals.css';
import SiteHeader from '../components/SiteHeader';

export const metadata = {
  title: { default: 'Михаил — веб-разработка', template: '%s — Михаил' },
  description: 'Сайты, веб-приложения, автоматизация и интернет-магазины.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <footer className="footer">
          <span>© 2026 MIKHAIL.DIGITAL</span>
          <span>Сайты · Приложения · Автоматизация</span>
        </footer>
      </body>
    </html>
  );
}

import Link from 'next/link';
import { navigation } from '../lib/pages';

export default function SiteHeader() {
  return (
    <header className="siteHeader">
      <Link className="brand" href="/" aria-label="На главную">
        <span className="brandMark">M</span>
        <span>MIKHAIL.DIGITAL</span>
      </Link>
      <nav className="nav" aria-label="Основная навигация">
        {navigation.map(item => <Link key={item.href} href={item.href}>{item.title}</Link>)}
      </nav>
    </header>
  );
}

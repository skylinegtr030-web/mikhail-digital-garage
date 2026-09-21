import Link from 'next/link';
import { notFound } from 'next/navigation';
import { pages } from '../../lib/pages';

export function generateStaticParams() {
  return pages.map(page => ({ slug: page.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = pages.find(item => item.slug === slug);
  return page ? { title: page.title, description: page.description } : {};
}

export default async function DetailPage({ params }) {
  const { slug } = await params;
  const page = pages.find(item => item.slug === slug);
  if (!page) notFound();
  return (
    <>
      <section className="pageHero shell">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p className="lead">{page.description}</p>
      </section>
      <section className="shell section">
        <div className="featureGrid">
          {page.items.map((item, index) => (
            <article className="feature" key={item}>
              <span className="index">0{index + 1}</span>
              <h2>{item}</h2>
              <p>Этот блок будет дополнен содержанием, примерами и собственной уместной интерактивностью.</p>
            </article>
          ))}
        </div>
      </section>
      <section className="shell cta">
        <div><p className="eyebrow">Следующий шаг</p><h2>Обсудим вашу задачу?</h2></div>
        <Link className="button primary" href="/contact">Связаться</Link>
      </section>
    </>
  );
}

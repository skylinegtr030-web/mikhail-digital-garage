import Link from 'next/link';
import { pages } from '../lib/pages';

export default function HomePage() {
  return (
    <>
      <section className="hero shell">
        <p className="eyebrow">Веб-разработка и цифровые продукты</p>
        <h1>Создаю сайты, которые понятно объясняют и помогают действовать.</h1>
        <p className="lead">От структуры и интерфейса до разработки, интеграций и запуска.</p>
        <div className="actions">
          <Link className="button primary" href="/cases">Смотреть проекты</Link>
          <Link className="button" href="/contact">Обсудить задачу</Link>
        </div>
      </section>

      <section className="shell section">
        <div className="sectionHead">
          <p className="eyebrow">Направления</p>
          <h2>Каждый блок — отдельная понятная история.</h2>
        </div>
        <div className="grid">
          {pages.slice(0, 5).map((page, index) => (
            <Link className="card" href={`/${page.slug}`} key={page.slug}>
              <span className="index">0{index + 1}</span>
              <h3>{page.title}</h3>
              <p>{page.description}</p>
              <span className="more">Подробнее →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell statement">
        <p className="eyebrow">Подход</p>
        <h2>Сначала смысл и сценарий. Затем визуальная система и аккуратная интерактивность.</h2>
      </section>
    </>
  );
}

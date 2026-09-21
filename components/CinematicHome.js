'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './CinematicHome.module.css';

const capabilities = [
  { number: '01', title: 'Сайты', text: 'Выразительные маркетинговые страницы, которые ведут к действию.', href: '/websites' },
  { number: '02', title: 'Приложения', text: 'Интерфейсы, кабинеты и сервисы для реальной ежедневной работы.', href: '/web-apps' },
  { number: '03', title: 'Автоматизация', text: 'Связанные процессы, уведомления и данные вместо ручной рутины.', href: '/automation' },
  { number: '04', title: 'E-commerce', text: 'Каталог, заказ и оплата как единый понятный сценарий.', href: '/ecommerce' }
];

const frames = [
  ['FRAME 01', 'СМЫСЛ', 'Сначала находим главную мысль и убираем шум.'],
  ['FRAME 02', 'СЦЕНАРИЙ', 'Выстраиваем путь человека от первого экрана до действия.'],
  ['FRAME 03', 'ДВИЖЕНИЕ', 'Добавляем анимацию только там, где она усиливает историю.']
];

export default function CinematicHome() {
  const root = useRef(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let raf = 0;
    let mx = innerWidth * .5;
    let my = innerHeight * .5;

    const paint = () => {
      node.style.setProperty('--mx', `${mx}px`);
      node.style.setProperty('--my', `${my}px`);
      node.style.setProperty('--scroll', `${scrollY}`);
      raf = 0;
    };
    const update = event => {
      if (event) { mx = event.clientX; my = event.clientY; }
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add(styles.visible);
      });
    }, { threshold: .14 });

    node.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
    addEventListener('pointermove', update, { passive: true });
    addEventListener('scroll', update, { passive: true });
    paint();
    return () => {
      observer.disconnect();
      removeEventListener('pointermove', update);
      removeEventListener('scroll', update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const tilt = event => {
    const card = event.currentTarget;
    const box = card.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    card.style.setProperty('--ry', `${x * 10}deg`);
    card.style.setProperty('--rx', `${y * -8}deg`);
  };
  const resetTilt = event => {
    event.currentTarget.style.setProperty('--ry', '0deg');
    event.currentTarget.style.setProperty('--rx', '0deg');
  };

  return (
    <div ref={root} className={styles.cinema}>
      <div className={styles.opening} aria-hidden="true"><span /><span /></div>
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.cursorLight} aria-hidden="true" />

      <section className={styles.hero}>
        <div className={styles.ambient} aria-hidden="true"><i /><i /><i /></div>
        <div className={styles.heroMeta}>
          <span>MIKHAIL.DIGITAL</span>
          <span>WEB DEVELOPER / 2026</span>
          <span>MOSCOW · WORLDWIDE</span>
        </div>
        <div className={styles.heroTitle} aria-label="Создаю цифровое движение">
          <span className={styles.lineA}>СОЗДАЮ</span>
          <span className={styles.lineB}>ЦИФРОВОЕ</span>
          <span className={styles.lineC}>ДВИЖЕНИЕ</span>
        </div>
        <p className={styles.heroLead}>Сайты и веб-продукты, которые ощущаются как история — и работают как инструмент.</p>
        <div className={styles.heroActions}>
          <Link href="/cases" className={styles.solidButton}>Смотреть проекты <b>↗</b></Link>
          <Link href="/contact" className={styles.textLink}>Обсудить проект <span>→</span></Link>
        </div>
        <div className={styles.scrollCue}><span>SCROLL TO PLAY</span><i /></div>
      </section>

      <div className={styles.ticker} aria-hidden="true">
        <div>DESIGN — DEVELOPMENT — MOTION — AUTOMATION — DIGITAL PRODUCTS — DESIGN — DEVELOPMENT — MOTION — AUTOMATION — DIGITAL PRODUCTS —</div>
      </div>

      <section className={styles.manifesto}>
        <div className={`${styles.reveal} ${styles.sectionLabel}`} data-reveal><span>ACT I</span><span>MANIFESTO</span></div>
        <h2 className={styles.reveal} data-reveal>НЕ ПРОСТО<br />СТРАНИЦЫ.<br /><em>СЦЕНЫ.</em></h2>
        <div className={`${styles.reveal} ${styles.manifestoCopy}`} data-reveal>
          <p>Каждый экран получает ритм, иерархию и характер. Интерактивность не прячет содержание — она делает его сильнее.</p>
          <span>01 — 03</span>
        </div>
      </section>

      <section className={styles.capabilities}>
        <div className={`${styles.reveal} ${styles.sectionLabel}`} data-reveal><span>ACT II</span><span>CAPABILITIES</span></div>
        <div className={styles.capabilityGrid}>
          {capabilities.map(item => (
            <Link
              href={item.href}
              className={`${styles.reveal} ${styles.capability}`}
              data-reveal
              key={item.number}
              onPointerMove={tilt}
              onPointerLeave={resetTilt}
            >
              <span className={styles.capNumber}>{item.number}</span>
              <div className={styles.capVisual}><i /><i /><b>{item.number}</b></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className={styles.capArrow}>↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.sequence}>
        <div className={`${styles.reveal} ${styles.sectionLabel}`} data-reveal><span>ACT III</span><span>THE PROCESS</span></div>
        <div className={styles.frameStrip}>
          {frames.map((frame, index) => (
            <article className={`${styles.reveal} ${styles.frame}`} data-reveal key={frame[0]}>
              <div className={styles.framePicture}>
                <span>{frame[0]}</span>
                <i style={{ '--delay': `${index * -.8}s` }} />
                <b>0{index + 1}</b>
              </div>
              <div><span>{frame[0]}</span><h3>{frame[1]}</h3><p>{frame[2]}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.finale}>
        <span className={styles.reveal} data-reveal>FINAL SCENE</span>
        <h2 className={styles.reveal} data-reveal>ЕСТЬ ИДЕЯ?<br /><em>ДАДИМ ЕЙ ХОД.</em></h2>
        <Link href="/contact" className={`${styles.reveal} ${styles.finalButton}`} data-reveal>
          <span>НАЧАТЬ ПРОЕКТ</span><b>↗</b>
        </Link>
        <div className={styles.endMark}>MIKHAIL.DIGITAL © 2026 <span>●</span> AVAILABLE FOR SELECTED PROJECTS</div>
      </section>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CreativeBridge.module.css';

const modes = [
  { id: '01', key: 'visual', title: 'VISUAL', ru: 'ВИЗУАЛ', color: '#ff382e', rgb: '255,56,46', text: 'Композиция, типографика и цвет превращают содержание в узнаваемый образ.' },
  { id: '02', key: 'motion', title: 'MOTION', ru: 'ДВИЖЕНИЕ', color: '#8c67ff', rgb: '140,103,255', text: 'Анимация связывает состояния интерфейса и управляет вниманием человека.' },
  { id: '03', key: 'code', title: 'CODE', ru: 'КОД', color: '#34f58a', rgb: '52,245,138', text: 'Разработка превращает идею в быстрый, адаптивный и работающий продукт.' }
];

export default function CreativeBridge() {
  const [active, setActive] = useState(1);
  const scene = useRef(null);

  useEffect(() => {
    const mode = modes[active];
    const root = document.documentElement;
    root.style.setProperty('--site-accent', mode.color);
    root.style.setProperty('--site-accent-rgb', mode.rgb);
    document.body.dataset.colorMode = mode.key;
    sessionStorage.setItem('site-color-mode', mode.key);
    document.body.classList.remove('themePulse');
    void document.body.offsetWidth;
    document.body.classList.add('themePulse');
    const timer = setTimeout(() => document.body.classList.remove('themePulse'), 600);
    window.dispatchEvent(new CustomEvent('site:color', { detail: mode }));
    return () => clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    const saved = sessionStorage.getItem('site-color-mode');
    const index = modes.findIndex(mode => mode.key === saved);
    if (index >= 0) setActive(index);
  }, []);

  const move = event => {
    const box = scene.current.getBoundingClientRect();
    scene.current.style.setProperty('--x', `${event.clientX - box.left}px`);
    scene.current.style.setProperty('--y', `${event.clientY - box.top}px`);
    scene.current.style.setProperty('--nx', `${(event.clientX - box.left) / box.width - .5}`);
    scene.current.style.setProperty('--ny', `${(event.clientY - box.top) / box.height - .5}`);
  };

  return (
    <section
      ref={scene}
      className={`${styles.bridge} ${styles[modes[active].key]}`}
      onPointerMove={move}
      aria-label="Три слоя креативной веб-разработки"
    >
      <div className={styles.coordinates} aria-hidden="true">
        <span>X 055.752</span><span>CREATIVE SYSTEM / 01</span><span>Y 037.618</span>
      </div>
      <div className={styles.light} aria-hidden="true" />
      <div className={styles.backWord} aria-hidden="true">{modes[active].title}</div>

      <div className={styles.panels}>
        {modes.map((mode, index) => (
          <button
            type="button"
            key={mode.key}
            className={`${styles.panel} ${active === index ? styles.active : ''}`}
            onClick={() => setActive(index)}
            onPointerEnter={() => setActive(index)}
            aria-pressed={active === index}
          >
            <span className={styles.number}>{mode.id}</span>
            <span className={styles.word}>{mode.title}</span>
            <span className={styles.ru}>{mode.ru}</span>
            <i aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className={styles.description} key={modes[active].key}>
        <span>{modes[active].id} / 03</span>
        <p>{modes[active].text}</p>
      </div>
      <div className={styles.instruction}>HOVER / CLICK TO TRANSFORM</div>
      <div className={styles.exit}>СОБИРАЕМ ВМЕСТЕ <span>↓</span></div>
    </section>
  );
}

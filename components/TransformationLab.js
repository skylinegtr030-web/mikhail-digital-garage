'use client';

import { useRef } from 'react';
import styles from './TransformationLab.module.css';

export default function TransformationLab() {
  const lab = useRef(null);

  const change = event => {
    lab.current?.style.setProperty('--split', `${event.currentTarget.value}%`);
  };

  return (
    <section ref={lab} className={styles.lab}>
      <div className={styles.head}>
        <div className={styles.meta}><span>MODULE 02</span><span>TRANSFORMATION LAB</span></div>
        <h2><span>ПРЕВРАЩАЕМ</span><span>ОБЫЧНОЕ</span><span>В НЕЗАБЫВАЕМОЕ</span></h2>
        <p>Потяните разделитель. Слева — просто работающий шаблон. Справа — интерфейс с идеей, характером и движением.</p>
      </div>

      <div className={styles.comparison}>
        <div className={styles.before} aria-hidden="true">
          <div className={styles.browserTop}><i /><i /><i /><span>template.website</span></div>
          <div className={styles.beforePage}>
            <header><b>LOGO</b><span>About&nbsp;&nbsp; Services&nbsp;&nbsp; Contact</span></header>
            <main>
              <div><small>WELCOME TO OUR WEBSITE</small><h3>We create digital solutions</h3><p>Professional services for your growing business. Simple, reliable and effective.</p><button>Learn more</button></div>
              <aside><i /><i /><i /></aside>
            </main>
            <footer><i /><i /><i /></footer>
          </div>
          <strong className={styles.sideLabel}>BEFORE / TEMPLATE</strong>
        </div>

        <div className={styles.after} aria-hidden="true">
          <div className={styles.browserTop}><i /><i /><i /><span>creative.experience</span></div>
          <div className={styles.afterPage}>
            <div className={styles.afterGrid} />
            <span className={styles.afterMeta}>LIVE SYSTEM / 2026</span>
            <div className={styles.afterCore}><i /><i /></div>
            <h3><span>IDEA</span><span>BECOMES</span><span>EXPERIENCE</span></h3>
            <div className={styles.afterCards}><article>DESIGN <b>↗</b></article><article>MOTION <b>↗</b></article><article>CODE <b>↗</b></article></div>
          </div>
          <strong className={styles.sideLabel}>AFTER / EXPERIENCE</strong>
        </div>

        <div className={styles.divider} aria-hidden="true"><span>↔</span></div>
        <input className={styles.range} type="range" min="12" max="88" defaultValue="50" onInput={change} aria-label="Сравнить обычный и креативный интерфейс" />
      </div>

      <div className={styles.foot}>
        <span>01 — СТРУКТУРА</span><i /><span>02 — ХАРАКТЕР</span><i /><span>03 — ВПЕЧАТЛЕНИЕ</span>
      </div>
    </section>
  );
}

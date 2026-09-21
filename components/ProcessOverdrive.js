'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const stages = [
  { n: '01', name: 'ДИАГНОСТИКА', signal: 'СКАНИРУЕМ ЗАДАЧУ / ИЩЕМ ТОЧКУ УСИЛЕНИЯ' },
  { n: '02', name: 'КОНЦЕПТ', signal: 'СОБИРАЕМ ИДЕЮ / ЛОМАЕМ ОЧЕВИДНОЕ' },
  { n: '03', name: 'СБОРКА', signal: 'ДИЗАЙН + MOTION + CODE / ОДНА СИСТЕМА' },
  { n: '04', name: 'ЗАПУСК', signal: 'ТЕСТ / УСКОРЕНИЕ / ВЫХОД В PRODUCTION' },
  { n: '05', name: 'РАЗВИТИЕ', signal: 'СМОТРИМ ДАННЫЕ / УСИЛИВАЕМ РЕЗУЛЬТАТ' }
];

export default function ProcessOverdrive() {
  const [target, setTarget] = useState(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = document.querySelector('.showcaseStack > div:last-of-type > section:nth-of-type(4)');
    if (!section) return;
    section.classList.add('processOverdriveTarget');
    setTarget(section);

    let frame = 0;
    const move = event => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const box = section.getBoundingClientRect();
        section.style.setProperty('--process-x', `${event.clientX - box.left}px`);
        section.style.setProperty('--process-y', `${event.clientY - box.top}px`);
        section.style.setProperty('--process-tilt-x', `${((event.clientY - box.top) / box.height - .5) * -3}deg`);
        section.style.setProperty('--process-tilt-y', `${((event.clientX - box.left) / box.width - .5) * 3}deg`);
        frame = 0;
      });
    };
    const leave = () => {
      section.style.setProperty('--process-x', '50%');
      section.style.setProperty('--process-y', '50%');
      section.style.setProperty('--process-tilt-x', '0deg');
      section.style.setProperty('--process-tilt-y', '0deg');
    };
    section.addEventListener('pointermove', move, { passive: true });
    section.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener('pointermove', move);
      section.removeEventListener('pointerleave', leave);
      section.classList.remove('processOverdriveTarget');
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % stages.length), 3100);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!target) return;
    const candidates = [...target.querySelectorAll("[class*='step'], article")]
      .filter(node => !node.closest('.processOverdriveFx'))
      .slice(0, stages.length);
    candidates.forEach((node, index) => node.classList.toggle('processStepActive', index === active));
    const current = candidates[active];
    if (current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      current.animate(
        [{ transform: 'translateX(0) scale(1)' }, { transform: 'translateX(12px) scale(1.015)' }, { transform: 'translateX(0) scale(1)' }],
        { duration: 560, easing: 'cubic-bezier(.16,1,.3,1)' }
      );
    }
  }, [active, target]);

  if (!target) return null;

  return createPortal(
    <div className="processOverdriveFx">
      <div className="processCursorGlow" aria-hidden="true" />
      <div className="processScan" aria-hidden="true" />
      <div className="processRail" aria-hidden="true">
        <span className="processRailLine" />
        {stages.map((stage, index) => <i key={stage.n} className={index === active ? 'isActive' : ''}><b>{stage.n}</b></i>)}
      </div>
      <div className="processParticles" aria-hidden="true">
        {Array.from({ length: 14 }, (_, index) => <i key={index} />)}
      </div>
      <div className="processOrbit" aria-hidden="true"><i /><i /><i /><b>{stages[active].n}</b></div>
      <aside className="processHud" aria-label="Управление этапами процесса">
        <header><span>PROCESS CORE</span><b>LIVE</b></header>
        <nav>
          {stages.map((stage, index) => (
            <button key={stage.n} className={index === active ? 'isActive' : ''} onClick={() => setActive(index)} aria-pressed={index === active}>
              <b>{stage.n}</b><span>{stage.name}</span>
            </button>
          ))}
        </nav>
        <div key={active} className="processSignal"><small>SYSTEM SIGNAL</small>{stages[active].signal}</div>
      </aside>
      <div className="processTicker" aria-hidden="true">ANALYZE / CONCEPT / BUILD / LAUNCH / EVOLVE / ANALYZE / CONCEPT / BUILD / LAUNCH / EVOLVE</div>
    </div>,
    target
  );
}

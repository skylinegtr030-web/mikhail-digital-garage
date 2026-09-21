'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const capabilities = [
  {
    key: 'visual', number: '01', label: 'VISUAL SYSTEMS', title: 'ДИЗАЙН, КОТОРЫЙ НЕ СПУТАЕШЬ',
    description: 'Собираем узнаваемый цифровой язык: от арт-дирекшна и типографики до адаптивной дизайн-системы. Каждый экран выглядит частью одной сильной идеи.',
    items: ['АРТ-ДИРЕКШН', 'DESIGN SYSTEM', '3D / GENERATIVE', 'RESPONSIVE'], metric: '100%', metricLabel: 'УЗНАВАЕМОСТЬ'
  },
  {
    key: 'motion', number: '02', label: 'MOTION DIRECTION', title: 'ДВИЖЕНИЕ, КОТОРОЕ ОБЪЯСНЯЕТ',
    description: 'Анимация не декорация. Она ведёт взгляд, показывает связь между действиями и превращает переходы в цельный сценарий взаимодействия.',
    items: ['KINETIC TYPE', 'SCROLL CHOREOGRAPHY', 'MICROINTERACTIONS', 'TRANSITIONS'], metric: '60 FPS', metricLabel: 'ПЛАВНОЕ ДВИЖЕНИЕ'
  },
  {
    key: 'interactive', number: '03', label: 'INTERACTIVE LOGIC', title: 'ИНТЕРФЕЙС, КОТОРЫЙ ОТВЕЧАЕТ',
    description: 'Курсор, жест, скролл и выбор пользователя становятся частью истории. Интерфейс реагирует мгновенно и создаёт ощущение живого цифрового объекта.',
    items: ['CURSOR LOGIC', 'GESTURES', 'REAL-TIME STATES', 'PLAYGROUND UI'], metric: '< 100 MS', metricLabel: 'ОТКЛИК СИСТЕМЫ'
  },
  {
    key: 'apps', number: '04', label: 'WEB APPLICATIONS', title: 'СЛОЖНОЕ СТАНОВИТСЯ ПОНЯТНЫМ',
    description: 'Проектируем кабинеты, платформы и сервисы с ясной архитектурой. Данные, роли и сценарии складываются в быстрый продукт без визуального шума.',
    items: ['DASHBOARDS', 'USER FLOWS', 'DATA UI', 'PWA / API'], metric: '24 / 7', metricLabel: 'РАБОЧИЙ ПРОДУКТ'
  },
  {
    key: 'automation', number: '05', label: 'AUTOMATION', title: 'РУТИНА РАБОТАЕТ БЕЗ ВАС',
    description: 'Соединяем формы, CRM, уведомления, контент и аналитику в единый поток. Система принимает данные, проверяет их и запускает нужное действие автоматически.',
    items: ['API INTEGRATIONS', 'CRM FLOWS', 'AI PIPELINES', 'MONITORING'], metric: '−80%', metricLabel: 'РУЧНОЙ РАБОТЫ'
  }
];

function Demo({ mode }) {
  if (mode === 'visual') return <div className="capVisual"><i /><i /><i /><b>FORM</b><b>COLOR</b><b>SYSTEM</b><span>IDENTITY / 001</span></div>;
  if (mode === 'motion') return <div className="capMotion"><div>MOVE / MOVE / MOVE / MOVE /</div><div>MAKE IT FEEL ALIVE</div><div>60 FPS / CONTROLLED ENERGY /</div><span><i /></span><b>00:04:12</b></div>;
  if (mode === 'interactive') return <div className="capInteractive"><i /><i /><i /><button>TOUCH<br />THE IDEA</button><span>CURSOR REACTIVE / LIVE</span></div>;
  if (mode === 'apps') return <div className="capApp"><header><b>LIVE PRODUCT</b><span>● ONLINE</span></header><div className="capStats"><article><small>USERS</small><b>24.8K</b><i /></article><article><small>CONVERSION</small><b>18.4%</b><i /></article></div><div className="capChart"><i /><i /><i /><i /><i /><i /><i /></div><footer><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span></footer></div>;
  return <div className="capAutomation"><svg viewBox="0 0 700 430" aria-hidden="true"><path d="M90 215 C180 70 255 365 350 215 S520 70 610 215" /><path d="M90 215 C190 350 250 80 350 215 S510 350 610 215" /><circle cx="90" cy="215" r="34" /><circle cx="350" cy="215" r="48" /><circle cx="610" cy="215" r="34" /></svg><i /><i /><i /><b>INPUT</b><b>AI CORE</b><b>ACTION</b><span>DATA FLOW / AUTOMATED</span></div>;
}

export default function ProcessOverdrive() {
  const [target, setTarget] = useState(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    const section = document.querySelector('.showcaseStack > div:last-of-type > section:nth-of-type(4)');
    if (!section) return;
    section.classList.add('capabilityEngineTarget');
    setTarget(section);
    let frame = 0;
    const move = event => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const box = section.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width;
        const y = (event.clientY - box.top) / box.height;
        section.style.setProperty('--cap-x', `${x * 100}%`);
        section.style.setProperty('--cap-y', `${y * 100}%`);
        section.style.setProperty('--cap-rx', `${(y - .5) * -5}deg`);
        section.style.setProperty('--cap-ry', `${(x - .5) * 5}deg`);
        frame = 0;
      });
    };
    section.addEventListener('pointermove', move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener('pointermove', move);
      section.classList.remove('capabilityEngineTarget');
    };
  }, []);

  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % capabilities.length), 6200);
    return () => window.clearInterval(timer);
  }, [auto]);

  if (!target) return null;
  const item = capabilities[active];

  return createPortal(
    <section className="capabilityEngine" data-demo={item.key}>
      <div className="capAmbient" aria-hidden="true"><i /><i /><i /></div>
      <header className="capHeader">
        <div><small>ACT III / CAPABILITY ENGINE</small><h2>ВОЗМОЖНОСТИ,<br /><span>КОТОРЫЕ МОЖНО</span><br />ПОЧУВСТВОВАТЬ</h2></div>
        <p>Не список услуг. Пять живых демонстраций того, как дизайн, движение и код работают вместе.</p>
      </header>

      <nav className="capTabs" aria-label="Демонстрации возможностей">
        {capabilities.map((capability, index) => <button key={capability.key} className={index === active ? 'isActive' : ''} onClick={() => { setActive(index); setAuto(false); }}><b>{capability.number}</b><span>{capability.label}</span></button>)}
        <button className="capAuto" onClick={() => setAuto(value => !value)}><i className={auto ? 'isOn' : ''} />{auto ? 'AUTO' : 'FIX'}</button>
      </nav>

      <div className="capWorkspace">
        <div className="capStage">
          <div className="capStageTop"><span>LIVE DEMO / {item.number}</span><span>MOVE YOUR CURSOR</span></div>
          <div key={item.key} className="capDemo"><Demo mode={item.key} /></div>
          <div className="capStageCorners" aria-hidden="true"><i /><i /><i /><i /></div>
        </div>

        <article key={item.key} className="capDescription">
          <div className="capDescriptionMeta"><span>{item.number}</span><small>{item.label}</small></div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <div className="capDeliverables">{item.items.map(value => <span key={value}>↗ {value}</span>)}</div>
          <div className="capMetric"><b>{item.metric}</b><span>{item.metricLabel}</span><i /></div>
        </article>
      </div>

      <footer className="capFooter"><span>DESIGN × MOTION × CODE</span><i /><span>SELECT / PLAY / FEEL</span></footer>
    </section>,
    target
  );
}

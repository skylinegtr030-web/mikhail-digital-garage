'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const content = {
  visual: {
    number: '01', signals: ['GRID / 12 COL', 'TYPE SCALE / 1.25', 'COLOR SYNC / LIVE'], timeline: '2–4 НЕДЕЛИ',
    outputs: ['Арт-концепция и визуальное направление', 'Дизайн-система с компонентами и правилами', 'Адаптивы ключевых экранов и состояний'],
    process: ['Исследуем рынок и визуальное поле', 'Показываем 2–3 сильных направления', 'Собираем выбранную идею в систему'],
    stack: ['FIGMA', 'RIVE', 'THREE.JS', 'WEBGL', 'GSAP', 'DESIGN TOKENS'],
    result: 'Проект выглядит цельно на каждом экране и остаётся узнаваемым даже без логотипа.'
  },
  motion: {
    number: '02', signals: ['FRAME / 60 FPS', 'EASING / CUSTOM', 'TIMELINE / SYNC'], timeline: '1–3 НЕДЕЛИ',
    outputs: ['Motion-концепция и карта движения', 'Система переходов и микроанимаций', 'Оптимизированные сцены для desktop и mobile'],
    process: ['Определяем ритм и ключевые акценты', 'Собираем motion-прототип', 'Оптимизируем под реальные устройства'],
    stack: ['GSAP', 'FRAMER MOTION', 'RIVE', 'LOTTIE', 'CSS MOTION', 'RAF'],
    result: 'Пользователь понимает интерфейс быстрее, а взаимодействие ощущается как единый режиссированный сценарий.'
  },
  interactive: {
    number: '03', signals: ['POINTER / TRACKING', 'STATE / REACTIVE', 'LATENCY / 42 MS'], timeline: '2–5 НЕДЕЛЬ',
    outputs: ['Интерактивные прототипы ключевых механик', 'Курсорные, scroll- и gesture-сценарии', 'Система состояний и обратной связи'],
    process: ['Ищем действия, где реакция усиливает смысл', 'Тестируем механику в живом прототипе', 'Встраиваем и настраиваем чувствительность'],
    stack: ['REACT', 'POINTER EVENTS', 'WEBGL', 'CANVAS', 'GESTURES', 'STATE MACHINES'],
    result: 'Сайт перестаёт быть набором экранов и становится цифровым объектом, с которым хочется взаимодействовать.'
  },
  apps: {
    number: '04', signals: ['API / CONNECTED', 'DATA / REALTIME', 'STATUS / HEALTHY'], timeline: '4–12 НЕДЕЛЬ',
    outputs: ['Архитектура продукта и пользовательские сценарии', 'Рабочий интерфейс кабинета или платформы', 'Интеграции, роли, данные и аналитика'],
    process: ['Декомпозируем роли и бизнес-логику', 'Проектируем потоки и data UI', 'Разрабатываем, тестируем и запускаем'],
    stack: ['NEXT.JS', 'REACT', 'SUPABASE', 'POSTGRES', 'REST / GRAPHQL', 'PWA'],
    result: 'Сложная логика становится понятным рабочим инструментом, которым команда пользуется каждый день.'
  },
  automation: {
    number: '05', signals: ['TRIGGER / ACTIVE', 'QUEUE / 08', 'SUCCESS / 99.8%'], timeline: '1–6 НЕДЕЛЬ',
    outputs: ['Карта процессов и точек автоматизации', 'Интеграции сервисов, CRM и уведомлений', 'Логи, мониторинг и сценарии восстановления'],
    process: ['Находим повторяющиеся ручные операции', 'Проектируем надёжный поток данных', 'Запускаем, наблюдаем и усиливаем'],
    stack: ['WEBHOOKS', 'API', 'SUPABASE', 'N8N', 'AI AGENTS', 'TELEGRAM'],
    result: 'Система выполняет рутинные действия самостоятельно, снижает число ошибок и освобождает время команды.'
  }
};

export default function CapabilityDetails() {
  const [engine, setEngine] = useState(null);
  const [mode, setMode] = useState('visual');

  useEffect(() => {
    let frame = 0;
    let observer;
    const connect = () => {
      const node = document.querySelector('.capabilityEngine');
      if (!node) {
        frame = requestAnimationFrame(connect);
        return;
      }
      setEngine(node);
      setMode(node.dataset.demo || 'visual');
      observer = new MutationObserver(() => setMode(node.dataset.demo || 'visual'));
      observer.observe(node, { attributes: true, attributeFilter: ['data-demo'] });
    };
    connect();
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  if (!engine) return null;
  const item = content[mode] || content.visual;
  const stage = engine.querySelector('.capStage');
  const goToContact = () => document.querySelector('#contact,[id*="contact"],footer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      {stage && createPortal(
        <div key={mode} className="capLiveSignals" aria-hidden="true">
          {item.signals.map((signal, index) => <span key={signal} style={{ '--signal-delay': `${index * .12}s` }}><i />{signal}</span>)}
        </div>,
        stage
      )}
      {createPortal(
        <>
          <section key={mode} className="capDeepDive">
            <header><div><small>DEEP DIVE / {item.number}</small><h3>ЧТО НАХОДИТСЯ<br />ВНУТРИ РАБОТЫ</h3></div><p>{item.result}</p></header>
            <div className="capDeepGrid">
              <article>
                <span className="capDeepNumber">01</span><h4>ЧТО ВЫ ПОЛУЧАЕТЕ</h4>
                <ul>{item.outputs.map(value => <li key={value}>{value}</li>)}</ul>
              </article>
              <article>
                <span className="capDeepNumber">02</span><h4>КАК СОБИРАЕМ</h4>
                <ol>{item.process.map((value, index) => <li key={value}><b>0{index + 1}</b>{value}</li>)}</ol>
              </article>
              <article className="capStackCard">
                <span className="capDeepNumber">03</span><h4>СТЕК И ФОРМАТ</h4>
                <div>{item.stack.map(value => <span key={value}>{value}</span>)}</div>
                <footer><small>ОРИЕНТИР ПО СРОКАМ</small><b>{item.timeline}</b></footer>
              </article>
            </div>
          </section>

          <section className="capBigCta">
            <div><small>NEXT STEP / START A PROJECT</small><h3>ЕСТЬ ЗАДАЧА?<br /><span>СДЕЛАЕМ ЕЁ ЖИВОЙ.</span></h3></div>
            <button onClick={goToContact}><span>ОБСУДИТЬ ПРОЕКТ</span><b>↗</b></button>
            <i aria-hidden="true" /><i aria-hidden="true" />
          </section>
        </>,
        engine
      )}
    </>
  );
}

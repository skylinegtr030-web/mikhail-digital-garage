'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './ShowcaseHero.module.css';

export default function ShowcaseHero() {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext('2d');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0, height = 0, dpr = 1, raf = 0;
    let pointer = { x: innerWidth * .5, y: innerHeight * .5, active: false };
    let particles = [];

    const makeParticle = (x = Math.random() * width, y = Math.random() * height, burst = false) => ({
      x, y,
      vx: burst ? (Math.random() - .5) * 6 : (Math.random() - .5) * .34,
      vy: burst ? (Math.random() - .5) * 6 : (Math.random() - .5) * .34,
      r: .6 + Math.random() * 1.8,
      red: Math.random() > .73,
      life: burst ? 80 + Math.random() * 60 : 1e9
    });

    const resize = () => {
      const box = stage.getBoundingClientRect();
      width = box.width; height = box.height;
      dpr = Math.min(devicePixelRatio, 1.5);
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = reduced ? 30 : Math.min(105, Math.floor(width / 12));
      particles = Array.from({ length: count }, () => makeParticle());
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        if (pointer.active && distance < 170) {
          const force = (170 - distance) / 170;
          p.vx += dx / distance * force * .055;
          p.vy += dy / distance * force * .055;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = `rgba(255,56,46,${force * .22})`;
          ctx.lineWidth = .7; ctx.stroke();
        }
        p.vx *= .994; p.vy *= .994;
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.x < -20) p.x = width + 20; if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20; if (p.y > height + 20) p.y = -20;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.red ? 'rgba(255,56,46,.82)' : 'rgba(232,229,220,.56)';
        ctx.fill();
        if (p.life <= 0) particles.splice(i, 1);
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const move = event => {
      const box = stage.getBoundingClientRect();
      pointer.x = event.clientX - box.left; pointer.y = event.clientY - box.top; pointer.active = true;
      stage.style.setProperty('--px', `${pointer.x}px`);
      stage.style.setProperty('--py', `${pointer.y}px`);
      stage.style.setProperty('--nx', `${(pointer.x / width - .5) * 2}`);
      stage.style.setProperty('--ny', `${(pointer.y / height - .5) * 2}`);
    };
    const burst = event => {
      const box = stage.getBoundingClientRect();
      const x = event.clientX - box.left, y = event.clientY - box.top;
      for (let i = 0; i < 26; i++) particles.push(makeParticle(x, y, true));
      stage.classList.remove(styles.flash);
      void stage.offsetWidth;
      stage.classList.add(styles.flash);
    };
    const leave = () => { pointer.active = false; };

    resize();
    draw();
    addEventListener('resize', resize);
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerdown', burst);
    stage.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerdown', burst);
      stage.removeEventListener('pointerleave', leave);
    };
  }, []);

  const enter = event => {
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    el.style.setProperty('--bx', `${event.clientX - box.left - box.width / 2}px`);
    el.style.setProperty('--by', `${event.clientY - box.top - box.height / 2}px`);
  };
  const reset = event => {
    event.currentTarget.style.setProperty('--bx', '0px');
    event.currentTarget.style.setProperty('--by', '0px');
  };

  return (
    <section ref={stageRef} className={styles.stage}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.cursorGlow} aria-hidden="true" />
      <div className={styles.scan} aria-hidden="true" />

      <header className={styles.meta}>
        <span>MIKHAIL.DIGITAL / CREATIVE WEB LAB</span>
        <span className={styles.rec}>● LIVE DEMO</span>
        <span>FRAME 0001 / 2026</span>
      </header>

      <div className={styles.core} aria-hidden="true">
        <i /><i /><i />
        <span className={styles.orbitA}>DESIGN</span>
        <span className={styles.orbitB}>CODE</span>
        <span className={styles.orbitC}>MOTION</span>
        <span className={styles.orbitD}>IDEAS</span>
      </div>

      <div className={styles.title}>
        <span className={styles.kicker}>ЭТО НЕ ПОРТФОЛИО</span>
        <h1><span>ДЕМО</span><span>НАШИХ</span><span>ВОЗМОЖНОСТЕЙ</span></h1>
      </div>

      <div className={styles.bottom}>
        <p>Интерактивная витрина дизайна, анимации и разработки. Каждый следующий блок запускает новую возможность.</p>
        <div className={styles.actions}>
          <button
            className={styles.launch}
            onPointerMove={enter}
            onPointerLeave={reset}
            onClick={() => scrollTo({ top: innerHeight * .92, behavior: 'smooth' })}
          ><span>ЗАПУСТИТЬ ДЕМО</span><b>↓</b></button>
          <Link href="/contact" className={styles.contact}>ОБСУДИТЬ ПРОЕКТ ↗</Link>
        </div>
      </div>

      <div className={styles.sideNote}>MOVE / CLICK / SCROLL</div>
      <div className={styles.frameCount}><span>00</span><i /><span>10</span></div>
    </section>
  );
}

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
    const ctx = canvas.getContext('2d', { alpha: true });
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    const lowPower = reduced || innerWidth < 760 || cores <= 4 || memory <= 4;
    const targetFps = lowPower ? 30 : 50;
    const frameMs = 1000 / targetFps;
    let width = 0, height = 0, dpr = 1, rect = null;
    let raf = 0, pointerRaf = 0, previous = 0;
    let visible = true, running = false;
    let accent = '140,103,255';
    let pointer = { x: innerWidth * .5, y: innerHeight * .5, active: false, clientX: 0, clientY: 0 };
    let particles = [];

    const makeParticle = (x = Math.random() * width, y = Math.random() * height, burst = false) => ({
      x, y,
      vx: burst ? (Math.random() - .5) * 4.5 : (Math.random() - .5) * .25,
      vy: burst ? (Math.random() - .5) * 4.5 : (Math.random() - .5) * .25,
      r: .55 + Math.random() * (lowPower ? 1.15 : 1.55),
      accent: Math.random() > .7,
      life: burst ? 65 + Math.random() * 45 : 1e9
    });

    const measure = () => {
      rect = stage.getBoundingClientRect();
      width = Math.max(1, rect.width); height = Math.max(1, rect.height);
      dpr = Math.min(devicePixelRatio, lowPower ? 1 : 1.35);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = lowPower ? Math.min(34, Math.floor(width / 22)) : Math.min(72, Math.floor(width / 18));
      particles = Array.from({ length: count }, () => makeParticle());
    };

    const renderFrame = time => {
      raf = 0;
      if (!running || document.hidden) return;
      if (time - previous < frameMs) { raf = requestAnimationFrame(renderFrame); return; }
      previous = time;
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        const distanceSq = dx * dx + dy * dy;
        if (pointer.active && distanceSq < 28900) {
          const distance = Math.sqrt(distanceSq) || 1;
          const force = (170 - distance) / 170;
          p.vx += dx / distance * force * .04;
          p.vy += dy / distance * force * .04;
          if (!lowPower && force > .18) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pointer.x, pointer.y);
            ctx.strokeStyle = `rgba(${accent},${force * .18})`;
            ctx.lineWidth = .65; ctx.stroke();
          }
        }
        p.vx *= .992; p.vy *= .992; p.x += p.vx; p.y += p.vy; p.life--;
        if (p.x < -20) p.x = width + 20; else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20; else if (p.y > height + 20) p.y = -20;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.accent ? `rgba(${accent},.78)` : 'rgba(232,229,220,.48)'; ctx.fill();
        if (p.life <= 0) particles.splice(i, 1);
      }
      raf = requestAnimationFrame(renderFrame);
    };

    const start = () => {
      if (running || !visible || document.hidden || reduced) return;
      running = true; previous = 0; raf = requestAnimationFrame(renderFrame);
    };
    const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };
    const applyPointer = () => {
      pointerRaf = 0;
      if (!rect) return;
      pointer.x = pointer.clientX - rect.left; pointer.y = pointer.clientY - rect.top; pointer.active = true;
      stage.style.setProperty('--px', `${pointer.x}px`); stage.style.setProperty('--py', `${pointer.y}px`);
      stage.style.setProperty('--nx', `${(pointer.x / width - .5) * 2}`); stage.style.setProperty('--ny', `${(pointer.y / height - .5) * 2}`);
    };
    const move = event => {
      pointer.clientX = event.clientX; pointer.clientY = event.clientY;
      if (!pointerRaf) pointerRaf = requestAnimationFrame(applyPointer);
    };
    const burst = event => {
      if (!rect || reduced) return;
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      const amount = lowPower ? 9 : 18;
      for (let i = 0; i < amount; i++) particles.push(makeParticle(x, y, true));
      const cap = lowPower ? 48 : 92;
      if (particles.length > cap) particles.splice(0, particles.length - cap);
      stage.classList.remove(styles.flash); void stage.offsetWidth; stage.classList.add(styles.flash);
    };
    const leave = () => { pointer.active = false; };
    const visibility = () => { if (document.hidden) stop(); else start(); };
    const color = event => { accent = event.detail.rgb; };

    const resizeObserver = new ResizeObserver(measure);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    }, { rootMargin: '100px', threshold: .01 });
    resizeObserver.observe(stage); intersectionObserver.observe(stage); measure();
    if (reduced) renderFrame(0); else start();
    stage.addEventListener('pointermove', move, { passive: true });
    stage.addEventListener('pointerdown', burst, { passive: true });
    stage.addEventListener('pointerleave', leave, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('site:color', color);
    return () => {
      stop(); if (pointerRaf) cancelAnimationFrame(pointerRaf);
      resizeObserver.disconnect(); intersectionObserver.disconnect();
      stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerdown', burst); stage.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility); window.removeEventListener('site:color', color);
    };
  }, []);

  const enter = event => {
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    el.style.setProperty('--bx', `${event.clientX - box.left - box.width / 2}px`);
    el.style.setProperty('--by', `${event.clientY - box.top - box.height / 2}px`);
  };
  const reset = event => { event.currentTarget.style.setProperty('--bx', '0px'); event.currentTarget.style.setProperty('--by', '0px'); };

  return (
    <section ref={stageRef} className={styles.stage}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" /><div className={styles.cursorGlow} aria-hidden="true" /><div className={styles.scan} aria-hidden="true" />
      <header className={styles.meta}><span>MIKHAIL.DIGITAL / CREATIVE WEB LAB</span><span className={styles.rec}>● LIVE DEMO</span><span>FRAME 0001 / 2026</span></header>
      <div className={styles.core} aria-hidden="true"><i /><i /><i /><span className={styles.orbitA}>DESIGN</span><span className={styles.orbitB}>CODE</span><span className={styles.orbitC}>MOTION</span><span className={styles.orbitD}>IDEAS</span></div>
      <div className={styles.title}><span className={styles.kicker}>ЭТО НЕ ПОРТФОЛИО</span><h1><span>ДЕМО</span><span>НАШИХ</span><span>ВОЗМОЖНОСТЕЙ</span></h1></div>
      <div className={styles.bottom}>
        <p>Интерактивная витрина дизайна, анимации и разработки. Каждый следующий блок запускает новую возможность.</p>
        <div className={styles.actions}>
          <button className={styles.launch} onPointerMove={enter} onPointerLeave={reset} onClick={() => scrollTo({ top: innerHeight * .92, behavior: 'smooth' })}><span>ЗАПУСТИТЬ ДЕМО</span><b>↓</b></button>
          <Link href="/contact" className={styles.contact}>ОБСУДИТЬ ПРОЕКТ ↗</Link>
        </div>
      </div>
      <div className={styles.sideNote}>MOVE / CLICK / SCROLL</div><div className={styles.frameCount}><span>00</span><i /><span>10</span></div>
    </section>
  );
}

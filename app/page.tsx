export default function Home() {
  return (
    <>
      <style>{`
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 60px;
          border-bottom: 1px solid var(--border);
          background: rgba(10,10,10,0.85);
          backdrop-filter: blur(12px);
        }
        .nav-logo {
          font-size: 15px; font-weight: 600; letter-spacing: -0.02em;
          color: var(--fg);
        }
        .nav-logo span { color: var(--accent); }
        .nav-links { display: flex; gap: 32px; align-items: center; }
        .nav-links a {
          font-size: 13.5px; color: var(--fg-secondary);
          transition: color 0.15s;
        }
        .nav-links a:hover { color: var(--fg); }
        .nav-cta {
          font-size: 13px; font-weight: 500;
          padding: 7px 16px; border-radius: var(--radius);
          border: 1px solid var(--border-light);
          color: var(--fg); background: var(--surface);
          transition: border-color 0.15s, background 0.15s;
          cursor: pointer;
        }
        .nav-cta:hover { border-color: var(--accent-border); background: var(--accent-soft); }

        .container { max-width: 960px; margin: 0 auto; padding: 0 40px; }

        /* HERO */
        .hero {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 120px 40px 100px;
          position: relative;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px; border-radius: 100px;
          border: 1px solid var(--accent-border);
          background: var(--accent-soft);
          font-size: 12px; font-weight: 500; color: #a78bfa;
          letter-spacing: 0.03em; text-transform: uppercase;
          margin-bottom: 40px;
        }
        .hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent); animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .hero h1 {
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 700; letter-spacing: -0.04em; line-height: 1.0;
          color: var(--fg); margin-bottom: 28px;
        }
        .hero h1 .dim { color: var(--fg-tertiary); }
        .hero-sub {
          font-size: clamp(16px, 2vw, 20px); color: var(--fg-secondary);
          max-width: 560px; line-height: 1.65; margin-bottom: 20px;
        }
        .hero-desc {
          font-size: 15px; color: var(--fg-tertiary);
          max-width: 600px; line-height: 1.7; margin-bottom: 56px;
        }
        .hero-actions { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; border-radius: var(--radius);
          background: var(--accent); color: white;
          font-size: 14px; font-weight: 500;
          transition: opacity 0.15s; cursor: pointer; border: none;
        }
        .btn-primary:hover { opacity: 0.85; }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 24px; border-radius: var(--radius);
          border: 1px solid var(--border-light); color: var(--fg-secondary);
          font-size: 14px; font-weight: 500;
          background: transparent;
          transition: border-color 0.15s, color 0.15s; cursor: pointer;
        }
        .btn-secondary:hover { border-color: var(--border-light); color: var(--fg); }
        .hero-divider {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, transparent, var(--border));
        }

        /* SECTION BASE */
        section { padding: 100px 0; }
        .section-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--accent);
          margin-bottom: 20px;
        }
        .section-title {
          font-size: clamp(28px, 4vw, 44px); font-weight: 700;
          letter-spacing: -0.03em; line-height: 1.1;
          color: var(--fg); margin-bottom: 18px;
        }
        .section-body {
          font-size: 16px; color: var(--fg-secondary);
          line-height: 1.7; max-width: 580px;
        }
        .divider { border: none; border-top: 1px solid var(--border); }

        /* WHAT IS */
        .what-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center; margin-top: 80px;
        }
        .what-points { display: flex; flex-direction: column; gap: 28px; }
        .what-point { display: flex; gap: 16px; align-items: flex-start; }
        .what-point-icon {
          width: 36px; height: 36px; border-radius: var(--radius);
          border: 1px solid var(--border-light);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 16px;
          background: var(--surface);
        }
        .what-point-text h4 {
          font-size: 14px; font-weight: 600; color: var(--fg);
          margin-bottom: 4px;
        }
        .what-point-text p { font-size: 13.5px; color: var(--fg-secondary); line-height: 1.6; }
        .what-visual {
          border: 1px solid var(--border); border-radius: var(--radius-lg);
          background: var(--surface); padding: 28px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .mock-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 0; border-bottom: 1px solid var(--border);
        }
        .mock-row:last-child { border-bottom: none; }
        .mock-label { font-size: 13px; color: var(--fg-secondary); }
        .mock-value { font-family: var(--font-mono); font-size: 13px; color: var(--fg); }
        .mock-badge {
          font-size: 11px; padding: 2px 8px; border-radius: 100px;
          font-weight: 500;
        }
        .badge-green { background: rgba(34,197,94,0.1); color: #4ade80; }
        .badge-yellow { background: rgba(234,179,8,0.1); color: #facc15; }
        .badge-red { background: rgba(239,68,68,0.1); color: #f87171; }
        .badge-violet { background: var(--accent-soft); color: #a78bfa; }

        /* MODULES */
        .modules-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 1px; background: var(--border);
          border: 1px solid var(--border); border-radius: var(--radius-lg);
          overflow: hidden; margin-top: 64px;
        }
        .module-card {
          background: var(--bg); padding: 40px;
          transition: background 0.2s;
        }
        .module-card:hover { background: var(--surface); }
        .module-icon {
          width: 44px; height: 44px; border-radius: var(--radius);
          border: 1px solid var(--border-light);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; margin-bottom: 20px;
          background: var(--surface);
        }
        .module-name {
          font-size: 16px; font-weight: 600; color: var(--fg);
          letter-spacing: -0.02em; margin-bottom: 8px;
        }
        .module-desc { font-size: 13.5px; color: var(--fg-secondary); line-height: 1.65; }
        .module-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
        .module-tag {
          font-size: 11px; padding: 3px 10px; border-radius: 100px;
          border: 1px solid var(--border-light); color: var(--fg-tertiary);
          font-family: var(--font-mono);
        }

        /* ROADMAP */
        .roadmap { margin-top: 64px; display: flex; flex-direction: column; gap: 0; }
        .roadmap-item {
          display: grid; grid-template-columns: 160px 1px 1fr;
          gap: 0 32px; padding: 32px 0;
          border-bottom: 1px solid var(--border);
        }
        .roadmap-item:last-child { border-bottom: none; }
        .roadmap-phase { font-size: 12px; font-weight: 600; color: var(--fg-tertiary); padding-top: 2px; }
        .roadmap-line {
          width: 1px; background: var(--border);
          position: relative;
        }
        .roadmap-dot {
          position: absolute; top: 6px; left: 50%;
          transform: translateX(-50%);
          width: 8px; height: 8px; border-radius: 50%;
          border: 1px solid var(--border-light);
          background: var(--bg);
        }
        .roadmap-dot.active {
          background: var(--accent); border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
        }
        .roadmap-content h4 {
          font-size: 15px; font-weight: 600; color: var(--fg);
          margin-bottom: 6px; letter-spacing: -0.01em;
        }
        .roadmap-content p { font-size: 13.5px; color: var(--fg-secondary); line-height: 1.6; }
        .roadmap-status {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 10px;
        }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; }

        /* BUILDING IN PUBLIC */
        .bip-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 24px; margin-top: 64px;
        }
        .bip-card {
          border: 1px solid var(--border); border-radius: var(--radius-lg);
          padding: 28px; background: var(--surface);
        }
        .bip-number {
          font-size: 36px; font-weight: 700; letter-spacing: -0.04em;
          color: var(--fg); font-family: var(--font-mono); line-height: 1;
          margin-bottom: 6px;
        }
        .bip-label { font-size: 13px; color: var(--fg-secondary); }

        /* GITHUB CTA */
        .github-cta {
          border: 1px solid var(--border); border-radius: var(--radius-lg);
          padding: 64px 40px; text-align: center;
          background: var(--surface); margin-top: 100px;
          position: relative; overflow: hidden;
        }
        .github-cta::before {
          content: ''; position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 300px; height: 1px;
          background: linear-gradient(to right, transparent, var(--accent-border), transparent);
        }
        .github-cta h2 {
          font-size: 28px; font-weight: 700; letter-spacing: -0.03em;
          color: var(--fg); margin-bottom: 12px;
        }
        .github-cta p { font-size: 15px; color: var(--fg-secondary); margin-bottom: 36px; }

        /* FOOTER */
        footer {
          padding: 48px 40px;
          border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 16px;
        }
        .footer-left { font-size: 13px; color: var(--fg-tertiary); }
        .footer-right { font-size: 13px; color: var(--fg-tertiary); display: flex; gap: 24px; }
        .footer-right a:hover { color: var(--fg-secondary); }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .nav { padding: 0 20px; }
          .nav-links { display: none; }
          .container { padding: 0 20px; }
          .hero { padding: 100px 20px 80px; }
          .what-grid { grid-template-columns: 1fr; gap: 48px; }
          .modules-grid { grid-template-columns: 1fr; }
          .bip-grid { grid-template-columns: 1fr; }
          .roadmap-item { grid-template-columns: 100px 1px 1fr; gap: 0 20px; }
          footer { padding: 32px 20px; flex-direction: column; align-items: flex-start; }
          .github-cta { padding: 48px 24px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">JARALAB <span>OS</span></div>
        <div className="nav-links">
          <a href="#que-es">Qué es</a>
          <a href="#modulos">Módulos</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#estado">Estado</a>
        </div>
        <a
          href="https://github.com/laujara10/JARALAB_OS"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta"
        >
          GitHub →
        </a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Building in Public · v0.1
        </div>
        <h1>
          JARALAB <span className="dim">OS</span>
        </h1>
        <p className="hero-sub">AI Operating System for Independent Restaurants</p>
        <p className="hero-desc">
          JARALAB OS convierte datos financieros, operativos y comerciales
          en decisiones accionables para restaurantes independientes.
        </p>
        <div className="hero-actions">
          <a href="#modulos" className="btn-primary">Explorar módulos</a>
          <a
            href="https://github.com/laujara10/JARALAB_OS"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Ver en GitHub
          </a>
        </div>
        <div className="hero-divider" />
      </section>

      {/* QUÉ ES */}
      <section id="que-es">
        <div className="container">
          <hr className="divider" />
          <div className="what-grid">
            <div>
              <p className="section-label">Qué es JARALAB OS</p>
              <h2 className="section-title">
                Un sistema operativo<br />para el restaurante moderno
              </h2>
              <p className="section-body">
                Los restaurantes independientes no necesitan más software.
                Necesitan un sistema que aprenda de sus datos y les diga qué hacer.
                JARALAB OS es ese sistema.
              </p>
              <div className="what-points" style={{ marginTop: 40 }}>
                {[
                  { icon: '⬡', title: 'Ingesta automática', desc: 'Conecta tu POS, banco y proveedores. Sin exportaciones manuales.' },
                  { icon: '◈', title: 'Auditoría diaria', desc: 'Conciliación automática de transacciones con detección de anomalías.' },
                  { icon: '◉', title: 'Decisiones asistidas por AI', desc: 'Cada alerta viene con una recomendación accionable, no solo un número.' },
                ].map(p => (
                  <div key={p.title} className="what-point">
                    <div className="what-point-icon">{p.icon}</div>
                    <div className="what-point-text">
                      <h4>{p.title}</h4>
                      <p>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="what-visual">
              <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginBottom: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                AUDIT · 13 JUL 2026
              </div>
              {[
                { label: 'Transacciones', value: '147', badge: null },
                { label: 'Conciliadas', value: '143', badge: { text: '97.3%', cls: 'badge-green' } },
                { label: 'Excepciones', value: '4', badge: { text: 'Revisar', cls: 'badge-yellow' } },
                { label: 'Costo alimentos', value: '28.4%', badge: { text: '+1.4pt', cls: 'badge-red' } },
                { label: 'Ventas auditadas', value: '$84,210', badge: null },
                { label: 'Puntuación', value: '87 / 100', badge: { text: 'Saludable', cls: 'badge-violet' } },
              ].map(r => (
                <div key={r.label} className="mock-row">
                  <span className="mock-label">{r.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="mock-value">{r.value}</span>
                    {r.badge && <span className={`mock-badge ${r.badge.cls}`}>{r.badge.text}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MÓDULOS */}
      <section id="modulos">
        <div className="container">
          <hr className="divider" />
          <p className="section-label" style={{ marginTop: 80 }}>Módulos</p>
          <h2 className="section-title">Cuatro Labs.<br />Una sola decisión.</h2>
          <div className="modules-grid">
            {[
              {
                icon: '⬡',
                name: 'Decision Lab',
                desc: 'Cada decisión importante del restaurante, registrada con contexto, impacto y resultado. El historial de decisiones como ventaja competitiva.',
                tags: ['registro', 'impacto', 'revisión'],
              },
              {
                icon: '◈',
                name: 'Cash Control',
                desc: 'Conciliación bancaria automática contra POS. Detecta excepciones, anomalías y diferencias antes de que se conviertan en pérdidas.',
                tags: ['auditoría', 'conciliación', 'alertas'],
              },
              {
                icon: '◉',
                name: 'Business Intelligence',
                desc: 'Ventas, costos, personal y márgenes en una sola vista. Tendencias semanales, comparativos y proyecciones sin hojas de cálculo.',
                tags: ['P&L', 'costos', 'personal', 'ventas'],
              },
              {
                icon: '⬙',
                name: 'Growth Lab',
                desc: 'Cada idea de crecimiento como experimento medible. Hipótesis, muestra, resultado y decisión. Sin escalar por intuición.',
                tags: ['experimentos', 'hipótesis', 'validación'],
              },
            ].map(m => (
              <div key={m.name} className="module-card">
                <div className="module-icon">{m.icon}</div>
                <div className="module-name">{m.name}</div>
                <p className="module-desc">{m.desc}</p>
                <div className="module-tags">
                  {m.tags.map(t => <span key={t} className="module-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap">
        <div className="container">
          <hr className="divider" />
          <p className="section-label" style={{ marginTop: 80 }}>Roadmap</p>
          <h2 className="section-title">De cero a sistema operativo.</h2>
          <div className="roadmap">
            {[
              {
                phase: 'F0 — Completo',
                active: true,
                title: 'Primer cierre real auditado',
                desc: 'Ingesta manual de extracto bancario y POS (Loggro). Conciliación automática. Auditoría completa del día con puntuación y hallazgos.',
                status: '#4ade80',
                statusText: 'Completado · 12 jul 2026',
              },
              {
                phase: 'F1 — En curso',
                active: true,
                title: 'Restaurant Auditor MVP',
                desc: 'Dashboard navegable con módulos de ventas, costos y personal. AI Copilot con contexto de datos reales. Deploy en producción.',
                status: '#a78bfa',
                statusText: 'En desarrollo',
              },
              {
                phase: 'F2 — Próximo',
                active: false,
                title: 'Ingesta automática',
                desc: 'Conexión directa con Bancolombia y Loggro via API. Auditoría diaria sin intervención manual. Alertas por WhatsApp.',
                status: '#666666',
                statusText: 'Planificado',
              },
              {
                phase: 'F3 — Futuro',
                active: false,
                title: 'Multi-restaurante',
                desc: 'Vista consolidada para operadores con múltiples ubicaciones. Benchmarking entre restaurantes. Módulo de franquicias.',
                status: '#666666',
                statusText: 'Backlog',
              },
            ].map(r => (
              <div key={r.phase} className="roadmap-item">
                <div className="roadmap-phase">{r.phase}</div>
                <div className="roadmap-line">
                  <div className={`roadmap-dot ${r.active ? 'active' : ''}`} />
                </div>
                <div className="roadmap-content">
                  <h4>{r.title}</h4>
                  <p>{r.desc}</p>
                  <div className="roadmap-status">
                    <span className="status-dot" style={{ background: r.status }} />
                    <span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>{r.statusText}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESTADO */}
      <section id="estado">
        <div className="container">
          <hr className="divider" />
          <p className="section-label" style={{ marginTop: 80 }}>Estado actual</p>
          <h2 className="section-title">Building in Public.</h2>
          <p className="section-body">
            JARALAB OS se construye en público, validado con datos reales de
            restaurantes independientes en Colombia. Cada decisión de diseño y
            arquitectura está documentada en este repositorio.
          </p>
          <div className="bip-grid">
            {[
              { number: '1', label: 'Restaurante validando en producción' },
              { number: '147', label: 'Transacciones auditadas en primer cierre' },
              { number: '97.3%', label: 'Tasa de conciliación automática alcanzada' },
              { number: '4', label: 'Módulos activos en el MVP' },
              { number: 'F0', label: 'Milestone completado · 12 jul 2026' },
              { number: '∞', label: 'Decisiones con contexto documentado' },
            ].map(s => (
              <div key={s.label} className="bip-card">
                <div className="bip-number">{s.number}</div>
                <div className="bip-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* GitHub CTA */}
          <div className="github-cta">
            <h2>El conocimiento es abierto.</h2>
            <p>
              Arquitectura, decisiones, ADRs, daily logs y código fuente.
              Todo en un solo repositorio público.
            </p>
            <a
              href="https://github.com/laujara10/JARALAB_OS"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              laujara10/JARALAB_OS
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-left">
          © 2026 JaraLab · JARALAB OS · All rights reserved
        </div>
        <div className="footer-right">
          <a href="https://github.com/laujara10/JARALAB_OS" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#modulos">Módulos</a>
        </div>
      </footer>
    </>
  )
}

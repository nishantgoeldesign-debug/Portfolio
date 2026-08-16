import { useEffect, useState } from "react";
import { tick, swoosh } from "./delight.js";
import home from "../content/home.json";

// Load every case study file. Adding a new study = dropping a JSON file in
// content/case-studies/ — no code change needed.
const caseModules = import.meta.glob("../content/case-studies/*.json", { eager: true });
const caseStudies = {};
for (const path in caseModules) {
  const data = caseModules[path].default ?? caseModules[path];
  const slug = data.slug || path.split("/").pop().replace(/\.json$/, "");
  caseStudies[slug] = { ...data, slug };
}

export function App() {
  const [expanded, setExpanded] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [identityActive, setIdentityActive] = useState(false);
  const [activeThought, setActiveThought] = useState(null);
  const [route, setRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const syncRoute = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  // Scale the fixed 800px canvas to fit any viewport width, preserving the exact
  // composition. Never scales above 1 (natural size, centered on large screens).
  useEffect(() => {
    const root = document.documentElement;
    const fit = () => {
      const width = root.clientWidth || window.innerWidth;
      root.style.setProperty("--fit", String(Math.min(1, width / 800)));
    };
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", fit);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("orientationchange", fit);
    };
  }, []);

  if (route.startsWith("#case/")) {
    const slug = route.slice("#case/".length);
    const data = caseStudies[slug];
    if (data) return <CaseStudy data={data} />;
  }

  return (
    <main className="site-shell">
      <section className="page" aria-label={`${home.name} portfolio`}>
        <header className="intro">
          <div
            className={`name-play${identityActive ? " is-active" : ""}`}
            tabIndex="0"
            role="button"
            aria-pressed={identityActive}
            aria-label={`${home.name} — Coffee, Curiosity, Minimalism`}
            onPointerEnter={() => { setIdentityActive(true); tick({ pitch: 0.7 }); }}
            onPointerLeave={() => setIdentityActive(false)}
            onMouseEnter={() => setIdentityActive(true)}
            onMouseLeave={() => setIdentityActive(false)}
            onFocus={() => { setIdentityActive(true); tick({ pitch: 0.7 }); }}
            onBlur={() => setIdentityActive(false)}
            onClick={() => setIdentityActive((value) => !value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIdentityActive((value) => !value);
              }
            }}
          >
            <div className="identity-ring-frame" aria-hidden="true">
              <img src="/assets/identity-ring.png" alt="" />
            </div>
            <img className="identity-memoji" src="/assets/identity-memoji.png" alt="" aria-hidden="true" />
            <h1>{home.name}</h1>
            <img className="identity-coffee" src="/assets/identity-coffee.png" alt="" aria-hidden="true" />
          </div>
          <p>{home.tagline}</p>
        </header>

        <section className="work-section" aria-labelledby="work-title">
          <div>
            <h2 id="work-title">{home.work.title}</h2>
            <p>{home.work.role}</p>
          </div>
          <div
            className="top-collage"
            role="group"
            tabIndex="0"
            aria-label="Open travel envelope to explore keepsakes"
            onPointerEnter={() => swoosh()}
            onFocus={() => swoosh()}
          >
            <img className="envelope-item envelope-rain" src="/assets/envelope-rain.png" alt="" />
            <img className="envelope-item envelope-drink" src="/assets/envelope-drink.png" alt="" />
            <img className="envelope-item envelope-car" src="/assets/envelope-car.png" alt="" />
            <img className="envelope-item envelope-racer" src="/assets/envelope-racer.png" alt="" />
            <img className="envelope-item envelope-fuji" src="/assets/envelope-fuji.png" alt="" />
            <img className="envelope-item envelope-mountain" src="/assets/envelope-mountain.png" alt="" />
            <img className="envelope-shell" src="/assets/envelope-blank.png" alt="" />
            <img className="envelope-resting" src="/assets/envelope-resting.png" alt="" />
          </div>
          <p className="companies">{home.work.companies}</p>
          <div className="brand-stack" aria-hidden="true">
            <img className="brand-group-base" src="/assets/brand-group-highres.png" alt="" />
            <img className="brand-group-motion" src="/assets/brand-group-highres.png" alt="" />
          </div>
        </section>

        <section className="canopy" aria-labelledby="canopy-title" onMouseLeave={() => setActiveProject(null)}>
          <h2 id="canopy-title">{home.canopyTitle}</h2>
          <div className="project-list">
            {home.projects.map((project, index) => (
              <a
                href={`#case/${project.caseSlug}`}
                className={`project${activeProject === index ? " is-active" : ""}`}
                key={project.title}
                onMouseEnter={() => { setActiveProject(index); tick(); }}
                onFocus={() => { setActiveProject(index); tick(); }}
              >
                <span>{project.title}</span>
                <strong>{project.company}</strong>
              </a>
            ))}
            {activeProject !== null && (
              <img
                key={activeProject}
                className={`project-preview preview-${activeProject}`}
                src={home.projects[activeProject].preview}
                alt=""
                aria-hidden="true"
              />
            )}
          </div>
        </section>

        <section className="thoughts" aria-labelledby="thoughts-title" onMouseLeave={() => setActiveThought(null)}>
          <div className="thought-copy">
            <h2 id="thoughts-title">{home.thoughtsTitle}</h2>
            <div className="thought-list">
              {(expanded ? home.thoughts : home.thoughts.slice(0, 4)).map((thought, index) => (
                <a
                  href="#thoughts"
                  className={`thought-link${activeThought === index ? " is-active" : ""}`}
                  key={thought.title}
                  onMouseEnter={() => { setActiveThought(index); tick(); }}
                  onFocus={() => { setActiveThought(index); tick(); }}
                >
                  {thought.title}
                </a>
              ))}
            </div>
            {expanded && home.thoughtsNote && (
              <a href="#thoughts">{home.thoughtsNote}</a>
            )}
            {home.thoughts.length > 4 && (
              <button type="button" onClick={() => setExpanded((value) => !value)}>
                {expanded ? "Show Less" : "Show More"} <span aria-hidden="true">··</span>
              </button>
            )}
          </div>
          <div className="bottom-collage" aria-hidden="true">
            <img
              key={activeThought ?? "resting"}
              className="thought-image"
              src={activeThought === null ? "/assets/thought-resting.png" : home.thoughts[activeThought].image}
              alt=""
            />
          </div>
        </section>

        <nav className="contact" id="contact" aria-label="Social links">
          {home.contact.map((link, index) => (
            <span key={link.label} style={{ display: "contents" }}>
              {index > 0 && <span aria-hidden="true">|</span>}
              <a href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
            </span>
          ))}
        </nav>
      </section>
    </main>
  );
}

function CaseIndex({ items, basePath, active = 0, onNavigate }) {
  return (
    <nav className="case-index" aria-label="Case study index">
      {items.map((label, index) => (
        <a
          key={`${label}-${index}`}
          className={index === active ? "is-active" : undefined}
          href={basePath}
          onPointerEnter={() => tick()}
          onFocus={() => tick()}
          onClick={(event) => {
            if (onNavigate) {
              event.preventDefault();
              onNavigate(index);
            }
          }}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

function CaseStudy({ data }) {
  const { slug, locked, title, subtitle, hero, index = [], body = [], cards = [], closing = "", sections = [] } = data;
  const basePath = `#case/${slug}`;
  const [activeSection, setActiveSection] = useState(0);

  // Scroll-spy: highlight the index entry for whichever section is in view.
  // Disabled on locked case studies (they are teasers — no section navigation).
  useEffect(() => {
    if (locked || !sections.length) return;
    const els = sections
      .map((_, i) => document.getElementById(`case-section-${i}`))
      .filter(Boolean);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(Number(visible[0].target.dataset.index));
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [locked, sections.length, slug]);

  const goToSection = (i) => {
    const el = document.getElementById(`case-section-${i}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Locked case studies are teasers: lock scroll so nothing below the landing
  // view can be reached. Restored when leaving the locked case.
  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const body = document.body;
    const prevRoot = root.style.overflow;
    const prevBody = body.style.overflow;
    const prevRootH = root.style.height;
    const prevBodyH = body.style.height;
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    root.style.height = "100vh";
    body.style.height = "100vh";
    window.scrollTo(0, 0);
    return () => {
      root.style.overflow = prevRoot;
      body.style.overflow = prevBody;
      root.style.height = prevRootH;
      body.style.height = prevBodyH;
    };
  }, [locked, slug]);

  return (
    <main className="site-shell">
      <article className={`case-page${locked ? "" : " open-case"}`} aria-labelledby="case-study-title">
        <a className="back-home" href="#home">
          <img src="/assets/case-back.svg" alt="" aria-hidden="true" />
          Home
        </a>

        <header className={`case-header${locked ? "" : " open-case-header"}`}>
          <div className="case-heading">
            <h1 id="case-study-title">{title}</h1>
            <p>{subtitle}</p>
          </div>
        </header>

        <div className="case-showcase">
          <figure className="case-hero">
            <img src={hero.src} alt={hero.alt} />
          </figure>
          <CaseIndex
            items={index}
            basePath={basePath}
            active={activeSection}
            onNavigate={!locked && sections.length > 0 ? goToSection : undefined}
          />
        </div>

        <div className={`case-content${locked ? "" : " open-case-content"}`}>
          <div className={`case-body${locked ? "" : " open-case-body"}`}>
            {body.map((block, i) => (
              <p key={i} className={block.style === "fade" ? "case-fade-copy" : undefined}>
                {block.text}
              </p>
            ))}
          </div>

          {!locked && cards.length > 0 && (
            <div className="open-case-cards" aria-label="Supporting case study boards">
              {cards.map((card, i) => (
                <figure key={i}>
                  <img className="case-card-tape" src="/assets/poster-tape.png" alt="" aria-hidden="true" />
                  <img src={card.src} alt={card.alt} />
                </figure>
              ))}
            </div>
          )}

          {!locked && closing && <p className="open-case-closing">{closing}</p>}
        </div>

        {!locked && sections.length > 0 && (
          <div className="case-sections">
            {sections.map((section, i) => {
              const media = section.media || {};
              return (
                <section className="case-section" id={`case-section-${i}`} data-index={i} key={i}>
                  {section.title && <h2 className="section-title">{section.title}</h2>}

                  {(media.video || media.image) && (
                    <figure className="section-media">
                      {media.video ? (
                        <video src={media.video} autoPlay loop muted playsInline />
                      ) : (
                        <img src={media.image} alt={media.alt || ""} />
                      )}
                    </figure>
                  )}

                  {section.body && (
                    <div className="section-body">
                      {section.body.split(/\n{2,}/).map((para, p) => (
                        <p key={p}>{para}</p>
                      ))}
                    </div>
                  )}

                  {section.stats && section.stats.length > 0 && (
                    <div className="stat-box">
                      {section.stats.map((stat, s) => (
                        <div className="stat" key={s}>
                          <span className="stat-value">{stat.value}</span>
                          <span className="stat-label">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </article>

      {locked && (
        <div className="locked-badge" role="status">
          <img src="/assets/case-lock.svg" alt="" aria-hidden="true" />Locked
        </div>
      )}
    </main>
  );
}

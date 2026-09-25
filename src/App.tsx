import { useEffect } from "react";
import { ArrowUpRight, CodeXml } from "lucide-react";
import PortfolioHero from "@/components/ui/portfolio-hero";
import CursorTrail from "@/components/ui/cursor-trail";

type Project = {
  index: string;
  category: string;
  title: string;
  text: string;
  signal: string;
  href: string;
  tools: string[];
  visual: string;
  visualLabel: string;
  visualWidth: number;
  visualHeight: number;
  optimizedWidth: number;
};

const projects: Project[] = [
  {
    index: "01",
    category: "Scientific intelligence",
    title: "SciRag",
    text: "A research engine that plans queries, retrieves papers through OpenAlex and ChromaDB, reranks the evidence, and returns cited reports reviewed by an agent council.",
    signal: "OpenAlex · MMR · cross-encoder",
    href: "https://github.com/joshi-mitali/SciRag",
    tools: ["Python", "LangChain", "HuggingFace", "ChromaDB"],
    visual: "projects/scirag.png",
    visualLabel: "Retrieval system",
    visualWidth: 1672,
    visualHeight: 941,
    optimizedWidth: 1280,
  },
  {
    index: "02",
    category: "Natural language interfaces",
    title: "NaturalDB",
    text: "A multi-agent database assistant for plain-language queries, analysis, guarded CRUD operations, and ER diagrams across MySQL, PostgreSQL, and SQLite.",
    signal: "Role-scoped agents · multi-database",
    href: "https://github.com/joshi-mitali/NaturalDB",
    tools: ["Python", "CrewAI", "SQLAlchemy", "Streamlit"],
    visual: "projects/naturaldb.png",
    visualLabel: "Interface preview",
    visualWidth: 784,
    visualHeight: 377,
    optimizedWidth: 784,
  },
  {
    index: "03",
    category: "Agentic security",
    title: "Hercules",
    text: "An autonomous VAPT and CTF platform that coordinates specialist agents, streams live progress to a React command center, and isolates tool execution behind MCP.",
    signal: "61 MCP tools · live WebSocket feed",
    href: "https://github.com/joshi-mitali/Automated-VAPT-Agent",
    tools: ["React", "FastAPI", "CrewAI", "FastMCP"],
    visual: "projects/hercules.png",
    visualLabel: "Interface preview",
    visualWidth: 1024,
    visualHeight: 640,
    optimizedWidth: 1024,
  },
  {
    index: "04",
    category: "Learning through interaction",
    title: "DeepVision",
    text: "An interactive learning lab that runs TensorFlow.js models in the browser and visualizes how CNNs, ANNs, GANs, and YOLO process data.",
    signal: "4 model families · browser inference",
    href: "https://github.com/joshi-mitali/DeepVision",
    tools: ["TensorFlow.js", "JavaScript", "HTML/CSS"],
    visual: "projects/deepvision.png",
    visualLabel: "Vision lab",
    visualWidth: 1672,
    visualHeight: 941,
    optimizedWidth: 1280,
  },
];

const capabilities = [
  ["Applied AI", "RAG & hybrid retrieval", "Natural language processing", "Deep learning", "Model evaluation"],
  ["Engineering", "Python", "FastAPI", "REST APIs", "Docker & Linux"],
  ["AI stack", "LangChain", "LangGraph", "CrewAI", "Hugging Face", "MCP"],
];

function App() {
  useEffect(() => {
    const root = document.documentElement;
    const timeline = document.querySelector<HTMLElement>(".timeline");
    let scrollFrame = 0;
    const updateScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        const max = root.scrollHeight - window.innerHeight;
        root.style.setProperty("--scroll-progress", `${max > 0 ? window.scrollY / max : 0}`);
        if (timeline) {
          const box = timeline.getBoundingClientRect();
          const progress = Math.max(0, Math.min(1, (window.innerHeight * .58 - box.top) / box.height));
          timeline.style.setProperty("--timeline-progress", `${progress}`);
        }
        scrollFrame = 0;
      });
    };
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : document.documentElement;
      if (!target) return;
      event.preventDefault();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (id) target.focus({ preventScroll: true });
      window.history.pushState(null, "", id ? `#${id}` : window.location.pathname);
    };
    const initialTarget = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
    const initialFrame = initialTarget
      ? requestAnimationFrame(() => initialTarget.scrollIntoView({ behavior: "auto", block: "start" }))
      : 0;
    window.addEventListener("scroll", updateScroll, { passive: true });
    document.addEventListener("click", handleAnchorClick);
    updateScroll();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(scrollFrame);
      if (initialFrame) cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", updateScroll);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <PortfolioHero />
      <main>
        <section className="profile-section" id="profile" tabIndex={-1}>
          <div className="section-shell">
            <div className="section-label" data-reveal><span>01</span>Profile</div>
            <div className="profile-layout">
              <div className="profile-statement" data-reveal>
                <p>AI systems people<br />can query, inspect,<br />and <em>use.</em></p>
              </div>
              <div className="profile-copy" data-reveal>
                <p>I’m a B.Tech Computer Science student focused on applied AI: retrieval pipelines, natural-language interfaces, agent workflows, and the engineering that makes them reliable.</p>
                <p>I work across the full build: framing the problem, prototyping the model layer, writing APIs, evaluating outputs, and shaping the interface. I’m looking for an AI/ML engineering internship where I can contribute quickly and keep learning.</p>
                <a className="text-link" href="#work">See selected work <ArrowUpRight size={17} /></a>
              </div>
            </div>
            <div className="capability-grid">
              {capabilities.map(([title, ...items], groupIndex) => (
                <div className="capability" data-reveal style={{ "--delay": `${groupIndex * 90}ms` } as React.CSSProperties} key={title}>
                  <div className="capability-head"><h3>{title}</h3></div>
                  <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="tech-marquee" aria-hidden="true">
          <div><span>Python</span><i>✦</i><span>RAG</span><i>✦</i><span>LangChain</span><i>✦</i><span>FastAPI</span><i>✦</i><span>Hugging Face</span><i>✦</i><span>Agents</span><i>✦</i><span>Python</span><i>✦</i><span>RAG</span><i>✦</i><span>LangChain</span><i>✦</i><span>FastAPI</span><i>✦</i><span>Hugging Face</span><i>✦</i><span>Agents</span><i>✦</i></div>
        </div>

        <section className="work-section" id="work" tabIndex={-1}>
          <CursorTrail
            className="project-trail"
            images={[
              `${import.meta.env.BASE_URL}projects/naturaldb-thumb.webp`,
              `${import.meta.env.BASE_URL}projects/hercules-thumb.webp`,
            ]}
          />
          <div className="section-shell">
            <div className="section-heading" data-reveal>
              <div className="section-label"><span>02</span>Selected work</div>
              <h2>Retrieval, data, security,<br /><em>and vision.</em></h2>
            </div>
            <div className="project-stack">
              {projects.map((project, projectIndex) => (
                <article className={`project-row project-row--${projectIndex + 1}`} key={project.title}>
                  <div className="project-body" data-reveal>
                    <div className="project-meta">
                      <span className="project-index">{project.index}</span>
                      <span className="project-category">{project.category}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.text}</p>
                    <span className="project-signal">{project.signal}</span>
                    <div className="project-tools">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
                  </div>
                  <div className="project-visual" data-reveal>
                    <picture>
                      <source
                        type="image/webp"
                        srcSet={`${import.meta.env.BASE_URL}${project.visual.replace(".png", "-640.webp")} 640w, ${import.meta.env.BASE_URL}${project.visual.replace(".png", ".webp")} ${project.optimizedWidth}w`}
                        sizes="(max-width: 680px) calc(100vw - 68px), (max-width: 800px) 50vw, 55vw"
                      />
                      <img src={`${import.meta.env.BASE_URL}${project.visual}`} alt={`${project.title} ${project.visualLabel.toLowerCase()}`} width={project.visualWidth} height={project.visualHeight} loading="lazy" decoding="async" />
                    </picture>
                    <span className="project-visual-caption">{project.visualLabel}</span>
                    <a href={project.href} target="_blank" rel="noreferrer" className="project-link" aria-label={`View ${project.title} on GitHub`}><span>View repository</span><ArrowUpRight size={17} /></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="experience-section" id="experience" tabIndex={-1}>
          <div className="section-shell experience-layout">
            <div className="experience-intro" data-reveal>
              <div className="section-label"><span>03</span>Experience</div>
              <h2>Rail data, AI builds,<br />and <em>campus work.</em></h2>
              <p>Railway sensor data taught me to question noisy measurements. Independent projects taught me to own the full pipeline. Campus work taught me to coordinate with others.</p>
            </div>
            <div className="timeline">
              <article data-reveal>
                <span className="timeline-date">Jun — Jul 2025</span>
                <h3>Data Analysis Trainee</h3>
                <h4>West Central Railway · Kota</h4>
                <p>Investigated Oscillation Monitoring System sensor data to identify track anomalies and support predictive-maintenance analysis.</p>
              </article>
              <article data-reveal>
                <span className="timeline-date">2025 — Present</span>
                <h3>AI / ML Project Work</h3>
                <h4>Independent practice</h4>
                <p>Built working systems across scientific retrieval, database agents, automated security testing, and in-browser model visualization.</p>
              </article>
              <article data-reveal>
                <span className="timeline-date">Campus · AI/ML</span>
                <h3>Elective Committee Member</h3>
                <h4>SCIMAT Club</h4>
                <p>Helped organize technical events and AI/ML activities for students on campus.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" tabIndex={-1}>
          <div className="contact-orbit" aria-hidden="true"><i /><i /></div>
          <div className="contact-inner" data-reveal>
            <span className="contact-kicker">AI / ML internships · early-career roles</span>
            <h2>Let’s talk about<br /><em>the work.</em></h2>
            <p>I’m looking for an AI/ML engineering internship working on retrieval, agent workflows, or model evaluation. The projects above show the systems and interfaces I’ve built so far.</p>
            <div className="contact-actions">
              <a href="https://github.com/joshi-mitali" target="_blank" rel="noreferrer"><CodeXml size={18} />Explore my GitHub</a>
              <a href="#work"><ArrowUpRight size={18} />Review selected work</a>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <span>© {new Date().getFullYear()} Mitali Joshi</span>
        <a href="#top">Back to top ↑</a>
        <span>AI engineer · India</span>
      </footer>
    </>
  );
}

export default App;

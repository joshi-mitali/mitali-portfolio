import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, CodeXml, Moon, Sun, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Profile", href: "#profile" },
  { label: "Selected work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

function AnimatedWord({ word, className = "" }: { word: string; className?: string }) {
  const letters = useMemo(() => word.split(""), [word]);
  return (
    <span className={`hero-word ${className}`} aria-label={word}>
      {letters.map((letter, index) => (
        <span
          aria-hidden="true"
          className="hero-letter"
          style={{ "--letter-index": index } as React.CSSProperties}
          key={`${letter}-${index}`}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

export default function PortfolioHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const tiltFrame = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem("mitali-theme");
    const nextDark = saved ? saved === "dark" : true;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", nextDark ? "#070807" : "#f7f7f5");
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) document.querySelector<HTMLAnchorElement>("#site-menu nav a")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => () => cancelAnimationFrame(tiltFrame.current), []);

  const toggleTheme = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", nextDark ? "#070807" : "#f7f7f5");
    localStorage.setItem("mitali-theme", nextDark ? "dark" : "light");
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -6;
    cancelAnimationFrame(tiltFrame.current);
    tiltFrame.current = requestAnimationFrame(() => {
      portraitRef.current?.style.setProperty("--tilt-x", `${y}deg`);
      portraitRef.current?.style.setProperty("--tilt-y", `${x}deg`);
    });
  };

  const resetTilt = () => {
    cancelAnimationFrame(tiltFrame.current);
    tiltFrame.current = requestAnimationFrame(() => {
      portraitRef.current?.style.setProperty("--tilt-x", "0deg");
      portraitRef.current?.style.setProperty("--tilt-y", "0deg");
    });
  };

  return (
    <section id="top" className="hero-shell" tabIndex={-1} onPointerMove={handlePointerMove} onPointerLeave={resetTilt}>
      <a href="#profile" className="skip-link">Skip to profile</a>
      <header className="site-header">
        <Button ref={menuButtonRef} className={`round-control menu-control ${menuOpen ? "is-open" : ""}`} onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="site-menu" aria-label={menuOpen ? "Close menu" : "Open menu"}>
          <span className="menu-control__lines" aria-hidden="true"><i /><i /></span>
        </Button>
        <a className="wordmark focus-ring" href="#top" aria-label="Mitali Joshi, home">M</a>
        <Button className="round-control" onClick={toggleTheme} aria-label={`Use ${dark ? "light" : "dark"} theme`}>
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </Button>
      </header>

      <div className={`menu-panel ${menuOpen ? "is-open" : ""}`} id="site-menu" aria-hidden={!menuOpen}>
        <div className="menu-panel__meta"><span>Navigate</span><span>Portfolio / 2026</span></div>
        <nav aria-label="Primary navigation">
          {navItems.map((item, index) => (
            <a href={item.href} key={item.label} tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>
              <span>0{index + 1}</span>{item.label}<ArrowUpRight />
            </a>
          ))}
        </nav>
        <div className="menu-panel__foot">
          <a href="https://github.com/joshi-mitali" target="_blank" rel="noreferrer" tabIndex={menuOpen ? 0 : -1}>GitHub</a>
          <a href="#contact" onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>Let’s talk</a>
        </div>
      </div>

      <div className="hero-content">
        <div className="hero-kicker hero-animate"><span className="status-dot" />Mitali Joshi · Open to AI/ML internships</div>
        <div className="hero-main">
          <h1 className="hero-name" aria-label="Mitali Joshi">
            <AnimatedWord word="MITALI" />
            <AnimatedWord word="JOSHI" className="hero-word--outline" />
          </h1>
          <div ref={portraitRef} className="portrait-stage hero-animate">
            <div className="portrait-card">
              <picture>
                <source srcSet={`${import.meta.env.BASE_URL}profile.webp`} type="image/webp" />
                <img src={`${import.meta.env.BASE_URL}profile.png`} alt="Mitali Joshi" width="418" height="658" decoding="async" fetchPriority="high" />
              </picture>
            </div>
          </div>
        </div>
        <div className="hero-statement hero-animate">
          <p>I build RAG, NLP, and agent systems from prototype to interface.</p>
          <span>Research · Engineering · Interface</span>
        </div>
      </div>
      <div className="hero-footer hero-animate">
        <div className="hero-socials">
          <a className="focus-ring" href="https://github.com/joshi-mitali" target="_blank" rel="noreferrer" aria-label="Mitali on GitHub"><CodeXml size={18} /></a>
          <a className="focus-ring" href="#contact" aria-label="Contact Mitali"><UserRound size={18} /></a>
        </div>
        <a className="scroll-cue focus-ring" href="#profile" aria-label="Scroll to profile"><span>Scroll to explore</span><ArrowDown size={18} /></a>
      </div>
    </section>
  );
}

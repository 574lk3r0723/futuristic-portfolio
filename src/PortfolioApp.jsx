/* PortfolioApp.jsx - Main React App */
import React from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Download, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import Fireworks from "fireworks"; // Import Fireworks

const projects = [
  { id: 1, title: "AI DevOps Dashboard", desc: "Realtime insights, anomaly detection and auto-remediation pipelines.", tags: ["React", "Node", "Kubernetes"], link: "#" },
  { id: 2, title: "Pallet Optimizer", desc: "Advanced packing algorithm for distribution logistics.", tags: ["Rust", "WebAssembly", "Python"], link: "#" },
  { id: 3, title: "Crossword Puzzle Engine", desc: "Procedural level generator, beautiful front-end and leaderboards.", tags: ["TypeScript", "React", "Redis"], link: "#" },
  { id: 4, title: "Portfolio Builder AI", desc: "An AI-powered web portfolio generator that writes your bio for you.", tags: ["Next.js", "OpenAI", "Tailwind"], link: "#" },
];

/* TypingAnimation component */
function TypingAnimation() {
  const phrases = ["Full-stack Engineer", "Performance-focused", "Pixel-perfect UI"];
  const [idx, setIdx] = React.useState(0);
  const [subIdx, setSubIdx] = React.useState(0);
  const [forward, setForward] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (forward) {
        if (subIdx < phrases[idx].length) {
          setSubIdx((s) => s + 1);
        } else {
          setForward(false);
        }
      } else {
        if (subIdx > 0) {
          setSubIdx((s) => s - 1);
        } else {
          setForward(true);
          setIdx((i) => (i + 1) % phrases.length);
        }
      }
    }, forward ? 80 : 40);
    return () => clearTimeout(timeout);
  }, [idx, subIdx, forward, phrases]);

  return (
    <div className="text-sm text-slate-400 mb-2">
      <span className="inline-block rounded px-3 py-1 bg-slate-800/40 backdrop-blur-sm">
        {phrases[idx].slice(0, subIdx)}
        <span className="ml-1 inline-block w-1 h-4 align-middle bg-slate-400 animate-pulse" />
      </span>
    </div>
  );
}

export default function PortfolioApp() {
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const [status, setStatus] = React.useState(null);
  const [current, setCurrent] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const nextSlide = () => setCurrent((prev) => (prev + 1) % projects.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + projects.length) % projects.length);

  React.useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, projects.length]);

  const submitContact = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await axios.post("/api/contact", form, { timeout: 10000 });
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#071033] to-[#001219] text-slate-100 antialiased overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-40 left-1/2 w-[1200px] h-[1200px] rounded-full blur-3xl opacity-30"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.45), rgba(56,189,248,0.35))", transform: "translateX(-50%)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-2xl flex items-center justify-center text-black font-bold">TS</div>
          <div className="font-medium">Your Name</div>
        </div>
        <nav className="space-x-4 hidden md:flex">
          <a href="#projects" className="hover:underline">Projects</a>
          <a href="#about" className="hover:underline">About</a>
          <a href="#contact" className="hover:underline">Contact</a>
          <a href="/resume.pdf" className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 transition">Resume <Download size={14} /></a>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16">
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center relative">
          {/* Left Column */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
            >
              Building{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 to-purple-300">
                futuristic
              </span>{" "}
              web experiences —<br /> that recruiters remember.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-6 text-slate-300 max-w-xl"
            >
              I'm a full-stack engineer who blends performant architecture with pixel-perfect UI.
              I focus on shipping results that scale, impress, and solve business problems.
            </motion.p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 font-semibold shadow-lg hover:scale-105 transform transition"
              >
                See Projects
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-700"
              >
                <Mail size={16} /> Contact
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <a href="#" className="flex items-center gap-2 hover:underline">
                <Github size={16} /> github.com/you
              </a>
              <a href="#" className="flex items-center gap-2 hover:underline">
                <Linkedin size={16} /> linkedin.com/in/you
              </a>
            </div>
          </div>

          {/* Right Column: Photo with fireworks */}
          <div className="flex flex-col justify-center items-center md:items-end mt-6 md:mt-0 relative w-full h-full">
            {/* Fireworks canvas behind the image */}
            <div className="absolute top-0 right-0 w-64 h-72 md:w-72 md:h-72">
              <Fireworks intensity={0.8} particleCount={30} />
            </div>

            <TypingAnimation />

            <motion.img
              src="/me.jpg"
              alt="Ryan"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-2xl object-cover shadow-xl border-4 border-slate-700 mt-4 relative z-10"
            />
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mt-16 relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <h2 className="text-2xl font-semibold text-center">Projects</h2>
          <p className="text-slate-400 mt-2 text-center">Auto-playing carousel — pause to explore manually.</p>
          <div className="relative mt-10 overflow-hidden">
            <motion.div key={current} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl rounded-2xl border border-slate-800/60 backdrop-blur-sm p-8 text-center shadow-lg">
              <h3 className="text-xl font-semibold mb-3">{projects[current].title}</h3>
              <p className="text-slate-300 mb-4">{projects[current].desc}</p>
              <div className="flex justify-center gap-2 mb-4">
                {projects[current].tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-md border border-slate-700 text-xs text-slate-400">{tag}</span>
                ))}
              </div>
              <a href={projects[current].link} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 font-semibold hover:scale-105 transition">View Project</a>
            </motion.div>
            <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-800/60 hover:bg-slate-700 p-2 rounded-full"><ChevronLeft size={20} /></button>
            <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800/60 hover:bg-slate-700 p-2 rounded-full"><ChevronRight size={20} /></button>
            <div className="flex justify-center gap-2 mt-4">
              {projects.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === current ? 'bg-cyan-400' : 'bg-slate-700'}`} />
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mt-16 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold">About me</h3>
            <p className="text-slate-300 mt-3">I design and build high-impact web applications. I love combining backend performance with immersive front-end experiences. My focus: reliability, speed, and delightful UX.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Skills & Tools</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <div className="rounded-lg p-3 border border-slate-800/60">React • TypeScript</div>
              <div className="rounded-lg p-3 border border-slate-800/60">Node • Express • Prisma</div>
              <div className="rounded-lg p-3 border border-slate-800/60">Postgres • Redis</div>
              <div className="rounded-lg p-3 border border-slate-800/60">Docker • K8s • AWS</div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mt-16">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="text-slate-400 mt-2">Open to full-time, contract, and advisory roles. Reach out — I reply fast.</p>

          <form className="rounded-2xl p-6 border border-slate-800/60 mt-6" onSubmit={submitContact}>
            <div className="grid gap-3">
              <input name="name" value={form.name} onChange={handleChange} required placeholder="Name" className="rounded-md p-3 bg-transparent border border-slate-700" />
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="rounded-md p-3 bg-transparent border border-slate-700" />
              <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Message" className="rounded-md p-3 bg-transparent border border-slate-700" />
              <button type="submit" className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-cyan-400 font-semibold">Send</button>
              <div className="text-sm text-slate-400">{status === 'sending' ? 'Sending…' : status === 'sent' ? 'Message sent!' : status === 'error' ? 'Error — try again' : ''}</div>
            </div>
          </form>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-500">© {new Date().getFullYear()} Your Name — Built with React + Tailwind + Framer Motion</footer>
      </main>
    </div>
  );
}

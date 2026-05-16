import React, { useRef } from "react";

const blogs = [
  {
    title: "How CPU Pipelines Actually Work",
    date: "May 2025",
    tag: "Systems",
    tagColor: "#3fb950",
    desc: "A visual walkthrough of fetch-decode-execute-retire and why branch misprediction is so costly. No fluff, just the mental model.",
    readTime: "8 min read",
    href: "#",
  },
  {
    title: "Writing a Toy Compiler in Rust",
    date: "Apr 2025",
    tag: "Rust",
    tagColor: "#ff7043",
    desc: "Lexer → parser → AST → codegen. I built a mini language that compiles to x86 assembly. Here's everything I learned along the way.",
    readTime: "14 min read",
    href: "#",
  },
  {
    title: "React's Reconciler: Beyond the VDOM",
    date: "Mar 2025",
    tag: "React",
    tagColor: "#61DAFB",
    desc: "Fibers, priorities, and how concurrent mode actually schedules work. Understanding this changed how I think about performance.",
    readTime: "10 min read",
    href: "#",
  },
  {
    title: "PostgreSQL Query Plans Explained",
    date: "Feb 2025",
    tag: "Databases",
    tagColor: "#336791",
    desc: "EXPLAIN ANALYZE, seq scans vs index scans, nested loop joins — a practical guide to reading and optimizing query plans.",
    readTime: "12 min read",
    href: "#",
  },
  {
    title: "The Beauty of Memory-Mapped Files",
    date: "Jan 2025",
    tag: "Systems",
    tagColor: "#3fb950",
    desc: "mmap is one of the most elegant system calls. Here's why it's used in databases, JVMs, and high-performance I/O code everywhere.",
    readTime: "7 min read",
    href: "#",
  },
  {
    title: "Build Your Own Async Runtime",
    date: "Dec 2024",
    tag: "Internals",
    tagColor: "#e040fb",
    desc: "Event loops, epoll, wakers, and futures. A ground-up explanation of how async/await actually works under the hood.",
    readTime: "16 min read",
    href: "#",
  },
];

function useTilt(strength = 10) {
  const ref = useRef(null);
  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left)  / rect.width  - 0.5) * strength;
    const y = ((e.clientY - rect.top)   / rect.height - 0.5) * -strength;
    el.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

function BlogCard({ blog }) {
  const tilt = useTilt();
  return (
    <a
      href={blog.href}
      className="blog-card"
      style={{ "--blog-color": blog.tagColor, transition: "transform 0.15s ease" }}
      {...tilt}
      ref={tilt.ref}
    >
      <div className="blog-card-top">
        <span className="blog-tag" style={{ color: blog.tagColor, borderColor: `${blog.tagColor}44` }}>{blog.tag}</span>
        <span className="blog-date">{blog.date}</span>
      </div>
      <h3 className="blog-title">{blog.title}</h3>
      <p className="blog-desc">{blog.desc}</p>
      <div className="blog-footer">
        <span className="blog-read-time">{blog.readTime}</span>
        <span className="blog-arrow" style={{ color: blog.tagColor }}>Read →</span>
      </div>
    </a>
  );
}

export default function BlogsPage() {
  return (
    <section className="page">
      <div className="section-head">
        <p className="eyebrow">engineering writings</p>
        <h2>Things I learned<br />the hard way.</h2>
      </div>
      <p style={{ color: "var(--muted)", marginBottom: "40px", fontSize: "17px", lineHeight: "1.7" }}>
        Deep dives into systems programming, compiler internals, database engines, and
        the fascinating machinery hiding beneath every abstraction.
      </p>

      <div className="blog-grid">
        {blogs.map((b) => <BlogCard key={b.title} blog={b} />)}
      </div>
    </section>
  );
}

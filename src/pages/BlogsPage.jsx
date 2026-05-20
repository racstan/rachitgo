import React, { useState, useEffect } from "react";
import TiltCard from "../components/TiltCard.jsx";
import HoverTypingText from "../components/HoverTypingText.jsx";
import { X, Calendar, Clock, Tag } from "lucide-react";

const blogs = [
  {
    id: "cpu-pipelines",
    title: "How CPU Pipelines Actually Work",
    date: "May 2025",
    tag: "Systems",
    tagColor: "#3fb950",
    desc: "A visual walkthrough of fetch-decode-execute-retire and why branch misprediction is so costly. No fluff, just the mental model.",
    readTime: "8 min read",
    content: `### The Assembly Line of Compute

Modern CPUs do not execute instructions in isolated, serial steps. Instead, they operate like a high-speed factory assembly line, utilizing **instruction pipelining**. A standard pipeline splits instruction execution into several discrete stages:

1. **Fetch (IF)**: The instruction is retrieved from the L1 Instruction Cache using the Program Counter (PC).
2. **Decode (ID)**: The instruction is parsed and broken into micro-operations (uops) that the execution units understand.
3. **Execute (EX)**: The Arithmetic Logic Unit (ALU) or floating-point unit performs the actual mathematical operation.
4. **Memory Access (MEM)**: Reads or writes data to the L1 Data Cache if required.
5. **Writeback (WB)**: The final result is written back to the CPU register file.

---

### The Penalty of Branch Misprediction

Consider a simple loop checking array values:
\`\`\`cpp
for (int i = 0; i < 1000; i++) {
    if (data[i] > 128) {
        sum += data[i];
    }
}
\`\`\`

When the CPU encounters the conditional check, it doesn't know yet whether it will branch or not (since the Execute stage is further down the pipeline). To keep the assembly line full, the CPU **guesses** the direction of the branch using its branch predictor.

If it guesses correctly, execution proceeds at full speed. If it guesses wrong (**branch misprediction**), the CPU must:
- Flush all instructions currently in the pipeline stages.
- Roll back register states.
- Re-fetch instructions from the correct branch target path.

This flush can cost **15 to 20 clock cycles**, which is why sorted arrays run significantly faster than unsorted ones in hot loops. Pipelining yields massive performance, but it requires highly accurate prediction algorithms to stay efficient.`,
  },
  {
    id: "rust-compiler",
    title: "Writing a Toy Compiler in Rust",
    date: "Apr 2025",
    tag: "Rust",
    tagColor: "#ff7043",
    desc: "Lexer → parser → AST → codegen. I built a mini language that compiles to x86 assembly. Here's everything I learned along the way.",
    readTime: "14 min read",
    content: `### Demystifying Compilation

Compilers are often treated as black boxes, but their core pipeline is highly systematic. The compilation process consists of four main phases:

1. **Lexical Analysis (The Lexer)**: Takes a raw string of code and splits it into a stream of tokens (e.g., keywords, identifiers, symbols).
2. **Syntax Analysis (The Parser)**: Takes the stream of tokens and structures it into an **Abstract Syntax Tree (AST)** according to a formal grammar.
3. **Semantic Analysis**: Traverses the AST to check type safety, scopes, and valid language rules.
4. **Code Generation**: Translates the AST into target machine instructions (such as x86 assembly or LLVM Intermediate Representation).

---

### Why Rust is Perfect for Compilers

Rust’s type system, algebraic data types (enums), and pattern matching make it extremely well-suited for compiler development.

For example, representing an AST Node is highly intuitive using Rust enums:

\`\`\`rust
enum Expr {
    Number(i64),
    BinaryOp {
        op: char,
        left: Box<Expr>,
        right: Box<Expr>,
    },
    Variable(String),
}
\`\`\`

Evaluating or traversing this tree becomes a matter of matching on these variants:

\`\`\`rust
fn evaluate(expr: &Expr) -> i64 {
    match expr {
        Expr::Number(val) => *val,
        Expr::BinaryOp { op, left, right } => {
            let l = evaluate(left);
            let r = evaluate(right);
            match op {
                '+' => l + r,
                '-' => l - r,
                '*' => l * r,
                _ => panic!("Unsupported operator"),
            }
        }
        Expr::Variable(_) => unimplemented!(),
    }
}
\`\`\`

Rust enforces exhaustive matching, meaning you can never forget to handle an AST node type, leading to robust compilers.`,
  },
  {
    id: "react-reconciler",
    title: "React's Reconciler: Beyond the VDOM",
    date: "Mar 2025",
    tag: "React",
    tagColor: "#61DAFB",
    desc: "Fibers, priorities, and how concurrent mode actually schedules work. Understanding this changed how I think about performance.",
    readTime: "10 min read",
    content: `### The Virtual DOM Myth

Many developers believe React is fast simply because it uses a Virtual DOM. However, rebuilding the virtual tree and running diff algorithms on every state change is still expensive. React 16+ completely rewrote its engine under the codename **Fiber** to solve a different problem: main-thread blocking.

In the old stack reconciler, React would recursively traverse the component tree. Once it started rendering a frame, it could not stop. If the tree was large, this would block the main thread for 100ms+, causing frames to drop and UI interactions to stutter.

---

### Understanding Fibers

A **Fiber** is a plain JavaScript object representing a unit of work. It is a node in a doubly-linked list structure, rather than a recursive tree. This allows React to:

- Pause rendering work and yield to the browser’s main thread for layout/paint requests.
- Assign priorities to different updates (e.g., user typing has higher priority than background data updates).
- Reuse or discard rendering work.

The execution loop operates inside a scheduler:

\`\`\`javascript
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1; // Yield if frame deadline is close
  }
  if (!nextUnitOfWork && pendingCommit) {
    commitRoot(); // Push updates to the real DOM
  }
  requestIdleCallback(workLoop);
}
\`\`\`

By chunking work into small units and scheduling them based on frame budgets, React maintains responsiveness even during heavy data reflows.`,
  },
  {
    id: "postgres-query-plans",
    title: "PostgreSQL Query Plans Explained",
    date: "Feb 2025",
    tag: "Databases",
    tagColor: "#336791",
    desc: "EXPLAIN ANALYZE, seq scans vs index scans, nested loop joins — a practical guide to reading and optimizing query plans.",
    readTime: "12 min read",
    content: `### The Query Planner

Whenever you run a SQL query, PostgreSQL doesn't execute it blindly. The **Query Planner** analyzes your query and parses table metadata (statistics, row sizes, indexes) to generate the most efficient execution plan.

To inspect this plan, we use the \`EXPLAIN ANALYZE\` command:

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'asthanarachit@gmail.com';
\`\`\`

---

### Scanning Strategies

PostgreSQL uses different methods to scan tables for matching rows:

- **Sequential Scan (Seq Scan)**: Scans every single page of the table from disk. Used when searching unindexed columns or when the planner estimates that a large percentage of the table matches.
- **Index Scan**: Traverses a B-Tree index to find specific row pointers, then fetches the actual rows from disk. Fast for retrieving small subsets of rows.
- **Index Only Scan**: Retrieves data directly from the index tree without reading the table disk pages at all. Happens when the requested columns are all part of the index.

### Join Types in Plans

When joining tables, watch out for:
1. **Nested Loop**: For each row in Table A, scan Table B. Fast for small tables, but scales poorly.
2. **Hash Join**: Build an in-memory hash table of Table A, then scan Table B. Fast for large datasets.
3. **Merge Join**: Sort both tables on the join keys and merge them. Highly efficient when keys are already indexed.`,
  },
  {
    id: "mmap-files",
    title: "The Beauty of Memory-Mapped Files",
    date: "Jan 2025",
    tag: "Systems",
    tagColor: "#3fb950",
    desc: "mmap is one of the most elegant system calls. Here's why it's used in databases, JVMs, and high-performance I/O code everywhere.",
    readTime: "7 min read",
    content: `### The Overhead of Traditional I/O

When reading a file using standard system calls like \`read()\`, the data must undergo multiple memory copies:

1. The OS kernel reads data from disk into a page cache buffer.
2. The OS copies the data from kernel page cache into user space memory allocated by the application.
3. This context switch and memory copying introduces substantial CPU overhead under high-volume operations.

---

### The mmap Solution

Memory mapping (\`mmap\`) maps a file's pages directly into the **virtual address space** of a process. The application reads and writes memory addresses as if they were an array in RAM, completely bypassing the kernel-to-user space copy buffer.

- **On Demand loading**: The file isn't loaded into RAM instantly. Instead, accessing a memory offset triggers a **Page Fault**, prompting the OS to fetch that specific page from disk.
- **Zero-Copy writes**: Writing to the mapped memory marks pages as 'dirty'. The OS flushes these pages back to disk asynchronously in the background.

\`\`\`c
// Mapping a file directly to memory in C
int fd = open("huge_data.bin", O_RDWR);
char* file_memory = mmap(NULL, file_size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);

// You can now access file content directly
printf("First character: %c\\n", file_memory[0]);

// Clean up
munmap(file_memory, file_size);
close(fd);
\`\`\`

This technique is why databases like MongoDB, LMDB, and Kafka can achieve such extreme read/write throughput on disk-bound operations.`,
  },
  {
    id: "async-runtime",
    title: "Build Your Own Async Runtime",
    date: "Dec 2024",
    tag: "Internals",
    tagColor: "#e040fb",
    desc: "Event loops, epoll, wakers, and futures. A ground-up explanation of how async/await actually works under the hood.",
    readTime: "16 min read",
    content: `### What is Async/Await?

In systems languages like Rust or C++, async functions return a state machine called a **Future** (or Promise). A Future does not execute in the background automatically; it is passive and must be repeatedly polled to make progress.

An **Async Runtime** is the active engine that polls these futures, handles waiting states, and interacts with the OS kernel to schedule hardware interrupts.

---

### The Components of a Runtime

A custom async runtime has three core structures:

1. **The Executor**: An execution loop that pops ready-to-run futures from a task queue and runs their \`poll()\` method.
2. **The Reactor (I/O Poller)**: Interacts with kernel event notification systems (like \`epoll\` on Linux, \`kqueue\` on macOS). It registers file descriptors and wakes the executor when I/O operations complete.
3. **The Waker**: A token passed to poll loops. If a future yields because it is waiting for network data, it saves the waker. Once data arrives, the Reactor triggers the waker, pushing the task back onto the executor's run queue.

\`\`\`rust
// Simple conceptual run loop
loop {
    // 1. Process tasks ready to execute
    while let Some(task) = ready_queue.pop() {
        let waker = task.create_waker();
        let mut context = Context::from_waker(&waker);
        if let Poll::Ready(_) = task.future.poll(&mut context) {
            // Task completed!
        }
    }
    
    // 2. No tasks are ready; block on I/O events
    reactor.poll_io_events(); 
}
\`\`\`

This architecture allows a single thread to handle millions of concurrent network connections without thread context-switching penalties.`,
  },
];

function BlogCard({ blog, onClick }) {
  return (
    <TiltCard
      element="button"
      className="blog-card"
      onClick={onClick}
      style={{ "--blog-color": blog.tagColor, display: "block", width: "100%", textAlign: "left", cursor: "pointer" }}
    >
      <div className="blog-card-top">
        <span className="blog-tag" style={{ color: blog.tagColor, borderColor: `${blog.tagColor}44` }}>{blog.tag}</span>
        <span className="blog-date">{blog.date}</span>
      </div>
      <h3 className="blog-title">{blog.title}</h3>
      <p className="blog-desc">{blog.desc}</p>
      <div className="blog-footer">
        <span className="blog-read-time">{blog.readTime}</span>
        <span className="blog-arrow" style={{ color: blog.tagColor }}>Read Article →</span>
      </div>
    </TiltCard>
  );
}

function parseInlineMarkdown(text) {
  const combinedRegex = /\*\*(.*?)\*\*|`(.*?)`/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = combinedRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(<strong key={match.index}>{match[1]}</strong>);
    } else if (match[2]) {
      parts.push(<code key={match.index} className="inline-code">{match[2]}</code>);
    }
    lastIndex = combinedRegex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
}

function renderMarkdown(content) {
  const blocks = content.split("```");
  return blocks.map((block, index) => {
    if (index % 2 === 1) {
      const firstNewline = block.indexOf("\n");
      const lang = block.slice(0, firstNewline).trim();
      const code = block.slice(firstNewline + 1).trim();
      return (
        <pre key={index} className="code-block">
          <div className="code-header">{lang || "code"}</div>
          <code>{code}</code>
        </pre>
      );
    }
    
    return block.split("\n\n").map((paragraph, pIdx) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;
      
      if (trimmed.startsWith("### ")) {
        return <h3 key={`${index}-${pIdx}`}>{trimmed.replace("### ", "").trim()}</h3>;
      }
      
      if (trimmed === "---") {
        return <hr key={`${index}-${pIdx}`} style={{ border: "none", borderTop: "1px solid var(--line)", margin: "20px 0" }} />;
      }
      
      if (trimmed.startsWith("- ")) {
        return (
          <ul key={`${index}-${pIdx}`} className="content-list">
            {trimmed.split("\n").map((li, idx) => (
              <li key={idx}>
                {parseInlineMarkdown(li.replace("- ", "").trim())}
              </li>
            ))}
          </ul>
        );
      }
      
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <ol key={`${index}-${pIdx}`} className="content-list" style={{ listStyleType: "decimal", paddingLeft: "20px" }}>
            {trimmed.split("\n").map((li, idx) => (
              <li key={idx}>
                {parseInlineMarkdown(li.replace(/^\d+\.\s/, "").trim())}
              </li>
            ))}
          </ol>
        );
      }
      
      return (
        <p key={`${index}-${pIdx}`} className="content-paragraph">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    });
  });
}

export default function BlogsPage() {
  const [activeBlog, setActiveBlog] = useState(null);

  // Close modal on escape key
  useEffect(() => {
    if (!activeBlog) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveBlog(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeBlog]);

  return (
    <section className="page">
      <div className="section-head">
        <p className="eyebrow">engineering writings</p>
        <HoverTypingText
          element="h2"
          variants={[
            "Things I learned\nthe hard way.",
            "Notes from the build\nand the bugs.",
            "Lessons from shipping\nreal software.",
            "Systems notes and\nengineering stories.",
            "What broke and\nwhat I learned.",
          ]}
        />
      </div>
      <p style={{ color: "var(--muted)", marginBottom: "40px", fontSize: "17px", lineHeight: "1.7" }}>
        Deep dives into systems programming, compiler internals, database engines, and
        the fascinating machinery hiding beneath every abstraction.
      </p>

      <div className="blog-grid">
        {blogs.map((b) => (
          <BlogCard key={b.title} blog={b} onClick={() => setActiveBlog(b)} />
        ))}
      </div>

      {/* Reader Overlay Modal */}
      {activeBlog && (
        <div className="blog-reader-overlay" onClick={() => setActiveBlog(null)}>
          <div className="blog-reader-modal" onClick={(e) => e.stopPropagation()}>
            <header className="blog-reader-header">
              <div className="blog-reader-meta">
                <span className="blog-tag" style={{ color: activeBlog.tagColor, borderColor: `${activeBlog.tagColor}44` }}>
                  {activeBlog.tag}
                </span>
                <div className="blog-reader-stats">
                  <span><Calendar size={13} /> {activeBlog.date}</span>
                  <span><Clock size={13} /> {activeBlog.readTime}</span>
                </div>
              </div>
              <h2>{activeBlog.title}</h2>
              <button className="blog-reader-close" onClick={() => setActiveBlog(null)} aria-label="Close reader">
                <X size={18} />
              </button>
            </header>
            <div className="blog-reader-content">
              {renderMarkdown(activeBlog.content)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

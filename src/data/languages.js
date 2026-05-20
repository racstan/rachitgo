const commonCpuTail = [
  {
    title: "OS output path",
    unit: "io",
    explain: "The runtime asks the operating system or browser host to write bytes to an output stream.",
    artifact: ({ text }) => `stdout buffer <= ${JSON.stringify(text.join("\\n"))}`,
  },
  {
    title: "Machine instruction view",
    unit: "machine",
    explain: "At the lowest useful software level, the work becomes loads, stores, branches, calls, and a write-like operation.",
    artifact: () => "mov/load bytes -> call write/host_print -> branch -> return",
  },
  {
    title: "CPU pipeline",
    unit: "cpu",
    explain: "The processor fetches instructions, decodes them into micro-ops, executes them, and retires the visible result.",
    artifact: () => "fetch -> decode -> issue -> execute -> retire",
  },
  {
    title: "Logic gates",
    unit: "gates",
    explain: "Arithmetic and control decisions are built from transistor-backed gates. This is a visual simplification, not real execution.",
    artifact: () => "AND / OR / XOR / NOT combine bits into control and data signals",
  },
  {
    title: "Electrical switching",
    unit: "electrons",
    explain: "Voltage changes charge and discharge tiny capacitances. The UI draws that as moving binary pulses.",
    artifact: () => "wire: 01001000 -> 01101001 -> visible pixels",
  },
  {
    title: "Browser console result",
    unit: "screen",
    explain: "The final result is shown as console output in the portfolio, because this is a safe hard-coded simulation.",
    artifact: ({ text }) => text.map((line) => `> ${line}`).join("\n"),
  },
];

function printText(item) {
  return item.output;
}

function makeCode(template) {
  return (item) => template(printText(item));
}

function withTail(steps) {
  return [...steps, ...commonCpuTail];
}

export const languages = [
  {
    id: "python",
    name: "Python (Executable Pseudocode)",
    fileExt: "py",
    code: makeCode(([a, b]) => `print("${a}")\nprint("${b}")`),
    steps: withTail([
      {
        title: "Source file",
        unit: "source",
        explain: "Python starts as plain text in a .py file. A module or script is executed as a code block.",
        artifact: ({ item, language }) => language.code(item),
      },
      {
        title: "Parse and compile",
        unit: "parser",
        explain: "The interpreter parses source and compiles it into a code object.",
        artifact: () => "Module(body=[Expr(Call(Name('print'))), Expr(Call(Name('print')))])",
      },
      {
        title: "Bytecode",
        unit: "bytecode",
        explain: "CPython-style execution runs bytecode instructions inside an execution frame.",
        artifact: () => "LOAD_NAME print\nLOAD_CONST line_1\nCALL 1\nLOAD_NAME print\nLOAD_CONST line_2\nCALL 1",
      },
      {
        title: "Interpreter loop",
        unit: "runtime",
        explain: "The bytecode interpreter dispatches each opcode and calls the built-in print function.",
        artifact: () => "frame.locals = {}\nstack.push(print)\nstack.push(text)\nCALL -> PyFile_WriteObject",
      },
    ]),
  },
  {
    id: "c",
    name: "C (Structured Pointer Torture)",
    fileExt: "c",
    code: makeCode(([a, b]) => `#include <stdio.h>\n\nint main(void) {\n    printf("${a}\\n");\n    printf("${b}\\n");\n    return 0;\n}`),
    steps: withTail([
      {
        title: "Source file",
        unit: "source",
        explain: "C starts as text with includes, declarations, and calls to libc functions such as printf.",
        artifact: ({ item, language }) => language.code(item),
      },
      {
        title: "Preprocessor",
        unit: "parser",
        explain: "The preprocessor expands directives and makes declarations from headers visible to the compiler.",
        artifact: () => "extern int printf(const char *, ...);\nint main(void) { printf(...); printf(...); }",
      },
      {
        title: "Compiler",
        unit: "bytecode",
        explain: "The compiler checks syntax/types and lowers the program toward assembly or object code.",
        artifact: () => "call printf\ncall printf\nmov eax, 0\nret",
      },
      {
        title: "Assembler and linker",
        unit: "runtime",
        explain: "The assembler creates object code. The linker resolves printf through the C runtime/library path.",
        artifact: () => "main.o + libc printf symbol -> executable image",
      },
    ]),
  },
  {
    id: "cpp",
    name: "C++ (Template Metaprogramming Overload)",
    fileExt: "cpp",
    code: makeCode(([a, b]) => `#include <iostream>\n\nint main() {\n    std::cout << "${a}" << '\\n';\n    std::cout << "${b}" << '\\n';\n}`),
    steps: withTail([
      {
        title: "Source file",
        unit: "source",
        explain: "C++ source contains templates, overloads, and standard library abstractions over lower-level output.",
        artifact: ({ item, language }) => language.code(item),
      },
      {
        title: "Frontend analysis",
        unit: "parser",
        explain: "The compiler parses the program, resolves overloaded operators, and type-checks std::cout calls.",
        artifact: () => "operator<<(std::ostream&, const char*)\noperator<<(std::ostream&, char)",
      },
      {
        title: "Optimization IR",
        unit: "bytecode",
        explain: "The compiler lowers high-level stream operations into calls and memory operations.",
        artifact: () => "store string literal\ncall ostream_insert\ncall put_newline",
      },
      {
        title: "Link runtime",
        unit: "runtime",
        explain: "The final binary links against the C++ runtime and standard library implementation.",
        artifact: () => "main.o + libstdc++/libc++ -> executable",
      },
    ]),
  },
  {
    id: "rust",
    name: "Rust (Borrow Checker Whipping Boy)",
    fileExt: "rs",
    code: makeCode(([a, b]) => `fn main() {\n    println!("${a}");\n    println!("${b}");\n}`),
    steps: withTail([
      {
        title: "Source file",
        unit: "source",
        explain: "Rust source uses macros such as println! before the compiler lowers it further.",
        artifact: ({ item, language }) => language.code(item),
      },
      {
        title: "Macro and HIR",
        unit: "parser",
        explain: "rustc expands macros, parses the program, and builds high-level compiler representations.",
        artifact: () => "println! -> format_args! -> std::io::_print(...)",
      },
      {
        title: "MIR",
        unit: "bytecode",
        explain: "Rust uses MIR as a mid-level representation before LLVM code generation.",
        artifact: () => "bb0: _1 = Arguments::new_const(...)\n_2 = _print(move _1)\nreturn",
      },
      {
        title: "LLVM and native code",
        unit: "runtime",
        explain: "MIR lowers to LLVM IR, then to target machine code and runtime/library calls.",
        artifact: () => "MIR -> LLVM IR -> object code -> linked binary",
      },
    ]),
  },
  {
    id: "javascript",
    name: "JavaScript (NaN-tastic [object Object] Master)",
    fileExt: "js",
    code: makeCode(([a, b]) => `console.log("${a}");\nconsole.log("${b}");`),
    steps: withTail([
      {
        title: "Source file",
        unit: "source",
        explain: "JavaScript is parsed by an engine inside a host environment such as a browser or Node.js.",
        artifact: ({ item, language }) => language.code(item),
      },
      {
        title: "Parse and bytecode/JIT",
        unit: "parser",
        explain: "Engines parse source, build internal representations, and may generate bytecode and optimized machine code.",
        artifact: () => "CallExpression(console.log, string)\nCallExpression(console.log, string)",
      },
      {
        title: "Call stack",
        unit: "bytecode",
        explain: "Synchronous console.log calls run on the execution stack before control returns to the host.",
        artifact: () => "global frame -> console.log frame -> host console sink",
      },
      {
        title: "Host console",
        unit: "runtime",
        explain: "The host provides the console object and decides how printed output becomes visible.",
        artifact: () => "engine call -> browser console API -> UI log entry",
      },
    ]),
  },
  {
    id: "typescript",
    name: "TypeScript (Any-Script in Production)",
    fileExt: "ts",
    code: makeCode(([a, b]) => `const title: string = "${a}";\nconst detail: string = "${b}";\nconsole.log(title);\nconsole.log(detail);`),
    steps: withTail([
      {
        title: "Source file",
        unit: "source",
        explain: "TypeScript adds static types over JavaScript source.",
        artifact: ({ item, language }) => language.code(item),
      },
      {
        title: "Type checking",
        unit: "parser",
        explain: "The TypeScript compiler checks types, then transpiles code to JavaScript.",
        artifact: () => "title: string OK\ndetail: string OK\nemit JavaScript",
      },
      {
        title: "JavaScript output",
        unit: "bytecode",
        explain: "The runtime executes JavaScript, not TypeScript types.",
        artifact: () => "const title = ...;\nconst detail = ...;\nconsole.log(title);\nconsole.log(detail);",
      },
      {
        title: "JS runtime",
        unit: "runtime",
        explain: "The emitted JavaScript follows the engine and host console path.",
        artifact: () => "parse JS -> call stack -> console host API",
      },
    ]),
  },
  {
    id: "java",
    name: "Java (AbstractSingletonProxyFactoryBean)",
    fileExt: "java",
    code: makeCode(([a, b]) => `class Portfolio {\n    public static void main(String[] args) {\n        System.out.println("${a}");\n        System.out.println("${b}");\n    }\n}`),
    steps: withTail([
      {
        title: "Source file",
        unit: "source",
        explain: "Java source is compiled by javac into JVM bytecode.",
        artifact: ({ item, language }) => language.code(item),
      },
      {
        title: "javac",
        unit: "parser",
        explain: "The compiler checks classes, methods, and types, then emits a .class file.",
        artifact: () => "Portfolio.java -> Portfolio.class",
      },
      {
        title: "JVM bytecode",
        unit: "bytecode",
        explain: "The JVM loads bytecode instructions and executes or JIT-compiles hot paths.",
        artifact: () => "getstatic System.out\nldc line_1\ninvokevirtual println\nldc line_2\ninvokevirtual println",
      },
      {
        title: "JVM runtime",
        unit: "runtime",
        explain: "The virtual machine handles class loading, stack frames, and calls into native output paths.",
        artifact: () => "JVM frame -> PrintStream.println -> native/OS write path",
      },
    ]),
  },
  {
    id: "go",
    name: "Go (if err != nil Generator)",
    fileExt: "go",
    code: makeCode(([a, b]) => `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("${a}")\n    fmt.Println("${b}")\n}`),
    steps: withTail([
      {
        title: "Source file",
        unit: "source",
        explain: "Go source is compiled with package analysis and straightforward tooling.",
        artifact: ({ item, language }) => language.code(item),
      },
      {
        title: "Parse and type check",
        unit: "parser",
        explain: "The compiler parses the package, resolves imports, and checks types.",
        artifact: () => "import fmt -> resolve fmt.Println -> type-check string args",
      },
      {
        title: "SSA backend",
        unit: "bytecode",
        explain: "Go lowers code through compiler IR/SSA and emits target machine code.",
        artifact: () => "StaticCall fmt.Println\nStore args\nCall runtime print path",
      },
      {
        title: "Runtime",
        unit: "runtime",
        explain: "The Go runtime supports goroutines, stacks, and system calls around the compiled code.",
        artifact: () => "main goroutine -> fmt -> os.Stdout.Write",
      },
    ]),
  },
  {
    id: "assembly",
    name: "Assembly (Physical Register Juggler)",
    fileExt: "asm",
    code: makeCode(([a, b]) => `section .data\nline1 db "${a}", 10\nline2 db "${b}", 10\n\nsection .text\nglobal _start\n_start:\n    ; write line1\n    ; write line2\n    ; exit`),
    steps: withTail([
      {
        title: "Assembly source",
        unit: "source",
        explain: "Assembly is already close to the instruction set, but labels and directives still need assembling.",
        artifact: ({ item, language }) => language.code(item),
      },
      {
        title: "Assembler",
        unit: "parser",
        explain: "The assembler resolves labels and encodes instructions and data into object bytes.",
        artifact: () => "line1 -> address 0x401000\n_start -> machine opcode stream",
      },
      {
        title: "Object code",
        unit: "bytecode",
        explain: "The output is relocatable machine code plus metadata.",
        artifact: () => "sys_write opcode bytes + relocation entries",
      },
      {
        title: "Kernel syscall",
        unit: "runtime",
        explain: "The program asks the kernel to write the bytes to stdout.",
        artifact: () => "rax=1 rdi=1 rsi=&line rdx=len syscall",
      },
    ]),
  },
  {
    id: "bash",
    name: "Bash (Automated rm -rf Risk)",
    fileExt: "sh",
    code: makeCode(([a, b]) => `#!/usr/bin/env bash\nprintf '%s\\n' "${a}"\nprintf '%s\\n' "${b}"`),
    steps: withTail([
      {
        title: "Shell script",
        unit: "source",
        explain: "A shell script is interpreted command by command.",
        artifact: ({ item, language }) => language.code(item),
      },
      {
        title: "Tokenize command",
        unit: "parser",
        explain: "The shell parses words, quotes, variables, and command boundaries.",
        artifact: () => "COMMAND printf\nARG '%s\\n'\nARG line_1\nCOMMAND printf\nARG line_2",
      },
      {
        title: "Builtin or process",
        unit: "bytecode",
        explain: "printf may run as a shell builtin or external executable depending on the shell.",
        artifact: () => "resolve printf -> builtin -> prepare stdout bytes",
      },
      {
        title: "Write stream",
        unit: "runtime",
        explain: "The shell writes output bytes to the terminal or parent process stream.",
        artifact: () => "stdout.write(line_1 + newline + line_2 + newline)",
      },
    ]),
  },
];

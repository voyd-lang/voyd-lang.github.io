import type { Route } from "./+types/home";
import logo from "../../assets/logo.svg";
import CodeBlock from "../components/CodeBlock";

export const prerender = true;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Voyd Programming Language" },
    {
      name: "description",
      content:
        "Voyd is a high performance WebAssembly language for full stack web development.",
    },
  ];
}

export default function Home() {
  const fib = `fn fib(n: i32) -> i32
  if n < 2 then:
    n
  else:
    fib(n - 1) + fib(n - 2)`;

  return (
    <main className="flex flex-col items-center gap-8 py-24 px-4">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <img src={logo} alt="Voyd logo" className="w-40 h-40" />
        <div className="w-full max-w-sm">
          <CodeBlock code={fib} />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-center">Voyd</h1>
      <p className="max-w-xl text-lg text-center">
        A high performance WebAssembly programming language with a focus on full
        stack web development.
      </p>
      <div className="flex gap-4">
        <a
          href="/docs"
          className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
        >
          Read the Docs
        </a>
        <a
          href="https://github.com/voyd-lang/voyd"
          className="px-4 py-2 rounded-md border border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </main>
  );
}

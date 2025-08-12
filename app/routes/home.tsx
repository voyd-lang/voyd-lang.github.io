import type { Route } from "./+types/home";
import logo from "../../assets/logo.svg";

export const prerender = true;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Voyd Programming Language" },
    {
      name: "description",
      content: "Voyd is a high performance WebAssembly language for full stack web development.",
    },
  ];
}

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center text-center gap-6 py-24 px-4">
      <img src={logo} alt="Voyd logo" className="w-40 h-40 mx-auto" />
      <h1 className="text-4xl font-bold">Voyd</h1>
      <p className="max-w-xl text-lg">
        Voyd is a black hole themed, high performance WebAssembly language focused on full stack web development.
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

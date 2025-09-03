import type { Route } from "./+types/home";
import logo from "../../assets/logo.svg";
import VoydEditor from "~/components/VoydEditor";
import { getWasmFn, getWasmInstance } from "voyd";
import { compileBrowser } from "~/lib/compile-browser";
import { render } from "voyd/vsx-dom/client";
import { useRef, useState, type RefObject } from "react";

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
  const renderRef = useRef<HTMLDivElement>(null);
  const fib = `
use std::vsx::all

fn component()
  <div>
    Hello World!
  </div>


fn main(n: i32)
  msg_pack::encode(component())
`;

  const onPlay = async (code: string) => {
    const mod = await compileBrowser(code);
    const instance = getWasmInstance(mod);
    if (!renderRef.current) return;
    render(getWasmFn("main", instance) as unknown as any, renderRef.current, {
      instance,
    });
  };

  return (
    <main className="size-full">
      <div className="flex flex-col items-center gap-8 py-24 px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <img src={logo} alt="Voyd logo" className="aspect-square w-80" />
          <div className="w-full max-w-120 space-y-4">
            <h1 className="text-4xl font-bold text-center">voyd</h1>
            <p className="max-w-xl text-lg text-center">
              A high performance WebAssembly programming language with a focus
              on full stack web development.
            </p>
            <Links />
          </div>
        </div>
        <div className="w-full max-w-120">
          <VoydEditor
            value={fib}
            onPlay={(c) => {
              if (c) onPlay(c);
            }}
          />
          <div ref={renderRef} />
        </div>
      </div>
    </main>
  );
}

const Links = () => (
  <div className="w-full items-center justify-center flex gap-4">
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
);

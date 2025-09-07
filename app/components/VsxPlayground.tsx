import { useEffect, useRef, useState } from "react";
import VoydEditor from "./VoydEditor";
import { renderMsgPackNode } from "voyd/vsx-dom/client";

export const VsxPlayground = ({ value }: { value: string }) => {
  const renderRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const reqIdRef = useRef(0);
  const pendingRef = useRef(new Map<number, (payload: any) => void>());

  useEffect(() => {
    // Lazily create the worker on mount
    const worker = new Worker(
      new URL("../workers/compiler.worker.ts", import.meta.url),
      { type: "module" }
    );
    workerRef.current = worker;
    worker.onmessage = (ev: MessageEvent<any>) => {
      const { id, ok, tree, error } = ev.data || {};
      const resolve = pendingRef.current.get(id);
      if (!resolve) return;
      pendingRef.current.delete(id);
      resolve({ ok, tree, error });
    };
    return () => {
      worker.terminate();
      workerRef.current = null;
      pendingRef.current.clear();
    };
  }, []);

  const compileAndRunInWorker = (code: string) => {
    return new Promise<any>((resolve, reject) => {
      const worker = workerRef.current;
      if (!worker) {
        reject(new Error("Worker not initialized"));
        return;
      }
      const id = ++reqIdRef.current;
      pendingRef.current.set(id, (payload: any) => {
        if (payload.ok) resolve(payload.tree);
        else reject(new Error(payload.error || "Compile failed"));
      });
      worker.postMessage({ id, code });
    });
  };

  const onPlay = async (code: string) => {
    try {
      setIsCompiling(true);
      if (!renderRef.current) return;
      const tree = await compileAndRunInWorker(code);
      console.log(tree);

      renderMsgPackNode(tree, renderRef.current);
    } catch (err) {
      // TODO: Optional: surface compile errors in the UI
      console.error("Compile error:", err);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="size-full flex space-x-6">
      <div className="h-full w-1/2">
        <VoydEditor
          value={value}
          isLoading={isCompiling}
          onPlay={(c) => {
            if (c) onPlay(c);
          }}
        />
      </div>
      <div className="h-full border border-gray-500 rounded w-1/2 overflow-scroll">
        <div ref={renderRef}>
          <p className="p-8">Hit the play button in the editor to render</p>
        </div>
      </div>
    </div>
  );
};

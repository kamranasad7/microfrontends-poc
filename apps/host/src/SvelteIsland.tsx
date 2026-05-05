import { useEffect, useRef } from 'react';

interface SvelteRendererModule<P> {
  render: (target: HTMLElement, props: P) => () => void;
}

interface SvelteIslandProps<P extends Record<string, unknown>> {
  load: () => Promise<SvelteRendererModule<P>>;
  props: P;
}

export default function SvelteIsland<P extends Record<string, unknown>>({
  load,
  props,
}: SvelteIslandProps<P>) {
  const ref = useRef<HTMLDivElement>(null);
  const propsKey = JSON.stringify(props);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    let cleanup: (() => void) | null = null;
    let cancelled = false;

    load().then((mod) => {
      if (cancelled || !target) return;
      cleanup = mod.render(target, props);
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, propsKey]);

  return <div ref={ref} />;
}

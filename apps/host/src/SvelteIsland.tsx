import { useEffect, useRef } from 'react';

export interface SvelteRendererModule<P> {
  render: (target: HTMLElement, props: P) => () => void;
}

interface SvelteIslandProps<P> {
  loader: () => Promise<SvelteRendererModule<P>>;
  props: P;
}

export default function SvelteIsland<P>({ loader, props }: SvelteIslandProps<P>) {
  const ref = useRef<HTMLDivElement>(null);
  const propsKey = JSON.stringify(props);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    let cleanup: (() => void) | null = null;
    let cancelled = false;

    loader().then((mod) => {
      if (cancelled || !target) return;
      cleanup = mod.render(target, props);
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
    // propsKey covers the props object identity for the reactivity dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader, propsKey]);

  return <div ref={ref} />;
}

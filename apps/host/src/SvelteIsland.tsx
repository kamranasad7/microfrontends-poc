import { useEffect, useRef } from 'react';

type SvelteLoader = () => Promise<{
  render: (target: HTMLElement, props: never) => () => void;
}>;

type LoaderProps<L extends SvelteLoader> =
  Awaited<ReturnType<L>>['render'] extends (
    target: HTMLElement,
    props: infer P,
  ) => () => void
    ? P
    : never;

interface SvelteIslandProps<L extends SvelteLoader> {
  load: L;
  props: LoaderProps<L>;
}

export default function SvelteIsland<L extends SvelteLoader>({
  load,
  props,
}: SvelteIslandProps<L>) {
  const ref = useRef<HTMLDivElement>(null);
  const propsKey = JSON.stringify(props);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    let cleanup: (() => void) | null = null;
    let cancelled = false;

    load().then((mod) => {
      if (cancelled || !target) return;
      cleanup = mod.render(target, props as never);
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, propsKey]);

  return <div ref={ref} />;
}

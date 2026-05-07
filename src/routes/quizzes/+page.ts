// Federated remotes are CSR-only — they fetch from a different origin and
// expect browser globals.
export const ssr = false;

// Side-effect-only preload: SK runs `load()` on link hover, so awaiting the
// federated import here populates the browser's module cache. The actual
// `import('quizzes/App')` in +page.svelte then returns the cached promise
// instantly. We deliberately don't *return* the module — SK's data pipeline
// puts return values through `devalue`, which strips function values like
// `render`, breaking the render-fn contract.
export const load = async () => {
	await import('quizzes/App');
};

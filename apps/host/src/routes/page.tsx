export default function Home() {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ margin: 0 }}>JuiceMind Quizzes</h1>
      <p style={{ color: '#475569' }}>
        Pick a microfrontend from the sidebar. The header above is also a federated component
        (header MFE) — it stays mounted across navigation so its notification state survives
        route changes. Settings is a Svelte MFE federated into this React host via a small adapter.
      </p>
      <p style={{ color: '#475569' }}>
        This host runs on Modern.js (Rspack + SSR + file-based routing). The React MFEs are also
        Modern.js. Settings stays on Vite — MF 2.0's runtime is bundler-agnostic so they interop.
      </p>
    </div>
  );
}

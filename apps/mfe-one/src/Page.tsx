export interface PageProps {
  greeting?: string;
}

export default function Page({ greeting = 'Hello from' }: PageProps) {
  return (
    <section style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ margin: 0, color: '#2563eb' }}>{greeting} MFE One</h1>
      <p style={{ marginTop: 8, color: '#475569' }}>
        This component is exposed by <code>mfe-one</code> and federated into the host at runtime.
      </p>
    </section>
  );
}

// Federated remotes are CSR-only.
export const ssr = false;

// No load() — quizzes declares auth as a nested remote (for the JWT). Nested
// remotes break SK hover-preload. Click navigation still works.

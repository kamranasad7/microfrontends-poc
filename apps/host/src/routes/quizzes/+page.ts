// Federated remotes are CSR-only.
export const ssr = false;

export const load = async () => {
	await import('quizzes/App');
};

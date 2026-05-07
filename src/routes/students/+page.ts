export const ssr = false;

export const load = async () => {
	await import('students/App');
};

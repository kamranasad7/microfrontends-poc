// Stable function references for federated module loaders.
// Each route's <script> block runs per-instance, so defining loaders inline
// (e.g. `const load = () => import('quizzes/App')`) creates a NEW arrow
// every navigation — the Federated cache (keyed by function reference) misses
// every time. Importing from this module gives all callers the same reference.

export const loadHeader = () => import('header/App');
export const loadQuizzes = () => import('quizzes/App');
export const loadStudents = () => import('students/App');

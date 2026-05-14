import type { User } from './schemas';

// In-memory user "DB". Login synthesizes a user from any email/password (4+
// chars) — matches the existing Vue LoginScreen mock. Seeded entries take
// precedence so the default Kamran avatar/color stays stable.
const SEED: User[] = [
	{ name: 'Kamran', email: 'kamran@juicemind.app', avatarColor: '#7c3aed' }
];

function colorFromEmail(addr: string): string {
	let hash = 0;
	for (let i = 0; i < addr.length; i++) hash = (hash * 31 + addr.charCodeAt(i)) | 0;
	const hue = ((hash % 360) + 360) % 360;
	return `hsl(${hue} 70% 45%)`;
}

function nameFromEmail(addr: string): string {
	const local = addr.split('@')[0] ?? 'User';
	return local.charAt(0).toUpperCase() + local.slice(1);
}

export function findOrSynthesizeUser(email: string): User {
	const found = SEED.find((u) => u.email.toLowerCase() === email.toLowerCase());
	if (found) return found;
	return {
		name: nameFromEmail(email),
		email,
		avatarColor: colorFromEmail(email)
	};
}

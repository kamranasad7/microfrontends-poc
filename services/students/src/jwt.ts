import { jwtVerify, type JWTPayload } from 'jose';
import { jwtSecret } from '../../../tools/service-env';

const secret = new TextEncoder().encode(jwtSecret());

export async function verify(token: string): Promise<JWTPayload> {
	const { payload } = await jwtVerify(token, secret);
	return payload;
}

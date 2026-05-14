import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { jwtSecret } from '../../../tools/service-env';

const secret = new TextEncoder().encode(jwtSecret());

export async function sign(payload: Record<string, unknown>): Promise<string> {
	return await new SignJWT(payload as JWTPayload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('1h')
		.sign(secret);
}

export async function verify(token: string): Promise<JWTPayload> {
	const { payload } = await jwtVerify(token, secret);
	return payload;
}

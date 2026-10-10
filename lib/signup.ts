import { CONSENT_VERSION } from './signup-contract';

type Signup = { email: string; firstName?: string; lastName?: string; consent: true; consentVersion: string };
export function parseSignup(value: unknown): Signup | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  if (Object.keys(body).some(key => !['email', 'firstName', 'lastName', 'consent', 'consentVersion'].includes(key))) return null;
  if (body.consent !== true || body.consentVersion !== CONSENT_VERSION || typeof body.email !== 'string') return null;
  const email = body.email.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  for (const key of ['firstName', 'lastName']) {
    if (body[key] !== undefined && (typeof body[key] !== 'string' || (body[key] as string).trim().length > 100)) return null;
  }
  return { email, firstName: (body.firstName as string | undefined)?.trim() || undefined,
    lastName: (body.lastName as string | undefined)?.trim() || undefined,
    consent: true, consentVersion: CONSENT_VERSION };
}
export function signupConfig(env: NodeJS.ProcessEnv = process.env) {
  if (!env.CRM_URL || !env.CRM_AUTH || !env.CRM_WEBSITE_SIGNUP_TOKEN || env.CRM_WEBSITE_SIGNUP_TOKEN.length < 32 || /[\r\n]/.test(env.CRM_WEBSITE_SIGNUP_TOKEN) || !/^[^:\r\n]+:[^\r\n]+$/.test(env.CRM_AUTH)) return null;
  try {
    const url = new URL(env.CRM_URL);
    if (url.origin !== 'https://crm.companytheatre.ca' || url.username || url.password || url.search || url.hash || url.pathname !== '/') return null;
    return { baseUrl: url.origin, authorization: `Basic ${Buffer.from(env.CRM_AUTH).toString('base64')}`, token: env.CRM_WEBSITE_SIGNUP_TOKEN };
  } catch { return null; }
}
export async function handleSignup(request: Request, env: NodeJS.ProcessEnv = process.env, fetcher: typeof fetch = fetch) {
  const reply = (body: object, status: number) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
  const origin = request.headers.get('origin');
  const allowedOrigins = ['https://jackpottwins.ca', 'https://www.jackpottwins.ca'];
  if (env.NODE_ENV !== 'production') {
    const local = new URL(request.url);
    if (['127.0.0.1', 'localhost'].includes(local.hostname)) allowedOrigins.push(`http://127.0.0.1:${local.port}`, `http://localhost:${local.port}`);
  }
  if (!origin || !allowedOrigins.includes(origin)) return reply({ error: 'Invalid signup origin.' }, 403);
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return reply({ error: 'JSON required.' }, 415);
  if (!allowSignup()) return reply({ error: 'Too many signup requests. Please try again in a minute.' }, 429);
  const config = signupConfig(env);
  if (!config) return reply({ error: 'Signup is temporarily unavailable. Please try again later.' }, 503);
  let payload: Signup | null;
  try {
    // Bound streamed bytes as well as declared lengths; do not buffer arbitrary requests.
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: 'Please enter valid signup details.' }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    const deadline = Date.now() + 5000;
    while (true) {
      const { value, done } = await boundedRead(reader, deadline);
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); return reply({ error: 'Signup details are too large.' }, 413); }
      chunks.push(value);
    }
    payload = parseSignup(JSON.parse(Buffer.concat(chunks).toString('utf8')));
  } catch { return reply({ error: 'Please enter valid signup details.' }, 400); }
  if (!payload) return reply({ error: 'Please enter valid details and agree to receive updates.' }, 400);
  try {
    const res = await fetcher(`${config.baseUrl}/api/website-signups`, {
      method: 'POST', body: JSON.stringify({ ...payload, source: 'jackpottwins.ca' }),
      headers: { 'Content-Type': 'application/json', Authorization: config.authorization, 'X-Website-Signup-Token': config.token },
      cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error('Signup not confirmed');
    const body = await res.json();
    if (body?.recorded !== true || typeof body.subscribed !== 'boolean') throw new Error('Invalid confirmation');
    if (!body.subscribed) return reply({ recorded: true, subscribed: false,
      message: 'Your request was recorded, but this address needs a subscription review. It has not been added to the mailing list.' }, 202);
    return reply({ recorded: true, subscribed: true, message: "You're on the list!" }, 200);
  } catch {
    // Never log CRM response bodies, entrant details or authentication values.
    return reply({ error: 'Unable to confirm signup. Please try again.' }, 502);
  }
}

// Bounded single-process burst protection. No visitor IP/PII retained and no trust
// in spoofable forwarded headers. Configure an edge limit for multi-replica hosting.
let windowStart = 0;
let attempts = 0;
function allowSignup() {
  const now = Date.now();
  if (now - windowStart >= 60000) { windowStart = now; attempts = 0; }
  return ++attempts <= 60;
}

async function boundedRead(reader: ReadableStreamDefaultReader<Uint8Array>, deadline: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([reader.read(), new Promise<never>((_, reject) => {
      timer = setTimeout(() => { void reader.cancel(); reject(new Error('Body timeout')); }, Math.max(1, deadline - Date.now()));
    })]);
  } finally { clearTimeout(timer); }
}

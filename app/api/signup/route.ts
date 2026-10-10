import { handleSignup } from '@/lib/signup';
export const runtime = 'nodejs';
export async function POST(request: Request) { return handleSignup(request); }

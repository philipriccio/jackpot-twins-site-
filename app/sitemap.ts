import type { MetadataRoute } from 'next';
export const dynamic='force-dynamic';
export default function sitemap(): MetadataRoute.Sitemap { const paths=['','/privacy']; if(process.env.SCRATCH_ENABLED==='1'&&process.env.SCRATCH_PREVIEW_ONLY!=='1')paths.push('/scratch'); return paths.map(path=>({url:`https://jackpottwins.ca${path}`})); }

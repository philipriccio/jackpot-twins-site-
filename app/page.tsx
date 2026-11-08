import Home from "./home";

// Runtime-only public-mode switch; never publish owner-only preview through the homepage.
export const dynamic = 'force-dynamic';
export default function Page() {
  return <Home scratchMode={process.env.SCRATCH_ENABLED === '1' && process.env.SCRATCH_PREVIEW_ONLY !== '1'} />;
}

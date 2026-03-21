import Image from "next/image";
import Link from "next/link";

const cast = [
  {
    actor: "Seana McKenna",
    role: "Geraldine (Gerry) Fitzgerald",
    image: "/images/headshots/seana-mckenna.jpeg",
  },
  {
    actor: "Nora McLellan",
    role: "Bernadette (Bernie) Fitzgerald",
    image: "/images/headshots/nora-mclellan.jpeg",
  },
  {
    actor: "Tony Nappo",
    role: "Peter Mallory",
    image: "/images/headshots/tony-nappo.jpg",
  },
  {
    actor: "Colin A. Doyle",
    role: "Harold Bates",
    image: "/images/headshots/colin-doyle.jpg",
  },
  {
    actor: "Caroline Toal",
    role: "Abigail",
    image: "/images/headshots/caroline-toal.jpg",
  },
];

const details = [
  { label: "Previews Begin", value: "March 9, 2027" },
  { label: "Press Opening", value: "March 14, 2027 · Sunday at 2 PM" },
  { label: "Venue", value: "CAA Theatre · 651 Yonge Street, Toronto" },
  { label: "Co-Producers", value: "The Company Theatre + Mirvish Productions" },
];

const creativeTeam = [
  { role: "Written & Directed by", person: "Philip Riccio" },
  { role: "Set Design", person: "Anahita Dehbonehie" },
  { role: "Lighting Design", person: "Kevin Lamotte" },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#0a0a0a] text-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate min-h-screen overflow-hidden">

        {/* Full-bleed background photo */}
        <div className="absolute inset-0">
          <Image
            src="/images/poster-web-1800x1200.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Layered overlays: vignette + bottom blackout for content legibility */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0a0a0a]/70 to-transparent" />
        </div>

        <div className="relative flex min-h-screen flex-col">
          {/* Nav bar */}
          <header className="flex items-center justify-between px-6 py-6 md:px-10 lg:px-12">
            <Link
              href="https://companytheatre.ca"
              target="_blank"
              rel="noreferrer"
              className="font-[var(--font-condensed)] text-xl uppercase tracking-[0.24em] text-white/70 transition hover:text-[#D4A017]"
            >
              The Company Theatre
            </Link>
            <Link
              href="https://mirvish.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[#D4A017]/50 bg-black/40 px-6 py-2.5 font-[var(--font-condensed)] text-lg uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:border-[#D4A017] hover:text-[#D4A017]"
            >
              Get Tickets
            </Link>
          </header>

          {/* Hero content — bottom-anchored */}
          <div className="mt-auto px-6 pb-16 md:px-10 lg:px-12">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">

                {/* Left: marquee logo + credits + CTA */}
                <div className="max-w-2xl">
                  <p className="mb-5 font-[var(--font-condensed)] text-lg uppercase tracking-[0.32em] text-[#D4A017]">
                    World Premiere · Toronto · March 2027
                  </p>

                  {/* Marquee logo image */}
                  <div className="w-[min(540px,90vw)]">
                    <Image
                      src="/images/jt-logo-marquee.png"
                      alt="Jackpot Twins"
                      width={1080}
                      height={590}
                      priority
                      className="w-full drop-shadow-[0_4px_32px_rgba(212,160,23,0.35)]"
                    />
                  </div>

                  <p className="mt-5 font-[var(--font-condensed)] text-xl uppercase tracking-[0.18em] text-white/70">
                    A New Comedy by Philip Riccio
                  </p>
                  <p className="mt-3 max-w-lg font-[var(--font-serif)] text-2xl italic leading-9 text-white/85">
                    Winning the lottery is easy. Surviving it is the hard part.
                  </p>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link
                      href="https://mirvish.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[#D4A017] px-8 py-4 font-[var(--font-condensed)] text-xl uppercase tracking-[0.16em] text-black transition hover:bg-[#e7b73a]"
                    >
                      Get Tickets at Mirvish
                    </Link>
                    <Link
                      href="#about"
                      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/30 px-8 py-4 font-[var(--font-condensed)] text-xl uppercase tracking-[0.16em] text-white backdrop-blur-sm transition hover:border-[#D4A017]/60 hover:text-[#D4A017]"
                    >
                      Discover the Show
                    </Link>
                  </div>
                </div>

                {/* Right: portrait poster card */}
                <div className="hidden shrink-0 lg:block">
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-[#D4A017]/25 bg-[#120f0a] p-2.5 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
                    <div className="relative aspect-[5/8] w-[220px] overflow-hidden rounded-[1.1rem] xl:w-[260px]">
                      <Image
                        src="/images/poster-5x8-web.jpg"
                        alt="Jackpot Twins poster"
                        fill
                        sizes="260px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ───────────────────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-[#070707] px-6 py-20 md:px-10 lg:px-12 lg:py-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <p className="font-[var(--font-serif)] text-3xl italic leading-tight text-white/90 md:text-5xl md:leading-tight">
            <span className="text-[#D4A017] not-italic">&ldquo;</span>The odds were 1 in 1.226 quintillion.<br className="hidden md:block" /> The Fitzgerald sisters just beat them.<span className="text-[#D4A017] not-italic">&rdquo;</span>
          </p>
          <div className="mt-10 h-px w-32 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent" />
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      <section id="about" className="px-6 py-20 md:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="font-[var(--font-condensed)] text-2xl uppercase tracking-[0.18em] text-[#D4A017]">About</p>
            <div className="mt-6 h-px w-24 bg-[#D4A017]" />
          </div>
          <div className="space-y-6 text-lg leading-9 text-white/78 md:text-xl md:leading-10">
            <p>
              Imagine winning the lottery. Now imagine doing it again. And again. For the Fitzgeralds, a third grand prize isn&apos;t a miracle—it&apos;s a cosmic catastrophe. Suddenly, their quiet bungalow is a magnet for opportunistic lovers, estranged daughters, and a relentless lottery investigator who suspects their &ldquo;luck&rdquo; is a crime.
            </p>
            <p>
              Between dodging the local press and punching the clock at the snack factory, the sisters must survive the absurdity of their own impossible fortune. As the oversized cheques pile up, they realize that beating the odds was the easy part. The real adventure is figuring out who you are when you finally have nothing left to wish for.
            </p>
            <p>
              Canadian theatre legends Seana McKenna and Nora McLellan lead an all-star cast in <em>Jackpot Twins</em>, a sharp-witted, irreverent new comedy by Philip Riccio about the heavy price of getting everything you ever wanted. Hilarious, high-stakes, and surprisingly heartfelt, it&apos;s a celebration of family, fortune, and the joy of a life lived in the win column.
            </p>
          </div>
        </div>
      </section>

      {/* ── CAST ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-[#080808] px-6 py-20 md:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-[var(--font-condensed)] text-2xl uppercase tracking-[0.18em] text-[#D4A017]">The Company</p>
              <h2 className="mt-2 font-[var(--font-serif)] text-4xl text-white md:text-6xl">Five players. One impossible jackpot.</h2>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
            {cast.map((member) => (
              <article
                key={member.actor}
                className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.02] transition duration-300 hover:border-[#D4A017]/70 hover:shadow-[0_18px_50px_rgba(212,160,23,0.12)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <Image
                    src={member.image}
                    alt={member.actor}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 20vw"
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 border border-transparent transition duration-300 group-hover:border-[#D4A017]/70" />
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="font-[var(--font-serif)] text-2xl text-white">{member.actor}</h3>
                  <p className="font-[var(--font-condensed)] text-lg uppercase tracking-[0.12em] text-[#D4A017]">{member.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTION DETAILS ───────────────────────────────────────────── */}
      <section className="px-6 py-20 md:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="font-[var(--font-condensed)] text-2xl uppercase tracking-[0.18em] text-[#D4A017]">Production Details</p>
            <h2 className="mt-3 font-[var(--font-serif)] text-4xl text-white md:text-6xl">A new comedy with marquee heat.</h2>
            <div className="mt-8 grid gap-4">
              {details.map((detail) => (
                <div key={detail.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="font-[var(--font-condensed)] text-lg uppercase tracking-[0.18em] text-white/45">{detail.label}</p>
                  <p className="mt-2 text-xl leading-8 text-white">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#D4A017]/20 bg-[linear-gradient(180deg,rgba(212,160,23,0.08),rgba(255,255,255,0.02))] p-8 sm:p-10">
            <p className="font-[var(--font-condensed)] text-2xl uppercase tracking-[0.18em] text-[#D4A017]">Presented In Association With</p>
            <div className="mt-8 flex items-center justify-start rounded-[1.5rem] border border-white/10 bg-black/35 p-6">
              <p className="font-[var(--font-condensed)] text-3xl uppercase tracking-[0.15em] text-white">Mirvish Productions</p>
            </div>
            <p className="mt-8 text-lg leading-8 text-white/70">
              Previews begin March 9, 2027 at the CAA Theatre. Press opening is March 14, 2027, with performances scheduled through March 28 and a possible extension to April 4.
            </p>
            <Link
              href="https://mirvish.com"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#D4A017] px-8 py-4 font-[var(--font-condensed)] text-xl uppercase tracking-[0.16em] text-black transition hover:bg-[#e7b73a]"
            >
              Get Tickets at Mirvish
            </Link>
          </div>
        </div>
      </section>

      {/* ── CREATIVE TEAM ────────────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#080808] px-6 py-20 md:px-10 lg:px-12 lg:py-24">
        <div className="mx-auto w-full max-w-6xl">
          <p className="font-[var(--font-condensed)] text-2xl uppercase tracking-[0.18em] text-[#D4A017]">Creative Team</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {creativeTeam.map((credit) => (
              <div key={credit.role} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="font-[var(--font-condensed)] text-lg uppercase tracking-[0.16em] text-white/45">{credit.role}</p>
                <p className="mt-3 font-[var(--font-serif)] text-3xl text-white">{credit.person}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 px-6 py-10 md:px-10 lg:px-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-sm uppercase tracking-[0.18em] text-white/55">
            A Company Theatre production in association with Mirvish Productions
          </p>
          <Link href="https://companytheatre.ca" target="_blank" rel="noreferrer" className="text-sm uppercase tracking-[0.18em] text-white/55 transition hover:text-[#D4A017]">
            companytheatre.ca
          </Link>
          <p className="text-sm uppercase tracking-[0.18em] text-white/55">© 2026 The Company Theatre</p>
        </div>
      </footer>

    </main>
  );
}

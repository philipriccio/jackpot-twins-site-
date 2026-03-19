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
      <section className="relative isolate flex min-h-screen items-center overflow-hidden border-b border-white/10 px-6 py-8 md:px-10 lg:px-12">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,160,23,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(230,51,41,0.12),transparent_18%),linear-gradient(180deg,#090909_0%,#0a0a0a_45%,#050505_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,transparent_18%,transparent_82%,rgba(255,255,255,0.03)_100%)] [background-size:180px_180px] mix-blend-screen" />
          <div className="noise-mask absolute inset-0 opacity-40" />
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="https://companytheatre.ca"
              target="_blank"
              rel="noreferrer"
              className="font-[var(--font-condensed)] text-xl uppercase tracking-[0.24em] text-white/75 transition hover:text-[#D4A017]"
            >
              The Company Theatre
            </Link>
            <Link
              href="https://mirvish.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[#D4A017]/40 bg-black/30 px-6 py-3 font-[var(--font-condensed)] text-lg uppercase tracking-[0.18em] text-white transition hover:border-[#D4A017] hover:text-[#D4A017]"
            >
              Mirvish Tickets
            </Link>
          </header>

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="order-2 max-w-3xl lg:order-1">
              <p className="mb-4 font-[var(--font-condensed)] text-lg uppercase tracking-[0.32em] text-[#D4A017]">
                World Premiere · Toronto · March 2027
              </p>
              <h1 className="font-[var(--font-condensed)] text-[clamp(5rem,18vw,11rem)] uppercase leading-[0.84] tracking-[0.05em] text-white">
                JACKPOT
                <span className="block text-[#D4A017]">TWINS</span>
              </h1>
              <p className="mt-6 max-w-2xl font-[var(--font-serif)] text-2xl italic leading-10 text-white/86 md:text-3xl md:leading-[3rem]">
                Winning the lottery is easy. Surviving it is the hard part.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 font-[var(--font-condensed)] text-xl uppercase tracking-[0.16em] text-white transition hover:border-[#D4A017]/60 hover:text-[#D4A017]"
                >
                  Discover the Show
                </Link>
              </div>
            </div>

            <div className="order-1 mx-auto w-full max-w-[360px] lg:order-2 lg:max-w-[440px] xl:max-w-[500px]">
              <div className="poster-frame relative overflow-hidden rounded-[2rem] border border-[#D4A017]/20 bg-[#120f0a] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.65)] sm:p-4">
                <div className="relative aspect-[5/8] overflow-hidden rounded-[1.35rem] border border-white/10 bg-black">
                  <Image
                    src="/images/poster-5x8-web.jpg"
                    alt="Jackpot Twins portrait poster"
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#070707] px-6 py-20 md:px-10 lg:px-12 lg:py-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          <p className="font-[var(--font-serif)] text-4xl leading-tight text-white md:text-6xl md:leading-tight">
            <span className="text-[#D4A017]">“</span>The odds were 1 in 1.226 quintillion. The Fitzgerald sisters just beat them.<span className="text-[#D4A017]">”</span>
          </p>
          <div className="mt-8 h-px w-40 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent" />
        </div>
      </section>

      <section id="about" className="px-6 py-20 md:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="font-[var(--font-condensed)] text-2xl uppercase tracking-[0.18em] text-[#D4A017]">About</p>
            <div className="mt-6 h-px w-24 bg-[#D4A017]" />
          </div>
          <div className="space-y-6 text-lg leading-9 text-white/78 md:text-xl md:leading-10">
            <p>
              Imagine winning the lottery. Now imagine doing it again. And again. For the Fitzgeralds, a third grand prize isn&apos;t a miracle—it&apos;s a cosmic catastrophe. Suddenly, their quiet bungalow is a magnet for opportunistic lovers, estranged daughters, and a relentless lottery investigator who suspects their “luck” is a crime.
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

      <section className="border-y border-white/10 bg-[#080808] px-6 py-20 md:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-[var(--font-condensed)] text-2xl uppercase tracking-[0.18em] text-[#D4A017]">The Company</p>
              <h2 className="mt-2 font-[var(--font-serif)] text-4xl text-white md:text-6xl">Five players. One impossible jackpot.</h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-white/60 md:text-right">
              Editorial portraiture keeps the focus on the performers at the heart of the chaos, with a subtle marquee glow at the edges.
            </p>
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
                    className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
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
              <Image
                src="/logos/mirvish-logo-red.svg"
                alt="Mirvish Productions"
                width={240}
                height={72}
                className="h-auto w-[180px] sm:w-[220px]"
              />
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

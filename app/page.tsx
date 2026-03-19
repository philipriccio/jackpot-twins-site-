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
  { label: "Press Opening", value: "March 14, 2027 · Sunday 2 PM" },
  { label: "Venue", value: "CAA Theatre · 651 Yonge St, Toronto" },
  { label: "Closing", value: "March 28, 2027 · possible extension to April 4" },
];

const creativeTeam = [
  { role: "Written & Directed by", person: "Philip Riccio" },
  { role: "Set Design", person: "Anahita Dehbonehie" },
  { role: "Lighting Design", person: "Kevin Lamotte" },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="relative min-h-screen border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src="/images/poster-web-1800x1200.jpg"
            alt="Jackpot Twins poster"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,3,3,0.3)_0%,rgba(5,3,3,0.55)_30%,rgba(5,3,3,0.9)_70%,#050303_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(241,199,107,0.25),transparent_28%),radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.08),transparent_18%)]" />
        </div>

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-6 py-8 md:px-10 lg:px-12">
          <header className="flex items-center justify-between gap-4">
            <Link href="https://companytheatre.ca" target="_blank" rel="noreferrer" className="text-xs uppercase tracking-[0.35em] text-[#f7f0dd]/70 transition hover:text-[#f1c76b]">
              The Company Theatre
            </Link>
            <Link href="https://mirvish.com" target="_blank" rel="noreferrer" className="rounded-full border border-[#f1c76b]/40 bg-black/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#f7f0dd] backdrop-blur transition hover:border-[#f1c76b] hover:text-[#f1c76b]">
              Get Tickets
            </Link>
          </header>

          <div className="grid items-end gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
            <div className="max-w-3xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-[#f1c76b]">
                World Premiere · Toronto · March 2027
              </p>
              <h1 className="font-[var(--font-display)] text-[clamp(5rem,18vw,12rem)] uppercase leading-[0.82] tracking-[0.02em] text-[#fff6dc] drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
                Jackpot
                <span className="block text-[#f1c76b]">Twins</span>
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-8 text-[#f7f0dd]/85 md:text-3xl md:leading-11">
                Winning the lottery is easy. Surviving it is the hard part.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="https://mirvish.com" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-[#f1c76b] px-7 py-4 text-sm font-bold uppercase tracking-[0.24em] text-[#1a1007] transition hover:bg-[#fff1c4]">
                  Get Tickets
                </Link>
                <Link href="#about" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/30 px-7 py-4 text-sm font-bold uppercase tracking-[0.24em] text-[#f7f0dd] backdrop-blur transition hover:border-[#f1c76b]/60 hover:text-[#f1c76b]">
                  Explore the Show
                </Link>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md lg:max-w-lg">
              <div className="relative aspect-[5/8] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <Image
                  src="/images/poster-5x8-web.jpg"
                  alt="Jackpot Twins portrait poster"
                  fill
                  sizes="(max-width: 1024px) 80vw, 35vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#f1c76b]">About</p>
            <blockquote className="border-l-4 border-[#f1c76b] pl-6 text-3xl leading-tight text-[#fff6dc] md:text-5xl">
              “The odds were 1 in 1.226 quintillion. The Fitzgerald sisters just beat them.”
            </blockquote>
          </div>
          <div className="space-y-6 text-lg leading-8 text-[#f7f0dd]/78">
            <p>
              Imagine winning the lottery. Now imagine doing it again. And again. For the Fitzgeralds, a third grand prize isn&apos;t a miracle—it&apos;s a cosmic catastrophe. Suddenly, their quiet bungalow is a magnet for opportunistic lovers, estranged daughters, and a relentless lottery investigator who suspects their “luck” is a crime.
            </p>
            <p>
              Between dodging the local press and punching the clock at the snack factory, the sisters must survive the absurdity of their own impossible fortune. As the oversized cheques pile up, they realize that beating the odds was the easy part. The real adventure is figuring out who you are when you finally have nothing left to wish for.
            </p>
            <p>
              Canadian theatre legends Seana McKenna and Nora McLellan lead an all-star cast in <em>Jackpot Twins</em>, a sharp-witted, irreverent new comedy by Philip Riccio about the heavy price of getting everything you ever wanted. Hilarious, high-stakes, and surprisingly heartfelt, it&apos;s a celebration of family, fortune, and the joy of a life lived in the “win” column.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[rgba(255,248,227,0.03)] px-6 py-20 md:px-10 lg:px-12 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10">
            <Image
              src="/images/production-photo-twins.jpg"
              alt="Stylized production photo of the Fitzgerald sisters"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090504] via-transparent to-transparent" />
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#f1c76b]">Production Details</p>
            <h2 className="font-[var(--font-display)] text-5xl uppercase leading-none tracking-[0.03em] text-[#fff6dc] md:text-7xl">
              Catch the winning streak.
            </h2>
            <div className="mt-8 grid gap-4">
              {details.map((detail) => (
                <div key={detail.label} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#f7f0dd]/45">{detail.label}</p>
                  <p className="mt-2 text-xl text-[#fff6dc]">{detail.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-base leading-8 text-[#f7f0dd]/72">
              A Company Theatre production in association with Mirvish Productions. Rehearsals begin February 8, 2027.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10 lg:px-12 lg:py-28">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#f1c76b]">Cast</p>
            <h2 className="font-[var(--font-display)] text-5xl uppercase leading-none tracking-[0.03em] text-[#fff6dc] md:text-7xl">
              The company.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-[#f7f0dd]/65 md:text-right">
            Five performers. One impossible run of luck. Editorial portraits keep the focus on the people at the centre of the chaos.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {cast.map((member) => (
            <article key={member.actor} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/25 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.actor}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 20vw"
                  className="object-cover object-center transition duration-500 hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-5">
                <h3 className="font-[var(--font-display)] text-3xl uppercase tracking-[0.04em] text-[#fff6dc]">
                  {member.actor}
                </h3>
                <p className="text-sm uppercase tracking-[0.24em] text-[#f1c76b]">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[rgba(255,248,227,0.03)] px-6 py-20 md:px-10 lg:px-12">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#f1c76b]">Creative Team</p>
            <h2 className="font-[var(--font-display)] text-5xl uppercase leading-none tracking-[0.03em] text-[#fff6dc] md:text-7xl">
              Built for the stage.
            </h2>
          </div>
          <div className="space-y-4">
            {creativeTeam.map((credit) => (
              <div key={credit.role} className="flex flex-col gap-2 rounded-[1.5rem] border border-white/10 bg-black/25 p-5 md:flex-row md:items-center md:justify-between">
                <p className="text-xs uppercase tracking-[0.28em] text-[#f7f0dd]/45">{credit.role}</p>
                <p className="text-2xl text-[#fff6dc]">{credit.person}</p>
              </div>
            ))}
            <div className="rounded-[1.75rem] border border-[#f1c76b]/30 bg-[#f1c76b]/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f1c76b]">Tickets</p>
              <p className="mt-3 max-w-xl text-lg leading-8 text-[#f7f0dd]/82">
                Tickets available through Mirvish Productions.
              </p>
              <Link href="https://mirvish.com" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center justify-center rounded-full bg-[#f1c76b] px-6 py-3 text-sm font-bold uppercase tracking-[0.24em] text-[#1a1007] transition hover:bg-[#fff1c4]">
                Get Tickets
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 text-center text-sm uppercase tracking-[0.2em] text-[#f7f0dd]/50 md:px-10 lg:px-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>A Company Theatre production in association with Mirvish Productions</p>
          <p>© 2026 The Company Theatre</p>
          <Link href="https://companytheatre.ca" target="_blank" rel="noreferrer" className="transition hover:text-[#f1c76b]">
            companytheatre.ca
          </Link>
        </div>
      </footer>
    </main>
  );
}

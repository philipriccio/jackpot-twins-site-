"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const cast = [
  {
    actor: "Seana McKenna",
    role: "Geraldine (Gerry) Fitzgerald",
    image: "/images/headshots/seana-mckenna.jpeg",
    bio: "Seana McKenna is a recipient of the Order of Canada — do we need to say more? No. But we will anyway. A National Theatre School graduate, she has spent four decades setting the standard at Stratford, Shaw, Canadian Stage, and stages across North America, playing everything from Juliet to Julius Caesar along the way. She made history as Stratford's first female Richard III. Three Dora Awards, a Genie, a Jessie, and an Honorary Doctorate later — if you saw her in Things I Know to Be True and needed a few days to recover, good news: this one's a comedy.",
  },
  {
    actor: "Nora McLellan",
    role: "Bernadette (Bernie) Fitzgerald",
    image: "/images/headshots/nora-mclellan.jpeg",
    bio: "Nora McLellan has been one of Canadian theatre's great pleasures for over fifty years, and she shows absolutely no signs of stopping. She spent 22 seasons at the Shaw Festival and four at Stratford, trained with the legendary Uta Hagen in New York, and has four Jessie Awards and two Doras to her name. Toronto audiences know her from John at The Company Theatre — for which she won the Dora for Outstanding Performance — and as Sister Rose in CBC's Son of a Critch, a role written especially for her. She is, in every sense, a force of nature.",
  },
  {
    actor: "Tony Nappo",
    role: "Peter Mallory",
    image: "/images/headshots/tony-nappo.jpg",
    bio: "Tony Nappo has appeared in roughly 70 films, hundreds of TV episodes, and more Toronto stages than most people have visited. Born in Scarborough, trained at the American Academy of Dramatic Arts in Manhattan, he's the kind of actor critics describe as 'razor-sharp' and 'effortlessly magnetic.' He's appeared alongside Al Pacino, played a recurring villain in Bad Blood, voiced a gangster in Fugget About It, and wrote the beloved column Nappoholics Anonymous for Intermission Magazine. If you've watched Canadian TV in the last twenty years, you've seen him.",
  },
  {
    actor: "Colin A. Doyle",
    role: "Harold Bates",
    image: "/images/headshots/colin-doyle.jpg",
    bio: "Colin A. Doyle is a Toronto-based actor and theatre producer who has performed across Canada, the US, and Europe. A York University Acting Conservatory graduate, he has worked with some of the most inventive companies in the country — Outside the March, Factory Theatre, Theatre Passe Muraille, Why Not Theatre — and has played everything from Peter Pan to a post-apocalyptic Homer Simpson. The range is real.",
  },
  {
    actor: "Caroline Toal",
    role: "Abigail",
    image: "/images/headshots/caroline-toal.jpg",
    bio: "Caroline Toal is a two-time Dora Award winner, a Stratford Festival Mary Savidge Award recipient, and the person most recently responsible for making half of Ontario cry about Anne Shirley. She grew up in Orangeville, trained at George Brown Theatre School, and has originated roles in new Canadian plays at Young People's Theatre, The Howland Company, and the Stratford Festival. Her credits include Casimir and Caroline, Selfie, To Kill a Mockingbird, and Anne of Green Gables — which received an extension because the audiences refused to let it close. Some performers make you want to stay. She is one of them.",
  },
] as const;

const creativeTeam = [
  { role: "Written & Directed by", person: "Philip Riccio" },
  { role: "Set Design", person: "Anahita Dehbonehie" },
  { role: "Lighting Design", person: "Kevin Lamotte" },
] as const;

const tickerItems = [
  "JACKPOT TWINS",
  "WORLD PREMIERE",
  "CAA THEATRE · TORONTO",
  "SPRING 2027",
  "THE COMPANY THEATRE + MIRVISH PRODUCTIONS",
  "SEANA McKENNA · NORA McLELLAN",
] as const;

function CastBioModal({
  member,
  onClose,
}: {
  member: (typeof cast)[number] | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!member) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [member, onClose]);

  if (!member) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cast-bio-title"
    >
      <div
        className="relative w-full max-w-3xl border-[4px] border-[var(--black)] bg-[var(--cream)] p-5 shadow-[10px_10px_0_var(--yellow)] md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="jt-display absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center border-[3px] border-[var(--black)] bg-[var(--yellow)] text-2xl leading-none text-[var(--black)] transition hover:bg-[var(--pink)] hover:text-white"
          aria-label={`Close ${member.actor} bio`}
        >
          ×
        </button>

        <div className="grid gap-6 md:grid-cols-[180px_1fr] md:items-start">
          <div className="relative aspect-[4/5] overflow-hidden border-[3px] border-[var(--black)] bg-black">
            <Image src={member.image} alt={member.actor} fill sizes="180px" className="object-cover object-top" />
          </div>

          <div>
            <p className="jt-display text-sm uppercase tracking-[0.3em] text-[var(--pink)]">Cast Bio</p>
            <h3 id="cast-bio-title" className="jt-display mt-3 text-5xl leading-[0.9] text-[var(--black)] md:text-6xl">
              {member.actor}
            </h3>
            <p className="jt-subheading mt-3 text-sm uppercase tracking-[0.14em] text-black/60 md:text-base">
              {member.role}
            </p>
            <p className="jt-body mt-6 text-base leading-8 text-black/75 md:text-lg">{member.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedCastMember, setSelectedCastMember] = useState<(typeof cast)[number] | null>(null);

  return (
    <>
      <main className="jt-shell min-h-screen overflow-x-hidden">
        <section className="overflow-hidden border-b-[4px] border-[var(--black)] bg-[var(--yellow)] py-3">
          <div className="jt-ticker-track flex items-center">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center">
                <span className="jt-display px-8 text-base tracking-[0.16em] text-[var(--black)] md:text-lg">
                  {item}
                </span>
                <span className="jt-display text-xl text-[var(--red)]">★</span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b-[4px] border-[var(--black)] bg-[var(--black)]">
          <div className="grid items-stretch lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="border-b-[4px] border-[var(--black)] bg-[var(--black)] p-5 sm:p-8 lg:border-b-0 lg:border-r-[4px]">
              <div className="relative mx-auto aspect-[5/8] w-full max-w-[540px] overflow-hidden border-[4px] border-[var(--black)] bg-black shadow-[10px_10px_0_var(--yellow)]">
                <Image
                  src="/images/poster-5x8-web.jpg"
                  alt="Jackpot Twins official poster"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="bg-[var(--cream)] px-6 py-10 text-center md:px-10 md:py-14 lg:px-12">
              <p className="jt-display inline-flex items-center gap-3 text-xs tracking-[0.3em] text-[var(--pink)] md:text-sm">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--red)]"
                  style={{ animation: "jt-blink 1.6s ease-in-out infinite" }}
                />
                World Premiere · Toronto · Spring 2027
              </p>

              <div className="mt-6 inline-flex flex-col items-center leading-[0.84] text-[var(--black)]">
                <span className="jt-display text-[clamp(5rem,14vw,10rem)] tracking-[0.04em]">Jackpot</span>
                <span className="jt-display -mt-2 text-[clamp(5rem,14vw,10rem)] tracking-[0.04em] text-[var(--red)]">Twins</span>
              </div>

              <p className="jt-subheading mt-4 text-sm font-medium uppercase tracking-[0.22em] text-black/55 md:text-[15px]">
                A New Comedy by Philip Riccio
              </p>

              <div className="mx-auto mt-8 max-w-[560px] border-[4px] border-[var(--black)] bg-[var(--black)] px-6 py-5 text-left">
                <span className="jt-subheading block text-lg font-semibold uppercase tracking-[0.07em] text-[var(--cream)] md:text-[22px]">
                  Winning the lottery is easy.
                </span>
                <span className="jt-subheading block text-lg font-semibold uppercase tracking-[0.07em] text-[var(--yellow)] md:text-[22px]">
                  Surviving it is the hard part.
                </span>
              </div>

              <div className="mx-auto mt-8 grid max-w-[440px] gap-3">
                <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
                  <span className="jt-display min-w-[120px] bg-[var(--pink)] px-3 py-1 text-[11px] tracking-[0.22em] text-white">
                    Previews
                  </span>
                  <span className="jt-subheading text-sm uppercase tracking-[0.08em] text-[var(--black)] md:text-base">
                    From March 9, 2027
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
                  <span className="jt-display min-w-[120px] bg-[var(--pink)] px-3 py-1 text-[11px] tracking-[0.22em] text-white">
                    Opening Night
                  </span>
                  <span className="jt-subheading text-sm uppercase tracking-[0.08em] text-[var(--black)] md:text-base">
                    March 14, 2027 · 2 PM
                  </span>
                </div>
              </div>

              <p className="jt-subheading mt-8 text-xs uppercase tracking-[0.16em] text-black/45 md:text-sm">
                CAA Theatre · 651 Yonge Street, Toronto
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="https://mirvish.com"
                  target="_blank"
                  rel="noreferrer"
                  className="jt-display jt-shadow-button inline-flex items-center justify-center border-[3px] border-[var(--black)] bg-[var(--red)] px-8 py-4 text-xl tracking-[0.14em] text-white"
                >
                  Get Tickets at Mirvish
                </Link>
                <Link
                  href="#about"
                  className="jt-display jt-shadow-button inline-flex items-center justify-center border-[3px] border-[var(--black)] bg-[var(--yellow)] px-8 py-4 text-xl tracking-[0.14em] text-[var(--black)]"
                >
                  About the Play
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-center gap-4 border-t-[4px] border-[var(--yellow)] bg-[var(--black)] px-6 py-5 text-center md:gap-5">
          <span className="jt-display text-xs tracking-[0.28em] text-white/40 md:text-sm">A production by</span>
          <span className="hidden h-5 w-px bg-white/20 md:block" />
          <Link
            href="https://companytheatre.ca"
            target="_blank"
            rel="noreferrer"
            className="jt-subheading text-sm font-medium uppercase tracking-[0.1em] text-white transition hover:text-[var(--yellow)] md:text-lg"
          >
            The Company Theatre
          </Link>
          <span className="hidden h-5 w-px bg-white/20 md:block" />
          <Link
            href="https://mirvish.com"
            target="_blank"
            rel="noreferrer"
            className="jt-subheading text-sm font-medium uppercase tracking-[0.1em] text-white transition hover:text-[var(--yellow)] md:text-lg"
          >
            Mirvish Productions
          </Link>
        </section>

        <section className="jt-quote-dots relative overflow-hidden border-y-[4px] border-[var(--black)] bg-[var(--pink)] px-6 py-14 text-center md:px-10 md:py-16">
          <div className="relative z-10 mx-auto max-w-6xl">
            <p className="jt-display text-[clamp(2rem,5vw,4rem)] leading-[1.08] tracking-[0.04em] text-white [text-shadow:2px_2px_0_rgba(0,0,0,0.2)]">
              THE ODDS WERE 1 IN 1.226 QUINTILLION.
              <br />
              <span className="text-[var(--yellow)]">THE FITZGERALD SISTERS JUST BEAT THEM.</span>
            </p>
          </div>
        </section>

        <section
          id="about"
          className="grid gap-12 border-b-[4px] border-[var(--black)] bg-[var(--cream)] px-6 py-16 md:px-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-18 lg:px-20 lg:py-24"
        >
          <div>
            <p className="jt-display text-xs tracking-[0.3em] text-[var(--pink)] md:text-sm">The Play</p>
            <h2 className="jt-display mt-3 max-w-[220px] text-5xl leading-[0.94] text-[var(--black)] md:text-6xl">
              A Comedy About Everything You Ever Wanted
            </h2>
            <div className="mt-5 h-1 w-8 bg-[var(--red)]" />
            <p className="jt-subheading mt-5 text-xs uppercase tracking-[0.12em] text-black/45 md:text-sm">
              Written &amp; Directed by
              <strong className="jt-subheading mt-1 block text-lg font-semibold uppercase tracking-[0.08em] text-[var(--black)]">
                Philip Riccio
              </strong>
            </p>
          </div>

          <div className="jt-body text-[17px] leading-8 text-black/70 md:text-lg md:leading-9">
            <p>
              Imagine winning the lottery. Now imagine doing it again. And again. For the Fitzgeralds, a third grand
              prize isn&apos;t a miracle — it&apos;s a cosmic catastrophe. Suddenly, their quiet bungalow is a magnet for
              opportunistic lovers, estranged daughters, and a relentless lottery investigator who suspects their
              &ldquo;luck&rdquo; is a crime.
            </p>
            <p className="mt-6">
              Between dodging the local press and punching the clock at the snack factory, the sisters must survive the
              absurdity of their own impossible fortune. As the oversized cheques pile up, they realize that beating the
              odds was the easy part. The real adventure is figuring out who you are when you finally have nothing left
              to wish for.
            </p>
            <p className="mt-6">
              Canadian theatre legends <em className="font-medium not-italic text-[var(--black)]">Seana McKenna</em>{" "}
              and <em className="font-medium not-italic text-[var(--black)]">Nora McLellan</em> lead an all-star cast in{" "}
              <em className="font-medium not-italic text-[var(--black)]">Jackpot Twins</em> — a sharp-witted,
              irreverent new comedy about the heavy price of getting everything you ever wanted. Hilarious,
              high-stakes, and surprisingly heartfelt. <em className="font-medium not-italic text-[var(--black)]">Jackpot Twins</em>{" "}
              reunites Mirvish and The Company Theatre for the first time since{" "}
              <em className="font-medium not-italic text-[var(--black)]">Things I Know to be True</em> in 2023.
            </p>
          </div>
        </section>

        <section className="border-t-[4px] border-[var(--yellow)] bg-[var(--black)] px-6 py-16 md:px-10 lg:px-20 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-3 border-b-2 border-white/10 pb-4 md:flex-row md:items-end md:justify-between">
              <h2 className="jt-display text-5xl tracking-[0.04em] text-white md:text-7xl">The Company</h2>
              <p className="jt-subheading text-sm uppercase tracking-[0.18em] text-[var(--yellow)] md:text-base">
                An all-star cast
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {cast.map((member) => (
                <button
                  key={member.actor}
                  type="button"
                  onClick={() => setSelectedCastMember(member)}
                  className="group relative overflow-hidden border-2 border-white/8 bg-black text-left transition hover:border-[var(--yellow)] focus:outline-none focus:ring-2 focus:ring-[var(--yellow)]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
                    <Image
                      src={member.image}
                      alt={member.actor}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw"
                      className="object-cover object-top transition duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/55 to-transparent px-4 pb-4 pt-10">
                      <span className="jt-display block text-2xl leading-none tracking-[0.06em] text-white">
                        {member.actor}
                      </span>
                      <span className="jt-subheading mt-1 block text-xs uppercase tracking-[0.12em] text-[var(--yellow)]">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-12 border-y-[4px] border-[var(--black)] bg-[var(--blue)] px-6 py-16 md:px-10 lg:grid-cols-2 lg:gap-18 lg:px-20 lg:py-18">
          <div>
            <p className="jt-display text-xs tracking-[0.3em] text-black/55 md:text-sm">Creative Team</p>
            <h2 className="jt-display mt-3 text-5xl leading-[0.94] text-[var(--black)] md:text-7xl">
              New Work.
              <br />
              Sharp Edges.
            </h2>
            <p className="jt-subheading mt-3 text-sm uppercase tracking-[0.08em] text-black/60 md:text-lg">
              A World Premiere
            </p>
          </div>

          <ul className="self-center">
            {creativeTeam.map((credit, index) => (
              <li
                key={credit.role}
                className={`flex flex-col gap-2 border-black/15 py-4 md:flex-row md:items-center md:justify-between ${
                  index === 0 ? "border-y" : "border-b"
                }`}
              >
                <span className="jt-display text-xs tracking-[0.22em] text-black/50 md:text-sm">{credit.role}</span>
                <span className="jt-subheading text-2xl font-semibold uppercase tracking-[0.05em] text-[var(--black)]">
                  {credit.person}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="jt-ticket-dots relative overflow-hidden border-b-[4px] border-[var(--black)] bg-[var(--red)] px-6 py-16 text-center md:px-10 lg:px-20 lg:py-24">
          <div className="relative z-10 mx-auto max-w-6xl">
            <p className="jt-display text-xs tracking-[0.3em] text-white/65 md:text-sm">Tickets</p>
            <h2 className="jt-display mt-3 text-[clamp(4rem,10vw,7rem)] leading-[0.9] tracking-[0.02em] text-white [text-shadow:3px_3px_0_rgba(0,0,0,0.2)]">
              Don&apos;t Miss It
            </h2>
            <p className="jt-subheading mt-3 text-sm uppercase tracking-[0.1em] text-white/80 md:text-lg">
              Available exclusively through Mirvish Productions
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-x-14 gap-y-8">
              <div>
                <p className="jt-display text-[11px] tracking-[0.28em] text-white/60">Previews from</p>
                <p className="jt-subheading mt-2 text-lg font-semibold uppercase tracking-[0.06em] text-white">
                  March 9, 2027
                </p>
              </div>
              <div>
                <p className="jt-display text-[11px] tracking-[0.28em] text-white/60">Press Opening</p>
                <p className="jt-subheading mt-2 text-lg font-semibold uppercase tracking-[0.06em] text-white">
                  March 14, 2027 · 2 PM
                </p>
              </div>
              <div>
                <p className="jt-display text-[11px] tracking-[0.28em] text-white/60">Closing</p>
                <p className="jt-subheading mt-2 text-lg font-semibold uppercase tracking-[0.06em] text-white">
                  March 28, 2027
                </p>
              </div>
              <div>
                <p className="jt-display text-[11px] tracking-[0.28em] text-white/60">Venue</p>
                <p className="jt-subheading mt-2 text-lg font-semibold uppercase tracking-[0.06em] text-white">
                  CAA Theatre · Toronto
                </p>
              </div>
            </div>

            <Link
              href="https://mirvish.com"
              target="_blank"
              rel="noreferrer"
              className="jt-display jt-shadow-button mt-10 inline-flex items-center justify-center border-[3px] border-[var(--black)] bg-[var(--yellow)] px-10 py-4 text-2xl tracking-[0.14em] text-[var(--black)]"
            >
              Get Tickets at Mirvish
            </Link>
          </div>
        </section>

        <footer className="flex flex-col gap-5 border-t-[4px] border-[var(--pink)] bg-[var(--black)] px-6 py-10 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-20">
          <div className="jt-subheading text-xs uppercase tracking-[0.08em] text-white/35 md:text-sm">
            A Company Theatre production in association with Mirvish Productions.
            <br />© 2026 The Company Theatre. All rights reserved.
          </div>
          <div className="flex items-center gap-7">
            <Link
              href="https://companytheatre.ca"
              target="_blank"
              rel="noreferrer"
              className="jt-display text-sm tracking-[0.2em] text-white/35 transition hover:text-[var(--yellow)]"
            >
              companytheatre.ca
            </Link>
            <Link
              href="https://mirvish.com"
              target="_blank"
              rel="noreferrer"
              className="jt-display text-sm tracking-[0.2em] text-white/35 transition hover:text-[var(--yellow)]"
            >
              mirvish.com
            </Link>
          </div>
        </footer>
      </main>

      <CastBioModal member={selectedCastMember} onClose={() => setSelectedCastMember(null)} />
    </>
  );
}

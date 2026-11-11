"use client";

import { CONSENT_VERSION } from "@/lib/signup-contract";

import Image from "next/image";
import dynamic from "next/dynamic";
const ScratchGame = dynamic(() => import("./scratch/double-trouble"), { ssr: false, loading: () => <p role="status">Opening your game…</p> });
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";

import { gaEvent, ticketUrl } from "./ticket-analytics";

import CastSection from "./cast-section";
import ApprovedHero from "./approved-hero";
import SignupPopup, { useSignupPopup, rememberSignupSuccess, type SignupState } from "./signup-popup";
import "./page.css";
import "./approved-hero.css";

const creativeTeam = [
  { role: "Written & Directed by", person: "Philip Riccio" },
  { role: "Producer", person: "Janice Peters Gibson" },
  { role: "Set Design", person: "Anahita Dehbonehie" },
  { role: "Lighting Design", person: "Kevin Lamotte" },
] as const;

const additionalCreativeTeam = [
  { role: "Costume Design", person: "Niloufar Ziaee" },
  { role: "Sound Design", person: "Thomas Ryder Payne" },
  { role: "Stage Manager", person: "Alysse Szatkowski" },
  { role: "Assistant Stage Manager", person: "Meghan Speakman" },
] as const;

const tickerItems = [
  "JACKPOT TWINS",
  "WRITTEN AND DIRECTED BY PHILIP RICCIO",
  "WORLD PREMIERE",
  "CAA THEATRE · TORONTO",
  "SPRING 2027",
  "THE COMPANY THEATRE + MIRVISH PRODUCTIONS",
] as const;

export default function Home({ scratchMode = false }: { scratchMode?: boolean }) {
  const { open: modalOpen, openSignup, closeSignup } = useSignupPopup(scratchMode);
  const signupPending = useRef(false);
  const [signupStatus, setSignupStatus] = useState<SignupState>("idle");
  const allTickerItems = useMemo(() => [...tickerItems, ...tickerItems], []);

  const handleSignup = useCallback(async (formData: FormData) => {
    if (signupPending.current) return;
    signupPending.current = true;
    setSignupStatus("submitting");
    gaEvent("signup_popup_submit");

    const payload = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      consent: formData.get("consent") === "on",
      consentVersion: CONSENT_VERSION,
    };

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) throw new Error(`Signup failed: ${response.status}`);

      const confirmation = await response.json();
      if (confirmation.recorded !== true || typeof confirmation.subscribed !== "boolean") throw new Error("Invalid signup response");
      if (!confirmation.subscribed) { setSignupStatus("review"); gaEvent("signup_popup_review"); return; }
      setSignupStatus("success");
      rememberSignupSuccess();
      gaEvent("email_signup", { method: "jackpottwins_modal" });
    } catch {
      setSignupStatus("error");
      gaEvent("signup_popup_error");
    } finally { signupPending.current = false; }
  }, []);

  return (
    <>
      <main>
        <div className="ticker">
          <div className="ticker-inner">
            {allTickerItems.map((item, index) => (
              <div key={`${item}-${index}`} style={{ display: "inline-flex", alignItems: "center" }}>
                <span className="ticker-text">{item}</span>
                <span className="ticker-dot">★</span>
              </div>
            ))}
          </div>
        </div>

        <ApprovedHero scratchMode={scratchMode} />

        <div className="copro">
          <span className="copro-label">A Production By</span>
          <div className="copro-logos">
            <Link className="copro-ct" href="https://companytheatre.ca" data-analytics-placement="company_credit" target="_blank">
              <Image src="/logos/ct-logo-white.svg" alt="The Company Theatre" width={210} height={56} />
            </Link>
            <div className="copro-pipe" />
            <Link className="copro-mirvish" href="https://www.mirvish.com" target="_blank">
              <Image src="/logos/mirvish-logo-white.svg" alt="Mirvish Productions" width={205} height={28} />
            </Link>
          </div>
        </div>

        <section className="quote-strip">
          <p className="quote-text">
            THE ODDS WERE 1 IN 1.226 QUINTILLION.
            <br />
            <span className="quote-yellow">THE FITZGERALD SISTERS JUST BEAT THEM.</span>
          </p>
        </section>

        <section className="about" id="about">
          <div className="about-aside">
            <h2 className="about-heading">Is it possible to be too lucky?</h2>
            <div className="about-rule" />
          </div>
          <div className="about-body">
            <p className="about-lead">Imagine winning the lottery. Now imagine doing it again. And again.</p>
            <p>For the Fitzgeralds, a third grand prize isn&apos;t a miracle — it&apos;s a cosmic catastrophe. Suddenly, their quiet bungalow is a magnet for opportunistic lovers, estranged daughters, and a relentless lottery investigator who suspects their &ldquo;luck&rdquo; is a crime.</p>
            <p>Between dodging the local press and punching the clock at the snack factory, the sisters must survive the absurdity of their own impossible fortune. As the oversized cheques pile up, they realize that beating the odds was the easy part. The real adventure is figuring out who you are when you finally have nothing left to wish for.</p>
            <p>Canadian theatre legends <em>Seana McKenna</em> and <em>Nora McLellan</em> lead an all-star cast in <em>Jackpot Twins</em> — a sharp-witted, irreverent new comedy about the heavy price of getting everything you ever wanted. Hilarious, high-stakes, and surprisingly heartfelt. <em>Jackpot Twins</em> reunites Mirvish and The Company Theatre for the first time since <em>Things I Know to be True</em> in 2023.</p>
          </div>
        </section>

        <CastSection />

        <figure className="chairs-photo">
          <Image
            src="/images/jackpot-twins-photo288-equal-chairs.webp"
            alt="Nora McLellan and Seana McKenna seated in matching blue chairs in Jackpot Twins"
            width={1536}
            height={864}
            sizes="(max-width: 1536px) 100vw, 1536px"
          />
        </figure>

        <section className="creative">
          <h2 className="creative-heading">Creative Team</h2>
          <ul className="creative-list">
            {creativeTeam.map((item) => (
              <li key={item.role} className="creative-item">
                <span className="creative-role">{item.role}</span>
                <span className="creative-person">{item.person}</span>
              </li>
            ))}
          </ul>
          <ul className="creative-list creative-list-additional">
            {additionalCreativeTeam.map((item) => (
              <li key={item.role} className="creative-item">
                <span className="creative-role">{item.role}</span>
                <span className="creative-person">{item.person}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="signup" id="signup">
          <p className="signup-label">Jackpot Twins at the CAA Theatre</p>
          <h2 className="signup-heading">Get Your Tickets</h2>
          <p className="signup-sub">March 9–28, 2027 · Three weeks only.</p>
          <a
            href={ticketUrl("ticket_section")}
            data-ticket-placement="ticket_section"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-main ticket-slot"
          >
            <span className="ticket-slot-face"><span aria-hidden="true" className="ticket-slot-star">★</span><span>Buy Tickets</span><span aria-hidden="true" className="ticket-slot-star">★</span></span>
          </a>
          <p className="signup-single-tickets">{scratchMode ? "Find both twins to win ticket offers." : "Get the latest Jackpot Twins news and updates."}</p>
          <button
            type="button"
            className="btn-main btn-secondary"
            style={{ fontSize: 16, padding: "14px 36px", margin: "0 auto" }}
            onClick={() => {
              openSignup("manual");
            }}
          >
            {scratchMode ? "Play the Scratch Game" : "Sign Up for Updates"}
          </button>
        </section>

        <footer>
          <div className="footer-logos">
            <Link href="https://companytheatre.ca" data-analytics-placement="company_footer" target="_blank">
              <Image src="/logos/ct-logo-white.svg" alt="The Company Theatre" width={120} height={32} />
            </Link>
            <span className="footer-pipe" />
            <Link href="https://www.mirvish.com" target="_blank">
              <Image src="/logos/mirvish-logo-white.svg" alt="Mirvish Productions" width={146} height={20} />
            </Link>
          </div>
          <div className="footer-copy">© 2026 The Company Theatre. All rights reserved.</div>
        </footer>
      </main>

      {scratchMode ? (modalOpen && <ScratchGame placement="homepage" onClose={() => closeSignup("close_game")} />) : <SignupPopup open={modalOpen} onClose={closeSignup} onSubmit={handleSignup} status={signupStatus} />}
    </>
  );
}

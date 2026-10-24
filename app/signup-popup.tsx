"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CONSENT_TEXT } from "@/lib/signup-contract";
import { campaignContext, gaEvent } from "./campaign-analytics";
import "./signup-popup.css";

export type SignupState = "idle" | "submitting" | "success" | "review" | "error";
const preferenceKey = "jt-signup-popup-v1";
const week = 7 * 24 * 60 * 60 * 1000;
export function rememberSignupSuccess() {
  try { localStorage.setItem(preferenceKey, JSON.stringify({ subscribed: true })); } catch { /* Optional storage. */ }
}

export function useSignupPopup() {
  const [open, setOpen] = useState(false);
  const shown = useRef(false);
  const trigger = useRef<"automatic" | "manual">("manual");
  const openSignup = useCallback((source: "automatic" | "manual" = "manual") => {
    shown.current = true;
    trigger.current = source;
    setOpen(true);
    gaEvent("signup_popup_open", { trigger: source });
  }, []);
  const closeSignup = useCallback((reason: string) => {
    setOpen(false);
    try {
      const saved = JSON.parse(localStorage.getItem(preferenceKey) || "null");
      if (!saved?.subscribed) localStorage.setItem(preferenceKey, JSON.stringify({ dismissedAt: Date.now() }));
    } catch { /* Do not make dismissal depend on storage access. */ }
    gaEvent("signup_popup_dismiss", { trigger: trigger.current, reason });
  }, []);
  useEffect(() => {
    // An email arrival is likely already a subscriber. The manual form stays available.
    if (new URLSearchParams(window.location.search).get("utm_medium")?.toLowerCase() === "email" || campaignContext().utm_medium?.toLowerCase() === "email") return;
    try {
      const saved = JSON.parse(localStorage.getItem(preferenceKey) || "null");
      if (saved?.subscribed || (typeof saved?.dismissedAt === "number" && Date.now() - saved.dismissedAt < week)) return;
    } catch { /* Blocked/corrupt storage must not break the page. */ }
    const arrivedAt = Date.now();
    let lastActivity = arrivedAt;
    let pointerDown = false;
    const activity = () => { lastActivity = Date.now(); };
    const down = () => { pointerDown = true; activity(); };
    const up = () => { pointerDown = false; activity(); };
    const timer = window.setInterval(() => {
      if (shown.current) { window.clearInterval(timer); return; }
      if (Date.now() - arrivedAt < 20000 || document.visibilityState !== "visible" || pointerDown || Date.now() - lastActivity < 2500) return;
      // Wait until the main title and ticket hero has left the viewport.
      // Missing hero fails closed: manual signup remains available.
      const hero = document.querySelector("section.approved-hero");
      if (!hero || hero.getBoundingClientRect().bottom > 0) return;
      if (document.querySelector('dialog[open], [role="dialog"]') || document.activeElement?.matches('input, textarea, select, button, a, [contenteditable="true"]')) return;
      openSignup("automatic");
      window.clearInterval(timer);
    }, 500);
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", up, { passive: true });
    window.addEventListener("keydown", activity);
    window.addEventListener("input", activity);
    window.addEventListener("click", activity);
    document.addEventListener("visibilitychange", activity);
    window.addEventListener("scroll", activity, { passive: true });
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("keydown", activity);
      window.removeEventListener("input", activity);
      window.removeEventListener("click", activity);
      document.removeEventListener("visibilitychange", activity);
      window.removeEventListener("scroll", activity);
    };
  }, [openSignup]);
  return { open, openSignup, closeSignup };
}

export default function SignupPopup({ open, onClose, onSubmit, status }: {
  open: boolean; onClose: (reason: string) => void;
  onSubmit: (formData: FormData) => Promise<void>; status: SignupState;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const node = dialog.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const controls = Array.from(node.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]'));
      const first = controls[0], last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); title.current?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === title.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    node.addEventListener("keydown", trapFocus);
    node.showModal();
    title.current?.focus();
    document.body.style.overflow = "hidden";
    gaEvent("signup_popup_impression");
    return () => {
      node.removeEventListener("keydown", trapFocus);
      node.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);
  return <dialog ref={dialog} className="casino-signup" aria-labelledby="casino-signup-title" aria-describedby="casino-signup-description"
    onCancel={event => { event.preventDefault(); onClose("escape"); }}
    onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose("backdrop"); } }}>
    <div className="casino-signup-shell">
      {["top", "right", "bottom", "left"].map((edge, edgeIndex) => <div key={edge} className={`casino-bulbs casino-bulbs-${edge}`} aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ animationDelay: `${(edgeIndex * 12 + i) / 12 - 4}s` }} />)}</div>)}
      <button type="button" className="casino-close" onClick={() => onClose("close_button")} aria-label="Close signup form">×</button>
      <div className="casino-signup-inner">
        <h2 id="casino-signup-title" className="casino-title" ref={title} tabIndex={-1}>Jackpot Twins email signup</h2>
        <p id="casino-signup-description" className="casino-description">{status === "success" ? "You’re on the list for Jackpot Twins and The Company Theatre news. See you in your inbox!" : "Get Jackpot Twins news, behind-the-scenes extras and special offers."}</p>
        {status === "success" ? <div role="status" className="casino-success"><span aria-hidden="true">★</span><p>You’re signed up!</p><button type="button" className="casino-submit" onClick={() => onClose("success")}>BACK TO THE SHOW <span aria-hidden="true">→</span></button></div> : <form className="casino-form" onSubmit={async event => { event.preventDefault(); await onSubmit(new FormData(event.currentTarget)); }}>
          <div className="casino-names"><label>First name<input name="firstName" autoComplete="given-name" maxLength={100} placeholder="First name" required /></label><label>Last name<input name="lastName" autoComplete="family-name" maxLength={100} placeholder="Last name" required /></label></div>
          <label>Email address<input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required /></label>
          <label className="casino-consent"><input type="checkbox" name="consent" required /><span>{CONSENT_TEXT}</span></label>
          <button type="submit" className="casino-submit" disabled={status === "submitting"}><span className="casino-submit-label">{status === "submitting" ? "ADDING YOU…" : "Sign up"}</span></button>
          {status === "review" ? <p role="status" className="casino-feedback">Your request was recorded, but this address needs a subscription review. It has not been added to the mailing list.</p> : null}
          {status === "error" ? <p role="alert" className="casino-feedback">We couldn’t confirm your signup. Please try again. Your details are still here.</p> : null}
        </form>}
      </div>
    </div>
  </dialog>;
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./page.css";

type CastMember = {
  name: string;
  role: string;
  img: string;
  imgStyle?: string;
  cardIcon: string;
  bio: string;
};

type SignupState = "idle" | "submitting" | "success" | "error";
type SoundType = "reveal" | "flip" | "toggle" | "signup";

type CountdownState = {
  days: string;
  hours: string;
  mins: string;
  secs: string;
};

const castData: CastMember[] = [
  {
    name: "Seana McKenna",
    role: "Geraldine Fitzgerald",
    img: "/images/headshots/seana-mckenna.jpeg",
    imgStyle: "center 20%",
    cardIcon: "✝️",
    bio: "Seana McKenna is a recipient of the Order of Canada — do we need to say more? No. But we will anyway. A National Theatre School graduate, she has spent four decades setting the standard at Stratford, Shaw, Canadian Stage, and stages across North America, playing everything from Juliet to Julius Caesar along the way. She made history as Stratford's first female Richard III. Three Dora Awards, a Genie, a Jessie, and an Honorary Doctorate later — if you saw her in Things I Know to Be True and needed a few days to recover, good news: this one's a comedy.",
  },
  {
    name: "Nora McLellan",
    role: "Bernadette Fitzgerald",
    img: "/images/headshots/nora-mclellan.jpeg",
    imgStyle: "center 0%",
    cardIcon: "💺",
    bio: "Nora McLellan has been one of Canadian theatre's great pleasures for over fifty years, and she shows absolutely no signs of stopping. She spent 22 seasons at the Shaw Festival and four at Stratford, trained with the legendary Uta Hagen in New York, and has four Jessie Awards and two Doras to her name. Toronto audiences know her from John at The Company Theatre — for which she won the Dora for Outstanding Performance — and as Sister Rose in CBC's Son of a Critch, a role written especially for her. She is, in every sense, a force of nature.",
  },
  {
    name: "Tony Nappo",
    role: "Peter Mallory",
    img: "/images/headshots/tony-nappo.jpg",
    imgStyle: "center 5%",
    cardIcon: "🚗",
    bio: "Tony Nappo has appeared in roughly 70 films, hundreds of TV shows, and more Toronto stages than most people have visited. Born in Scarborough, trained at the American Academy of Dramatic Arts in Manhattan, he's the kind of actor critics describe as \"razor-sharp\" and \"effortlessly magnetic.\" He's appeared alongside Al Pacino, recently played Georgia's lawyer on the hit Netflix series Ginny & Georgia, voiced a gangster in Fugget About It, and wrote the beloved column Nappoholics Anonymous for Intermission Magazine. If you've watched Canadian TV in the last twenty years, you've seen him.",
  },
  {
    name: "Colin A Doyle",
    role: "Harold Bates",
    img: "/images/headshots/colin-doyle.jpg",
    imgStyle: "center 30%",
    cardIcon: "🔍",
    bio: "Colin A Doyle is a Dora Award–winning, Toronto-based actor and theatre producer who has performed across Canada, the US, and Europe. A York University Acting Conservatory graduate, he has worked with some of the most inventive companies in the country — Outside the March, Canadian Stage, Obsidian Theatre, Crow’s Theatre, Caravan, Coal Mine Theatre, and Mirvish — and has played everything from Peter Pan to a post-apocalyptic Homer Simpson. The range is real.",
  },
  {
    name: "Caroline Toal",
    role: "Abigail",
    img: "/images/headshots/caroline-toal.jpg",
    cardIcon: "🧥",
    bio: "Caroline Toal is a two-time Dora Award winner, a Stratford Festival Mary Savidge Award recipient, and the person most recently responsible for making half of Ontario cry about Anne Shirley. She grew up in Orangeville, trained at George Brown Theatre School, and has originated roles in new Canadian plays at Young People's Theatre, The Howland Company, and the Stratford Festival. Her credits include Casimir and Caroline, Selfie, To Kill a Mockingbird, and Anne of Green Gables — which received an extension because the audiences refused to let it close. Some performers make you want to stay. She is one of them.",
  },
];

const creativeTeam = [
  { role: "Written & Directed by", person: "Philip Riccio" },
  { role: "Producer", person: "Janice Peters Gibson" },
  { role: "Set Design", person: "Anahita Dehbonehie" },
  { role: "Lighting Design", person: "Kevin Lamotte" },
] as const;

const tickerItems = [
  "JACKPOT TWINS",
  "WRITTEN AND DIRECTED BY PHILIP RICCIO",
  "WORLD PREMIERE",
  "CAA THEATRE · TORONTO",
  "SPRING 2027",
  "THE COMPANY THEATRE + MIRVISH PRODUCTIONS",
] as const;

const countdownTarget = new Date("2027-03-09T19:30:00-05:00");
const titleWords = [
  { src: "/images/title-jackpot.png", alt: "JACKPOT", className: "jackpot" },
  { src: "/images/title-twins.png", alt: "TWINS", className: "twins" },
] as const;

function parseObjectPosition(position?: string) {
  const [x = "center", y = "center"] = (position ?? "center center").split(" ");
  return `${x} ${y}`;
}

function getCountdown(): CountdownState {
  const diff = countdownTarget.getTime() - Date.now();
  if (diff <= 0) return { days: "0", hours: "0", mins: "0", secs: "0" };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days: String(days),
    hours: String(hours).padStart(2, "0"),
    mins: String(mins).padStart(2, "0"),
    secs: String(secs).padStart(2, "0"),
  };
}

function SignupModal({
  open,
  onClose,
  onSubmit,
  status,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  status: SignupState;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={`signup-modal ${open ? "show" : ""}`} id="signupModal">
      <div className="signup-modal-backdrop" onClick={onClose} />
      <div className="signup-modal-card">
        <button type="button" className="signup-modal-close" onClick={onClose} aria-label="Close signup form">
          &times;
        </button>
        <p className="signup-modal-title">Be the first to know when single tickets go on sale</p>
        {status === "success" ? (
          <p className="signup-modal-success">You&apos;re in! 🎰 We&apos;ll be in touch.</p>
        ) : (
          <form
            className="signup-modal-form"
            onSubmit={async (event) => {
              event.preventDefault();
              await onSubmit(new FormData(event.currentTarget));
            }}
          >
            <input name="firstName" type="text" className="signup-modal-input" placeholder="First name" required />
            <input name="lastName" type="text" className="signup-modal-input" placeholder="Last name" required />
            <input name="email" type="email" className="signup-modal-input" placeholder="Email address" required />
            <button type="submit" className="signup-modal-btn" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending..." : "Notify Me"}
            </button>
            {status === "error" ? (
              <p className="signup-error">We couldn&apos;t submit right now. Please try again.</p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [countdown, setCountdown] = useState<CountdownState>(getCountdown);
  const [modalOpen, setModalOpen] = useState(false);
  const [signupStatus, setSignupStatus] = useState<SignupState>("idle");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activatedCards, setActivatedCards] = useState<boolean[]>(() => castData.map(() => false));
  const [revealedCards, setRevealedCards] = useState<boolean[]>(() => castData.map(() => false));
  const [flippedCards, setFlippedCards] = useState<boolean[]>(() => castData.map(() => false));
  const [flipLabels, setFlipLabels] = useState<string[]>(() => castData.map(() => "PLAY"));
  const [isDesktop, setIsDesktop] = useState(false);
  const [pennyVisible, setPennyVisible] = useState(false);
  const [pennyHidden, setPennyHidden] = useState(false);
  const [pennyPosition, setPennyPosition] = useState({ x: 0, y: 0, rotation: -15 });

  const audioContextRef = useRef<AudioContext | null>(null);
  const scratchCanvases = useRef<(HTMLCanvasElement | null)[]>([]);
  const flipIntervals = useRef<(number | null)[]>(castData.map(() => null));
  const scratchCounts = useRef<number[]>(castData.map(() => 0));
  const fleckTimeouts = useRef<number[]>([]);
  const titleImageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const bulbCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const dotContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scratchGridRef = useRef<HTMLDivElement | null>(null);

  const allTickerItems = useMemo(() => [...tickerItems, ...tickerItems], []);

  const playSound = useCallback((type: SoundType) => {
    if (!soundEnabled || typeof window === "undefined") return;

    const AudioCtor = window.AudioContext ?? (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtor();
    }

    const audioCtx = audioContextRef.current;
    if (audioCtx.state === "suspended") {
      void audioCtx.resume();
    }

    const makeVoice = (freq: number, start: number, stop: number, gainValue: number) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(gainValue, start);
      gain.gain.exponentialRampToValueAtTime(0.001, stop);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(start);
      osc.stop(stop);
    };

    const now = audioCtx.currentTime;

    if (type === "reveal") {
      [523, 659, 784, 1047].forEach((freq, index) => makeVoice(freq, now + index * 0.08, now + index * 0.08 + 0.18, 0.08));
      return;
    }

    if (type === "flip") {
      makeVoice(880, now, now + 0.14, 0.05);
      makeVoice(660, now + 0.03, now + 0.16, 0.035);
      return;
    }

    if (type === "toggle") {
      makeVoice(440, now, now + 0.16, 0.04);
      return;
    }

    [523, 659, 784, 1047, 784, 1047].forEach((freq, index) => makeVoice(freq, now + index * 0.1, now + index * 0.1 + 0.12, 0.06));
  }, [soundEnabled]);

  const startFlipRotation = useCallback((index: number) => {
    if (flipIntervals.current[index]) window.clearInterval(flipIntervals.current[index]!);
    let toggle = true;
    setFlipLabels((current) => current.map((label, i) => (i === index ? "YOU WIN!" : label)));
    flipIntervals.current[index] = window.setInterval(() => {
      toggle = !toggle;
      setFlipLabels((current) => current.map((label, i) => (i === index ? (toggle ? "YOU WIN!" : "FLIP") : label)));
    }, 800);
  }, []);

  const stopFlipRotation = useCallback((index: number, nextLabel: string) => {
    if (flipIntervals.current[index]) {
      window.clearInterval(flipIntervals.current[index]!);
      flipIntervals.current[index] = null;
    }
    setFlipLabels((current) => current.map((label, i) => (i === index ? nextLabel : label)));
  }, []);

  const drawScratchCard = useCallback((index: number) => {
    const canvas = scratchCanvases.current[index];
    if (!canvas?.parentElement) return;

    const rect = canvas.parentElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = rect.width;
    const h = rect.height;
    const icon = castData[index]?.cardIcon ?? "🎰";

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const goldGrad = ctx.createLinearGradient(0, 0, w, h);
    goldGrad.addColorStop(0, "#B8860B");
    goldGrad.addColorStop(0.15, "#D4A017");
    goldGrad.addColorStop(0.3, "#F5D020");
    goldGrad.addColorStop(0.45, "#FFEA70");
    goldGrad.addColorStop(0.55, "#F5D020");
    goldGrad.addColorStop(0.7, "#D4A017");
    goldGrad.addColorStop(0.85, "#F5D020");
    goldGrad.addColorStop(1, "#B8860B");
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, w, h);

    const inset = 5;
    ctx.strokeStyle = "#D0D0D0";
    ctx.lineWidth = 3;
    ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);

    ctx.strokeStyle = "rgba(220,220,220,0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(inset + 5, inset + 5, w - (inset + 5) * 2, h - (inset + 5) * 2);

    const starSize = Math.min(w / 8, 18);
    const corners: Array<[number, number]> = [
      [inset + 14, inset + 14],
      [w - inset - 14, inset + 14],
      [inset + 14, h - inset - 14],
      [w - inset - 14, h - inset - 14],
    ];
    ctx.font = `${starSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#C0C0C0";
    corners.forEach(([cx, cy]) => ctx.fillText("★", cx, cy));

    for (let i = 0; i < 50; i += 1) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.2 + 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.4 + 0.1})`;
      ctx.fill();
    }

    ctx.save();
    ctx.font = `bold ${Math.min(w / 7, 22)}px "Bebas Neue", sans-serif`;
    ctx.fillStyle = "#C0C0C0";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 1;
    ctx.fillText("JACKPOT TWINS", w / 2, h * 0.16);
    ctx.shadowBlur = 0;

    ctx.font = `${Math.min(w / 3, 56)}px sans-serif`;
    ctx.filter = "grayscale(100%) brightness(1.5)";
    ctx.fillText(icon, w / 2, h * 0.46);
    ctx.filter = "none";

    ctx.font = `bold ${Math.min(w / 8, 18)}px "Luckiest Guy", cursive`;
    ctx.fillStyle = "#C0C0C0";
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 2;
    ctx.fillText("SCRATCH ME", w / 2, h * 0.7);
    ctx.shadowBlur = 0;

    ctx.font = `${Math.min(w / 8, 14)}px sans-serif`;
    ctx.fillStyle = "#B0B0B0";
    ctx.fillText("★ ★ ★ ★ ★", w / 2, h * 0.85);
    ctx.restore();
    ctx.restore();
  }, []);

  const computeRevealPct = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 16) {
      if (imageData.data[i] === 0) transparent += 1;
    }
    return transparent / (imageData.data.length / 16);
  }, []);

  const activateCard = useCallback((index: number, shouldPlaySound: boolean) => {
    setActivatedCards((current) => {
      if (current[index]) return current;
      const next = [...current];
      next[index] = true;
      return next;
    });
    startFlipRotation(index);
    if (shouldPlaySound) playSound("reveal");
  }, [playSound, startFlipRotation]);

  const revealCard = useCallback((index: number) => {
    setRevealedCards((current) => {
      if (current[index]) return current;
      const next = [...current];
      next[index] = true;
      return next;
    });
    // Also activate if not already
    setActivatedCards((current) => {
      if (current[index]) return current;
      const next = [...current];
      next[index] = true;
      return next;
    });
    startFlipRotation(index);
  }, [startFlipRotation]);

  const spawnFlecks = useCallback((clientX: number, clientY: number) => {
    for (let i = 0; i < 2; i += 1) {
      const fleck = document.createElement("div");
      fleck.className = "scratch-fleck";
      fleck.style.left = `${clientX + (Math.random() - 0.5) * 24}px`;
      fleck.style.top = `${clientY + (Math.random() - 0.5) * 24}px`;
      const size = Math.random() * 3 + 2;
      fleck.style.width = `${size}px`;
      fleck.style.height = `${size}px`;
      fleck.style.background = Math.random() > 0.5 ? "#D4A017" : "#F5D020";
      document.body.appendChild(fleck);
      requestAnimationFrame(() => fleck.classList.add("fade"));
      const timeoutId = window.setTimeout(() => fleck.remove(), 500);
      fleckTimeouts.current.push(timeoutId);
    }
  }, []);

  const scratchAt = useCallback((index: number, clientX: number, clientY: number, createFlecks: boolean) => {
    const canvas = scratchCanvases.current[index];
    if (!canvas || revealedCards[index] || flippedCards[index]) return;

    const rect = canvas.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.beginPath();
    ctx.arc(x, y, 22 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    scratchCounts.current[index] += 1;
    if (createFlecks) spawnFlecks(clientX, clientY);

    if (scratchCounts.current[index] > 20 && scratchCounts.current[index] % 5 === 0) {
      const pct = computeRevealPct(canvas);
      if (pct > 0.35) activateCard(index, true);
    }
  }, [activateCard, computeRevealPct, flippedCards, revealedCards, spawnFlecks]);

  const checkReveal = useCallback((index: number) => {
    const canvas = scratchCanvases.current[index];
    if (!canvas || activatedCards[index]) return;
    const pct = computeRevealPct(canvas);
    if (pct > 0.35) activateCard(index, true);
  }, [activateCard, activatedCards, computeRevealPct]);

  const revealAll = useCallback(() => {
    setFlippedCards(castData.map(() => false));
    setActivatedCards(castData.map(() => true));
    setRevealedCards(castData.map(() => true));
    castData.forEach((_, index) => startFlipRotation(index));
    playSound("reveal");
  }, [playSound, startFlipRotation]);

  const resetAll = useCallback(() => {
    flipIntervals.current.forEach((interval) => {
      if (interval) window.clearInterval(interval);
    });
    flipIntervals.current = castData.map(() => null);
    scratchCounts.current = castData.map(() => 0);
    setActivatedCards(castData.map(() => false));
    setRevealedCards(castData.map(() => false));
    setFlippedCards(castData.map(() => false));
    setFlipLabels(castData.map(() => "PLAY"));
    window.requestAnimationFrame(() => {
      castData.forEach((_, index) => drawScratchCard(index));
    });
    playSound("toggle");
  }, [drawScratchCard, playSound]);

  const toggleFlip = useCallback((index: number) => {
    if (!activatedCards[index]) return;

    // When flipping to bio, also reveal (hide remaining gold overlay)
    if (!revealedCards[index]) {
      setRevealedCards((current) => current.map((value, i) => (i === index ? true : value)));
    }

    const nextFlipped = !flippedCards[index];
    setFlippedCards((current) => current.map((value, i) => (i === index ? nextFlipped : value)));

    if (nextFlipped) {
      stopFlipRotation(index, "BACK");
    } else {
      startFlipRotation(index);
    }

    playSound("flip");
  }, [activatedCards, flippedCards, playSound, revealedCards, startFlipRotation, stopFlipRotation]);

  const handleSignup = useCallback(async (formData: FormData) => {
    setSignupStatus("submitting");

    const payload = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      source: "jackpottwins.ca interest form",
    };

    try {
      const response = await fetch("https://crm.companytheatre.ca/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "cors",
      });

      if (!response.ok) throw new Error(`Signup failed: ${response.status}`);

      setSignupStatus("success");
      playSound("signup");
    } catch {
      setSignupStatus("error");
    }
  }, [playSound]);

  useEffect(() => {
    const interval = window.setInterval(() => setCountdown(getCountdown()), 1000);
    setCountdown(getCountdown());
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateDesktop = () => setIsDesktop(mediaQuery.matches);
    updateDesktop();
    mediaQuery.addEventListener("change", updateDesktop);
    return () => mediaQuery.removeEventListener("change", updateDesktop);
  }, []);

  useEffect(() => {
    const redraw = () => castData.forEach((_, index) => drawScratchCard(index));
    redraw();
    window.addEventListener("resize", redraw);
    return () => window.removeEventListener("resize", redraw);
  }, [drawScratchCard]);

  useEffect(() => {
    if (!isDesktop) {
      setPennyVisible(false);
      setPennyHidden(false);
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const grid = scratchGridRef.current;
      if (!grid) return;
      const rect = grid.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      setPennyVisible(inside && revealedCards.some((revealed) => !revealed));
      setPennyPosition({
        x: event.clientX,
        y: event.clientY,
        rotation: -15 + Math.sin(Date.now() * 0.003) * 5,
      });

      const hovered = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
      const hoveredCard = hovered?.closest(".scratch-card");
      setPennyHidden(Boolean(hovered?.classList.contains("flip-slot-btn") || hoveredCard?.classList.contains("flipped")));
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isDesktop, revealedCards]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    titleWords.forEach((_, index) => {
      const wrap = dotContainerRefs.current[index]?.parentElement;
      const dotsContainer = dotContainerRefs.current[index];
      const img = titleImageRefs.current[index];
      const canvas = bulbCanvasRefs.current[index];
      if (!wrap || !dotsContainer || !img || !canvas) return;

      const spawnDots = () => {
        dotsContainer.innerHTML = "";
        const rect = img.getBoundingClientRect();
        const wrapRect = wrap.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const offsetX = rect.left - wrapRect.left;
        const offsetY = rect.top - wrapRect.top;
        if (w < 10) return;

        const count = Math.floor(w / 5);
        const colors = ["#F5D020", "#FFEB3B", "#FFD700", "#FFF8DC", "#FFFFFF", "#FFE066"];

        for (let i = 0; i < count; i += 1) {
          const dot = document.createElement("div");
          dot.className = "title-dot";
          const size = Math.random() * 4 + 2;
          const x = offsetX + Math.random() * w;
          const y = offsetY + Math.random() * h;
          const color = colors[Math.floor(Math.random() * colors.length)];
          const dur = (Math.random() * 2 + 1.5).toFixed(2);
          const delay = (Math.random() * 3).toFixed(2);
          dot.style.left = `${x}px`;
          dot.style.top = `${y}px`;
          dot.style.width = `${size}px`;
          dot.style.height = `${size}px`;
          dot.style.background = color;
          dot.style.boxShadow = `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}`;
          dot.style.animationDuration = `${dur}s`;
          dot.style.animationDelay = `${delay}s`;
          dotsContainer.appendChild(dot);
        }
      };

      let frame = 0;
      let objectUrl: string | null = null;

      const startBulbs = (maskImage: HTMLImageElement) => {
        const rect = img.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        if (w < 10 || h < 10) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = Math.max(1, Math.round(w));
        maskCanvas.height = Math.max(1, Math.round(h));
        const maskCtx = maskCanvas.getContext("2d");
        if (!maskCtx) return;
        maskCtx.drawImage(maskImage, 0, 0, maskCanvas.width, maskCanvas.height);
        const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;

        const isInLetter = (x: number, y: number) => {
          const px = Math.floor(x);
          const py = Math.floor(y);
          if (px < 0 || px >= maskCanvas.width || py < 0 || py >= maskCanvas.height) return false;
          return maskData[(py * maskCanvas.width + px) * 4 + 3] > 100;
        };

        const colors = ["#F5D020", "#FFEB3B", "#FFD700", "#FFF8DC", "#FFFFFF", "#F5D020", "#FFD700"];
        const bulbs = Array.from({ length: Math.floor(w / 4) }).flatMap(() => {
          let attempts = 0;
          let x = 0;
          let y = 0;
          do {
            x = Math.random() * w;
            y = Math.random() * h;
            attempts += 1;
          } while (!isInLetter(x, y) && attempts < 200);
          if (attempts >= 200) return [];
          return [{
            x,
            y,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            r: Math.random() * 2 + 1.2,
            color: colors[Math.floor(Math.random() * colors.length)],
            glow: Math.random() * 0.5 + 0.3,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.04 + 0.02,
          }];
        });

        const animate = () => {
          ctx.clearRect(0, 0, w, h);
          bulbs.forEach((bulb) => {
            bulb.vy += 0.015;
            let nx = bulb.x + bulb.vx;
            let ny = bulb.y + bulb.vy;

            if (!isInLetter(nx, ny)) {
              if (isInLetter(nx, bulb.y)) {
                bulb.vy *= -0.7;
                ny = bulb.y + bulb.vy;
              } else if (isInLetter(bulb.x, ny)) {
                bulb.vx *= -0.7;
                nx = bulb.x + bulb.vx;
              } else {
                bulb.vx *= -0.6;
                bulb.vy *= -0.6;
                nx = bulb.x + bulb.vx;
                ny = bulb.y + bulb.vy;
              }
              bulb.vx += (Math.random() - 0.5) * 0.4;
            }

            if (!isInLetter(nx, ny)) {
              nx = bulb.x;
              ny = bulb.y;
              bulb.vx = (Math.random() - 0.5) * 0.6;
              bulb.vy = -Math.random() * 1.5;
            }

            bulb.x = nx;
            bulb.y = ny;
            bulb.vx *= 0.998;

            if (Math.random() < 0.008) {
              bulb.vy -= Math.random() * 1.5 + 0.5;
              bulb.vx += (Math.random() - 0.5) * 1;
            }

            bulb.phase += bulb.speed;
            const twinkle = 0.5 + 0.5 * Math.sin(bulb.phase);
            const alpha = bulb.glow * (0.3 + 0.7 * twinkle);

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(bulb.x, bulb.y, bulb.r, 0, Math.PI * 2);
            ctx.fillStyle = bulb.color;
            ctx.shadowColor = bulb.color;
            ctx.shadowBlur = bulb.r * 4;
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.globalAlpha = alpha * 0.7;
            ctx.beginPath();
            ctx.arc(bulb.x, bulb.y, bulb.r * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
            ctx.restore();
          });

          frame = window.requestAnimationFrame(animate);
        };

        animate();
      };

      const setupWord = () => {
        spawnDots();

        fetch(img.currentSrc || img.src)
          .then((response) => response.blob())
          .then((blob) => {
            objectUrl = URL.createObjectURL(blob);
            const maskImage = new window.Image();
            maskImage.crossOrigin = "anonymous";
            maskImage.onload = () => startBulbs(maskImage);
            maskImage.src = objectUrl!;
          })
          .catch(() => {
            const fallbackImage = new window.Image();
            fallbackImage.crossOrigin = "anonymous";
            fallbackImage.onload = () => startBulbs(fallbackImage);
            fallbackImage.src = img.currentSrc || img.src;
          });
      };

      if (img.complete && img.naturalWidth > 0) {
        window.setTimeout(setupWord, 100);
      } else {
        const onLoad = () => window.setTimeout(setupWord, 100);
        img.addEventListener("load", onLoad, { once: true });
        cleanups.push(() => img.removeEventListener("load", onLoad));
      }

      cleanups.push(() => {
        if (frame) window.cancelAnimationFrame(frame);
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        dotsContainer.innerHTML = "";
      });
    });

    const handleResize = () => {
      titleImageRefs.current.forEach((img, index) => {
        if (!img || !img.complete) return;
        dotContainerRefs.current[index]!.innerHTML = "";
      });
    };

    window.addEventListener("resize", handleResize);
    cleanups.push(() => window.removeEventListener("resize", handleResize));

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  // Native touch listeners with { passive: false } so preventDefault() works.
  // React's onTouchMove is passive by default — preventDefault is silently ignored,
  // causing the page to scroll while scratching. This matches the prototype approach.
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    scratchCanvases.current.forEach((canvas, index) => {
      if (!canvas) return;

      const onTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) scratchAt(index, touch.clientX, touch.clientY, false);
      };
      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) scratchAt(index, touch.clientX, touch.clientY, false);
      };
      const onTouchEnd = () => {
        checkReveal(index);
      };

      canvas.addEventListener("touchstart", onTouchStart, { passive: false });
      canvas.addEventListener("touchmove", onTouchMove, { passive: false });
      canvas.addEventListener("touchend", onTouchEnd);

      cleanups.push(() => {
        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchmove", onTouchMove);
        canvas.removeEventListener("touchend", onTouchEnd);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [scratchAt, checkReveal]);

  useEffect(() => {
    return () => {
      flipIntervals.current.forEach((interval) => {
        if (interval) window.clearInterval(interval);
      });
      fleckTimeouts.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  return (
    <>
      <main>
        <button
          className="sound-toggle"
          id="soundToggle"
          onClick={() => {
            setSoundEnabled((current) => {
              const next = !current;
              if (next) {
                window.setTimeout(() => playSound("toggle"), 0);
              }
              return next;
            });
          }}
        >
          <span className="icon" id="soundIcon">{soundEnabled ? "🔊" : "🔇"}</span>
          <span id="soundLabel">{soundEnabled ? "SOUND ON" : "SOUND OFF"}</span>
        </button>

        {isDesktop ? (
          <div
            className={`penny-cursor ${pennyVisible && !pennyHidden ? "visible" : ""}`}
            id="pennyCursor"
            style={{
              left: pennyPosition.x,
              top: pennyPosition.y,
              transform: `translate(-50%,-50%) rotate(${pennyPosition.rotation}deg)`,
            }}
          />
        ) : null}

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

        <section className="hero">
          <div className="hero-poster">
            <Image src="/images/hero-landscape.jpg" alt="Jackpot Twins - A New Comedy by Philip Riccio" width={1800} height={750} priority />
          </div>

          <div className="hero-right">
            <p className="hero-eyebrow">
              <span className="blink" />
              World Premiere &nbsp;·&nbsp; Toronto &nbsp;·&nbsp; Spring 2027
            </p>

            <div className="hero-title" aria-label="Jackpot Twins">
              {titleWords.map((word, index) => (
                <div key={word.alt} className={`title-word-wrap ${word.className}`}>
                  <img
                    ref={(node) => {
                      titleImageRefs.current[index] = node;
                    }}
                    src={word.src}
                    alt={word.alt}
                    crossOrigin="anonymous"
                  />
                  <canvas
                    ref={(node) => {
                      bulbCanvasRefs.current[index] = node;
                    }}
                    className="bulb-overlay"
                    id={index === 0 ? "bulbJackpot" : "bulbTwins"}
                  />
                  <div
                    ref={(node) => {
                      dotContainerRefs.current[index] = node;
                    }}
                    className="title-dots"
                  />
                </div>
              ))}
            </div>

            <p className="hero-byline">A New Comedy by Philip Riccio</p>
            <p className="hero-dates-inline">March 9th – March 28th, 2027</p>

            <div className="countdown-wrap">
              <p className="countdown-label">COUNTDOWN TO FIRST PERFORMANCE</p>
              <div className="countdown" id="countdown">
                {[
                  [countdown.days, "Days"],
                  [countdown.hours, "Hours"],
                  [countdown.mins, "Mins"],
                  [countdown.secs, "Secs"],
                ].map(([value, label]) => (
                  <div key={label} className="countdown-unit">
                    <span className="countdown-num">{value}</span>
                    <span className="countdown-txt">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="hero-signup-teaser">Tickets available within an Off&nbsp;Mirvish Season Subscription</p>
            <div className="cta-row" style={{ marginTop: 8, marginBottom: 28 }}>
              <a
                href="https://mirvish.com/subscriptions"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-main"
                style={{ background: "var(--black)" }}
              >
                Subscribe at Mirvish.com
              </a>
            </div>
            <p className="hero-signup-teaser">Single tickets available at a later date. Be the first to know.</p>
            <div className="cta-row" style={{ marginTop: 8 }}>
              <button
                type="button"
                className="btn-main"
                style={{ background: "var(--red)" }}
                onClick={() => {
                  setSignupStatus("idle");
                  setModalOpen(true);
                }}
              >
                Sign Me Up
              </button>
            </div>
          </div>
        </section>

        <div className="copro">
          <span className="copro-label">A Production By</span>
          <div className="copro-logos">
            <Link className="copro-ct" href="https://companytheatre.ca" target="_blank">
              <Image src="/logos/ct-logo-white.svg" alt="The Company Theatre" width={210} height={56} />
            </Link>
            <div className="copro-pipe" />
            <Link className="copro-mirvish" href="https://mirvish.com" target="_blank">
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

        <section className="scratch-section" id="cast">
          <div className="scratch-section-header">
            <h2 className="scratch-heading">Cast</h2>
            <p className="scratch-tagline">Scratch <span className="amp">&amp;</span> Reveal!</p>
            <p className="scratch-rules-title">How to Play</p>
            <p className="scratch-instructions">
              Scratch the gold to reveal each cast member
              <br />
              <button type="button" className="inline-link yellow-link" onClick={revealAll}>reveal all</button>
              &nbsp;·&nbsp;
              <button type="button" className="inline-link pink-link" onClick={resetAll}>play again</button>
            </p>
          </div>

          <div className="scratch-grid" id="scratchGrid" ref={scratchGridRef}>
            {castData.map((actor, index) => {
              const activated = activatedCards[index];
              const revealed = revealedCards[index];
              const flipped = flippedCards[index];

              return (
                <div key={actor.name} className="scratch-card-wrapper">
                  <div className={`scratch-card ${revealed ? "revealed" : ""} ${flipped ? "flipped" : ""}`} id={`scratch-${index}`}>
                    <div className="scratch-card-inner">
                      <div className="scratch-card-front">
                        <div className="scratch-card-content">
                          <div className="scratch-card-img-wrap">
                            <Image
                              src={actor.img}
                              alt={actor.name}
                              fill
                              sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 20vw"
                              style={{ objectPosition: parseObjectPosition(actor.imgStyle) }}
                            />
                          </div>
                          <div className="scratch-card-info">
                            <span className="scratch-card-name">{actor.name}</span>
                          </div>
                        </div>
                        <div className="scratch-overlay">
                          <canvas
                            ref={(node) => {
                              scratchCanvases.current[index] = node;
                            }}
                            className="scratch-canvas"
                            id={`scratchCanvas-${index}`}
                            onMouseDown={(event) => scratchAt(index, event.clientX, event.clientY, isDesktop)}
                            onMouseMove={(event) => {
                              if (event.buttons) scratchAt(index, event.clientX, event.clientY, isDesktop);
                            }}
                            onMouseUp={() => checkReveal(index)}
                            onMouseLeave={() => checkReveal(index)}
                          />
                          {/* Touch handlers registered natively via useEffect with { passive: false }
                              so preventDefault() actually blocks page scrolling during scratch */}
                        </div>
                      </div>
                      <div className="scratch-card-back">
                        <div className="scratch-card-back-name">{actor.name}</div>
                        <div className="scratch-card-back-rule" />
                        <div className="scratch-card-back-bio">{actor.bio}</div>
                      </div>
                    </div>
                  </div>
                  <button type="button" className={`flip-slot-btn ${activated ? "lit" : ""} ${flipped ? "flipped" : ""}`} onClick={() => toggleFlip(index)}>
                    {flipLabels[index]}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

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
        </section>

        <section className="signup" id="signup">
          <p className="signup-label">Subscriptions Available Now</p>
          <h2 className="signup-heading">Get Your Tickets</h2>
          <p className="signup-sub">Tickets available within an Off&nbsp;Mirvish Season Subscription.</p>
          <a
            href="https://mirvish.com/subscriptions"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-main"
            style={{ fontSize: 18, padding: "16px 44px", margin: "0 auto", background: "var(--black)", textDecoration: "none" }}
          >
            Subscribe at Mirvish.com
          </a>
          <p className="signup-single-tickets">Single tickets available at a later date.</p>
          <button
            type="button"
            className="btn-main btn-secondary"
            style={{ fontSize: 16, padding: "14px 36px", margin: "0 auto" }}
            onClick={() => {
              setSignupStatus("idle");
              setModalOpen(true);
            }}
          >
            Sign Up for Single Ticket Alerts
          </button>
        </section>

        <footer>
          <div className="footer-logos">
            <Link href="https://companytheatre.ca" target="_blank">
              <Image src="/logos/ct-logo-white.svg" alt="The Company Theatre" width={120} height={32} />
            </Link>
            <span className="footer-pipe" />
            <Link href="https://mirvish.com" target="_blank">
              <Image src="/logos/mirvish-logo-white.svg" alt="Mirvish Productions" width={146} height={20} />
            </Link>
          </div>
          <div className="footer-copy">© 2026 The Company Theatre. All rights reserved.</div>
        </footer>
      </main>

      <SignupModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSignup} status={signupStatus} />
    </>
  );
}

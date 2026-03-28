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

const castData: CastMember[] = [
  {
    name: "Seana McKenna",
    role: "Geraldine Fitzgerald",
    img: "/images/headshots/seana-mckenna.jpeg",
    imgStyle: "center 20%",
    cardIcon: "✝️",
    bio: "Seana McKenna is a recipient of the Order of Canada — do we need to say more? No. But we will anyway. A National Theatre School graduate, she has spent four decades setting the standard at Stratford, Shaw, Canadian Stage, and stages across North America, playing everything from Juliet to Julius Caesar along the way. She made history as Stratford's first female Richard III. Three Dora Awards, a Genie, a Jessie, and Honorary Doctorates later — if you saw her in Things I Know to Be True and needed a few days to recover, good news: this one's a comedy.",
  },
  {
    name: "Nora McLellan",
    role: "Bernadette Fitzgerald",
    img: "/images/headshots/nora-mclellan.jpeg",
    cardIcon: "💺",
    bio: "Nora McLellan has been one of Canadian theatre's great pleasures for over fifty years, and she shows absolutely no signs of stopping. She spent 22 seasons at the Shaw Festival and four at Stratford, trained with the legendary Uta Hagen in New York, and has four Jessie Awards and two Doras to her name. Toronto audiences know her from John at The Company Theatre — for which she won the Dora for Outstanding Performance — and as Sister Rose in CBC's Son of a Critch, a role written especially for her. She is, in every sense, a force of nature.",
  },
  {
    name: "Tony Nappo",
    role: "Peter Mallory",
    img: "/images/headshots/tony-nappo.jpg",
    imgStyle: "center 5%",
    cardIcon: "🚗",
    bio: "Tony Nappo has appeared in roughly 70 films, hundreds of TV episodes, and more Toronto stages than most people have visited. Born in Scarborough, trained at the American Academy of Dramatic Arts in Manhattan, he's the kind of actor critics describe as ‘razor-sharp’ and ‘effortlessly magnetic.’ He's appeared alongside Al Pacino, played a recurring villain in Bad Blood, voiced a gangster in Fugget About It, and wrote the beloved column Nappoholics Anonymous for Intermission Magazine. If you've watched Canadian TV in the last twenty years, you've seen him.",
  },
  {
    name: "Colin A Doyle",
    role: "Harold Bates",
    img: "/images/headshots/colin-doyle.jpg",
    imgStyle: "center 30%",
    cardIcon: "🔍",
    bio: "Colin A Doyle is a Dora Award\u2013winning, Toronto-based actor and theatre producer who has performed across Canada, the US, and Europe. A York University Acting Conservatory graduate, he has worked with some of the most inventive companies in the country \u2014 Outside the March, Canadian Stage, Obsidian Theatre, Crow\u2019s Theatre, Caravan, Coal Mine Theatre, and Mirvish \u2014 and has played everything from Peter Pan to a post-apocalyptic Homer Simpson. The range is real.",
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

function parseObjectPosition(position?: string) {
  const [x = "center", y = "center"] = (position ?? "center center").split(" ");
  return `${x} ${y}`;
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
    <div className={`signup-modal ${open ? "show" : ""}`}>
      <div className="signup-modal-backdrop" onClick={onClose} />
      <div className="signup-modal-card">
        <button className="signup-modal-close" onClick={onClose} aria-label="Close signup form">
          &times;
        </button>
        <p className="signup-modal-title">Be the first to know when tickets go on sale</p>
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
              <p style={{ fontFamily: "var(--font-nunito)", fontSize: 13, color: "var(--red)", textAlign: "center" }}>
                We couldn&apos;t submit right now, but the CRM POST handler is wired and ready.
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [countdown, setCountdown] = useState({ days: "---", hours: "--", mins: "--", secs: "--" });
  const [modalOpen, setModalOpen] = useState(false);
  const [signupStatus, setSignupStatus] = useState<SignupState>("idle");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [revealedCards, setRevealedCards] = useState<boolean[]>(() => castData.map(() => false));
  const [flippedCards, setFlippedCards] = useState<boolean[]>(() => castData.map(() => false));
  const [desktopScratchActive, setDesktopScratchActive] = useState(false);
  const [pennyVisible, setPennyVisible] = useState(false);
  const [pennyPosition, setPennyPosition] = useState({ x: 0, y: 0, rotation: -15 });
  const [pennyHidden, setPennyHidden] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [flipLabels, setFlipLabels] = useState<string[]>(() => castData.map(() => "PLAY"));

  const scratchCanvases = useRef<(HTMLCanvasElement | null)[]>([]);
  const bulbCanvases = useRef<(HTMLCanvasElement | null)[]>([]);
  const titleImages = useRef<(HTMLImageElement | null)[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const fleckTimeouts = useRef<number[]>([]);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const flipIntervals = useRef<(number | null)[]>(castData.map(() => null));
  const scratchProgress = useRef<number[]>(castData.map(() => 0));

  const allTickerItems = useMemo(() => [...tickerItems, ...tickerItems], []);

  const playSound = useCallback(
    (type: SoundType) => {
      if (!soundEnabled || typeof window === "undefined") return;
      const Ctx = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      if (!audioContextRef.current) audioContextRef.current = new Ctx();

      const audioCtx = audioContextRef.current;
      if (audioCtx.state === "suspended") {
        void audioCtx.resume();
      }

      const createVoice = (freq: number, start: number, stop: number, typeName: OscillatorType, gainValue: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = typeName;
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
        [523, 659, 784, 1047].forEach((freq, index) => createVoice(freq, now + index * 0.08, now + index * 0.08 + 0.18, "sine", 0.08));
      } else if (type === "flip") {
        createVoice(880, now, now + 0.14, "sine", 0.05);
        createVoice(660, now + 0.03, now + 0.16, "sine", 0.035);
      } else if (type === "toggle") {
        createVoice(440, now, now + 0.16, "sine", 0.04);
      } else if (type === "signup") {
        [523, 659, 784, 1047, 784, 1047].forEach((freq, index) =>
          createVoice(freq, now + index * 0.1, now + index * 0.1 + 0.12, "sine", 0.06),
        );
      }
    },
    [soundEnabled],
  );

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

  const updateRevealState = useCallback(
    (index: number, shouldPlaySound: boolean) => {
      setRevealedCards((current) => {
        if (current[index]) return current;
        const next = [...current];
        next[index] = true;
        return next;
      });
      startFlipRotation(index);
      if (shouldPlaySound) playSound("reveal");
    },
    [playSound, startFlipRotation],
  );

  const drawScratchCard = useCallback((index: number) => {
    const canvas = scratchCanvases.current[index];
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;
    const icon = castData[index]?.cardIcon ?? "🎰";

    const goldGrad = ctx.createLinearGradient(0, 0, w, h);
    goldGrad.addColorStop(0, "#B8860B");
    goldGrad.addColorStop(0.15, "#D4A017");
    goldGrad.addColorStop(0.3, "#F5D020");
    goldGrad.addColorStop(0.45, "#FFEA70");
    goldGrad.addColorStop(0.55, "#F5D020");
    goldGrad.addColorStop(0.7, "#D4A017");
    goldGrad.addColorStop(0.85, "#F5D020");
    goldGrad.addColorStop(1, "#B8860B");

    ctx.clearRect(0, 0, w, h);
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
    const corners = [
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
    ctx.font = `bold ${Math.min(w / 5, 28)}px var(--font-bebas-neue), sans-serif`;
    ctx.fillStyle = "#C0C0C0";
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 1;
    ctx.fillText("JACKPOT TWINS", w / 2, h * 0.16);
    ctx.shadowBlur = 0;

    ctx.font = `${Math.min(w / 3, 56)}px sans-serif`;
    ctx.filter = "grayscale(100%) brightness(1.5)";
    ctx.fillText(icon, w / 2, h * 0.46);
    ctx.filter = "none";

    ctx.font = `bold ${Math.min(w / 6, 20)}px var(--font-luckiest-guy), cursive`;
    ctx.fillStyle = "#C0C0C0";
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 2;
    ctx.fillText("SCRATCH ME", w / 2, h * 0.7);
    ctx.shadowBlur = 0;

    ctx.font = `${Math.min(w / 8, 14)}px sans-serif`;
    ctx.fillStyle = "#B0B0B0";
    ctx.fillText("★ ★ ★ ★ ★", w / 2, h * 0.85);
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

  const scratchAt = useCallback(
    (index: number, clientX: number, clientY: number, createFlecks: boolean) => {
      const canvas = scratchCanvases.current[index];
      if (!canvas || revealedCards[index] || flippedCards[index]) return;
      const rect = canvas.getBoundingClientRect();
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      scratchProgress.current[index] += 1;

      if (createFlecks) {
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
      }

      if (scratchProgress.current[index] > 20 && scratchProgress.current[index] % 5 === 0) {
        const pct = computeRevealPct(canvas);
        if (pct > 0.35) updateRevealState(index, true);
      }
    },
    [computeRevealPct, flippedCards, revealedCards, updateRevealState],
  );

  const revealAll = useCallback(() => {
    setRevealedCards(castData.map(() => true));
    setFlippedCards(castData.map(() => false));
    castData.forEach((_, index) => startFlipRotation(index));
    playSound("reveal");
  }, [playSound, startFlipRotation]);

  const resetAll = useCallback(() => {
    setRevealedCards(castData.map(() => false));
    setFlippedCards(castData.map(() => false));
    setFlipLabels(castData.map(() => "PLAY"));
    scratchProgress.current = castData.map(() => 0);
    flipIntervals.current.forEach((interval) => {
      if (interval) window.clearInterval(interval);
    });
    flipIntervals.current = castData.map(() => null);
    window.requestAnimationFrame(() => {
      castData.forEach((_, index) => drawScratchCard(index));
    });
    playSound("toggle");
  }, [drawScratchCard, playSound]);

  const toggleFlip = useCallback(
    (index: number) => {
      if (!revealedCards[index]) return;
      setFlippedCards((current) => {
        const next = [...current];
        next[index] = !next[index];
        return next;
      });
      if (flippedCards[index]) {
        startFlipRotation(index);
      } else {
        stopFlipRotation(index, "BACK");
      }
      playSound("flip");
    },
    [flippedCards, playSound, revealedCards, startFlipRotation, stopFlipRotation],
  );

  const handleSignup = useCallback(
    async (formData: FormData) => {
      setSignupStatus("submitting");
      const payload = {
        firstName: String(formData.get("firstName") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
        email: String(formData.get("email") ?? ""),
        source: "jackpottwins.ca interest form",
      };

      try {
        await fetch("https://crm.companytheatre.ca/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          mode: "cors",
        });
        setSignupStatus("success");
        playSound("signup");
      } catch {
        setSignupStatus("error");
      }
    },
    [playSound],
  );

  useEffect(() => {
    const updateCountdown = () => {
      const diff = countdownTarget.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown({ days: "0", hours: "0", mins: "0", secs: "0" });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({
        days: String(days),
        hours: String(hours).padStart(2, "0"),
        mins: String(mins).padStart(2, "0"),
        secs: String(secs).padStart(2, "0"),
      });
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateMode = () => setIsDesktop(mediaQuery.matches);
    updateMode();
    mediaQuery.addEventListener("change", updateMode);
    return () => mediaQuery.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    const redraw = () => castData.forEach((_, index) => drawScratchCard(index));
    redraw();
    window.addEventListener("resize", redraw);
    return () => window.removeEventListener("resize", redraw);
  }, [drawScratchCard]);

  useEffect(() => {
    revealedCards.forEach((revealed, index) => {
      if (!revealed && !flippedCards[index]) {
        stopFlipRotation(index, "PLAY");
      }
    });
  }, [flippedCards, revealedCards, stopFlipRotation]);

  useEffect(() => {
    const pairs = [0, 1];
    const cleanups: Array<() => void> = [];

    pairs.forEach((index) => {
      const canvas = bulbCanvases.current[index];
      const img = titleImages.current[index];
      if (!canvas || !img) return;

      let frame = 0;
      const setupWord = () => {
        const rect = img.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const dpr = window.devicePixelRatio || 1;
        const w = rect.width;
        const h = rect.height;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
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
        maskCtx.drawImage(img, 0, 0, w, h);
        const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;

        const isInLetter = (x: number, y: number) => {
          const px = Math.floor(x);
          const py = Math.floor(y);
          if (px < 0 || px >= maskCanvas.width || py < 0 || py >= maskCanvas.height) return false;
          const pixelIndex = (py * maskCanvas.width + px) * 4;
          return maskData[pixelIndex + 3] > 100;
        };

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
          const colors = ["#F5D020", "#FFEB3B", "#FFD700", "#FFF8DC", "#FFFFFF", "#F5D020", "#FFD700"];
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

      if (img.complete) setupWord();
      else img.onload = setupWord;

      cleanups.push(() => {
        if (frame) window.cancelAnimationFrame(frame);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setPennyVisible(false);
      setPennyHidden(false);
      return;
    }

    let scratching = false;

    const handleMouseMove = (event: MouseEvent) => {
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
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

      if (scratching) {
        castData.forEach((_, index) => scratchAt(index, event.clientX, event.clientY, true));
      }
    };

    const handleMouseDown = () => {
      scratching = true;
      setDesktopScratchActive(true);
    };

    const handleMouseUp = () => {
      scratching = false;
      setDesktopScratchActive(false);
      scratchCanvases.current.forEach((canvas, index) => {
        if (!canvas || revealedCards[index]) return;
        const pct = computeRevealPct(canvas);
        if (pct > 0.35) updateRevealState(index, true);
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [computeRevealPct, isDesktop, revealedCards, scratchAt, updateRevealState]);

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
        <button className="sound-toggle" onClick={() => {
          setSoundEnabled((current) => !current);
          setTimeout(() => playSound("toggle"), 0);
        }}>
          <span className="icon">{soundEnabled ? "🔊" : "🔇"}</span>
          <span>{soundEnabled ? "SOUND ON" : "SOUND OFF"}</span>
        </button>

        {isDesktop ? (
          <div
            className={`penny-cursor ${pennyVisible && !pennyHidden ? "visible" : ""}`}
            style={{ left: pennyPosition.x, top: pennyPosition.y, transform: `translate(-50%,-50%) rotate(${pennyPosition.rotation}deg)` }}
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
              <div className="title-word-wrap jackpot">
                <Image
                  ref={(node) => {
                    titleImages.current[0] = node;
                  }}
                  src="/images/title-jackpot.png"
                  alt="JACKPOT"
                  width={520}
                  height={162}
                  unoptimized
                />
                <canvas
                  ref={(node) => {
                    bulbCanvases.current[0] = node;
                  }}
                  className="bulb-overlay"
                />
              </div>
              <div className="title-word-wrap twins">
                <Image
                  ref={(node) => {
                    titleImages.current[1] = node;
                  }}
                  src="/images/title-twins.png"
                  alt="TWINS"
                  width={380}
                  height={118}
                  unoptimized
                />
                <canvas
                  ref={(node) => {
                    bulbCanvases.current[1] = node;
                  }}
                  className="bulb-overlay"
                />
              </div>
            </div>

            <p className="hero-byline">A New Comedy by Philip Riccio</p>
            <p className="hero-dates-inline">March 9th – March 28th, 2027</p>

            <div className="countdown-wrap">
              <p className="countdown-label">COUNTDOWN TO FIRST PERFORMANCE</p>
              <div className="countdown">
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

            <p className="hero-signup-teaser">Be the first to know when tickets go on sale</p>
            <div className="cta-row">
              <button
                className="btn-main"
                style={{ background: "var(--black)" }}
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
            <p>
              For the Fitzgeralds, a third grand prize isn&apos;t a miracle — it&apos;s a cosmic catastrophe. Suddenly,
              their quiet bungalow is a magnet for opportunistic lovers, estranged daughters, and a relentless lottery
              investigator who suspects their &ldquo;luck&rdquo; is a crime.
            </p>
            <p>
              Between dodging the local press and punching the clock at the snack factory, the sisters must survive the
              absurdity of their own impossible fortune. As the oversized cheques pile up, they realize that beating the
              odds was the easy part. The real adventure is figuring out who you are when you finally have nothing left
              to wish for.
            </p>
            <p>
              Canadian theatre legends <em>Seana McKenna</em> and <em>Nora McLellan</em> lead an all-star cast in <em>Jackpot Twins</em> —
              a sharp-witted, irreverent new comedy about the heavy price of getting everything you ever wanted.
              Hilarious, high-stakes, and surprisingly heartfelt. <em>Jackpot Twins</em> reunites Mirvish and The Company
              Theatre for the first time since <em>Things I Know to be True</em> in 2023.
            </p>
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
              <button type="button" className="inline-link yellow-link" onClick={revealAll}>
                reveal all
              </button>
              &nbsp;·&nbsp;
              <button type="button" className="inline-link pink-link" onClick={resetAll}>
                play again
              </button>
            </p>
          </div>

          <div className="scratch-grid" ref={gridRef}>
            {castData.map((actor, index) => {
              const lit = revealedCards[index];
              const flipped = flippedCards[index];
              return (
                <div className="scratch-card-wrapper" key={actor.name}>
                  <div className={`scratch-card ${lit ? "revealed" : ""} ${flipped ? "flipped" : ""}`}>
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
                            onMouseDown={(event) => {
                              if (!isDesktop) scratchAt(index, event.clientX, event.clientY, false);
                            }}
                            onMouseMove={(event) => {
                              if (!isDesktop && event.buttons) scratchAt(index, event.clientX, event.clientY, false);
                            }}
                            onTouchStart={(event) => {
                              const touch = event.touches[0];
                              if (touch) scratchAt(index, touch.clientX, touch.clientY, false);
                            }}
                            onTouchMove={(event) => {
                              const touch = event.touches[0];
                              if (touch) scratchAt(index, touch.clientX, touch.clientY, false);
                            }}
                          />
                        </div>
                      </div>
                      <div className="scratch-card-back">
                        <div className="scratch-card-back-name">{actor.name}</div>
                        <div className="scratch-card-back-rule" />
                        <div className="scratch-card-back-bio">{actor.bio}</div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`flip-slot-btn ${lit ? "lit" : ""} ${flipped ? "flipped" : ""}`}
                    onClick={() => toggleFlip(index)}
                  >
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
              <li className="creative-item" key={item.role}>
                <span className="creative-role">{item.role}</span>
                <span className="creative-person">{item.person}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="signup" id="signup">
          <p className="signup-label">Stay in the Loop</p>
          <h2 className="signup-heading">Be First to Know</h2>
          <p className="signup-sub">Get ticket announcements and behind-the-scenes updates.</p>
          <button
            className="btn-main"
            style={{ fontSize: 18, padding: "16px 44px", margin: "0 auto", background: "var(--black)" }}
            onClick={() => {
              setSignupStatus("idle");
              setModalOpen(true);
            }}
          >
            Sign Me Up
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

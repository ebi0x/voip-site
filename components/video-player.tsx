"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const HIDE_DELAY = 2200;
const CLOSE_DURATION = 650;

type PlayerPosition = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function fmt(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");

  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${secs}`
    : `${minutes}:${secs}`;
}

export function VideoPlayer({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const hideTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const draggingRef = useRef(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  const previousOverflow = useRef<string>("");
  const closeCinemaRef = useRef<() => void>(() => {});

  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<PlayerPosition>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [entered, setEntered] = useState(false);
  const [paused, setPaused] = useState(true);
  const [ended, setEnded] = useState(false);
  const [showUi, setShowUi] = useState(true);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const isCinemaTarget = open && !closing;
  const controlsVisible = showUi || paused || ended || closing;

  // The portal host is created once. The video element always remains inside
  // this same portal, so opening/closing cinema mode never remounts <video>.
  useEffect(() => {
    const host = document.createElement("div");
    host.dataset.daalVideoPortal = "true";
    document.body.appendChild(host);
    setPortalHost(host);

    return () => {
      window.clearTimeout(hideTimer.current);
      window.clearTimeout(closeTimer.current);
      host.remove();
    };
  }, []);

  const measurePlaceholder = useCallback(() => {
    const element = placeholderRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const inset = 4;

    setPosition({
      top: rect.top + inset,
      left: rect.left + inset,
      width: Math.max(0, rect.width - inset * 2),
      height: Math.max(0, rect.height - inset * 2),
    });
  }, []);

  // Keep the normal-mode portal player aligned with its in-flow placeholder.
  useEffect(() => {
    if (!portalHost) return;

    measurePlaceholder();
    const onScroll = () => measurePlaceholder();
    const onResize = () => measurePlaceholder();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    const observer = new ResizeObserver(measurePlaceholder);
    if (placeholderRef.current) observer.observe(placeholderRef.current);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [portalHost, measurePlaceholder]);

  // Lock page scrolling while the cinematic layer is open.
  useEffect(() => {
    if (!open) return;

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCinemaRef.current();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow.current;
      document.removeEventListener("keydown", onKeyDown);
    };
    // closeCinema is intentionally a stable event-style function using refs/state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const clearHideTimer = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = undefined;
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimer.current = window.setTimeout(() => {
      const video = videoRef.current;
      if (video && !video.paused && !video.ended && !draggingRef.current) {
        setShowUi(false);
      }
    }, HIDE_DELAY);
  }, [clearHideTimer]);

  const syncFromVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    setPaused(video.paused);
    setEnded(video.ended);
    setCurrent(video.currentTime || 0);
    setDuration(
      Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0,
    );
    setMuted(video.muted);
  }, []);

  // All displayed playback/time state is read from the one real video element.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      // Read the real media element as soon as playback begins. This also
      // initializes duration/currentTime if metadata arrived before the listener.
      syncFromVideo();
      setPaused(false);
      setEnded(false);
      setShowUi(true);
      scheduleHide();
    };

    const onPause = () => {
      syncFromVideo();
      clearHideTimer();
      setShowUi(true);
    };

    const onEnded = () => {
      // ended fires on the same persistent <video>; snapshot its final state first.
      syncFromVideo();
      setPaused(true);
      setEnded(true);
      setShowUi(true);
      clearHideTimer();
      closeCinemaRef.current();
    };

    const onVolumeChange = () => setMuted(video.muted);

    video.addEventListener("loadedmetadata", syncFromVideo);
    video.addEventListener("durationchange", syncFromVideo);
    video.addEventListener("timeupdate", syncFromVideo);
    video.addEventListener("seeking", syncFromVideo);
    video.addEventListener("seeked", syncFromVideo);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("volumechange", onVolumeChange);

    // Handles metadata that may have loaded before listeners were attached.
    syncFromVideo();

    return () => {
      video.removeEventListener("loadedmetadata", syncFromVideo);
      video.removeEventListener("durationchange", syncFromVideo);
      video.removeEventListener("timeupdate", syncFromVideo);
      video.removeEventListener("seeking", syncFromVideo);
      video.removeEventListener("seeked", syncFromVideo);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("volumechange", onVolumeChange);
      clearHideTimer();
    };
  // portalHost is essential here: the <video> element does not exist until
  // the portal is mounted. Without this dependency, the first effect run sees
  // videoRef.current === null and NEVER attaches the media event listeners.
  }, [portalHost, clearHideTimer, scheduleHide, syncFromVideo]);

  const playVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.ended) video.currentTime = 0;
      await video.play();
    } catch (error) {
      // Do not fake a playing state if the browser rejects playback.
      setPaused(true);
      setShowUi(true);
      console.error("DAAL OPS video playback failed:", error);
    }
  }, []);

  const togglePlay = useCallback(
    (event?: ReactMouseEvent) => {
      event?.stopPropagation();
      const video = videoRef.current;
      if (!video) return;

      if (video.paused || video.ended) {
        void playVideo();
      } else {
        video.pause();
      }
    },
    [playVideo],
  );

  const openCinema = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    clearHideTimer();

    const video = videoRef.current;
    setEnded(false);
    setShowUi(true);
    setClosing(false);
    setEntered(false);
    setOpen(true);

    // Start playback directly in the user's click handler (not in RAF),
    // so browsers do not reject it as a delayed autoplay request.
    if (video) {
      if (video.ended) video.currentTime = 0;
      void playVideo();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
  }, [clearHideTimer, playVideo]);

  const closeCinema = useCallback(() => {
    const video = videoRef.current;
    if (!open && !closing) return;

    clearHideTimer();
    if (video && !video.paused) video.pause();

    setShowUi(true);
    setClosing(true);
    setEntered(false);

    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      if (video) {
        try {
          video.currentTime = 0;
        } catch {
          // Metadata may not be available yet.
        }
      }
      setCurrent(0);
      setEnded(false);
      setPaused(true);
    }, CLOSE_DURATION);
  }, [clearHideTimer, closing, open]);

  closeCinemaRef.current = closeCinema;

  const wake = useCallback(() => {
    setShowUi(true);
    clearHideTimer();

    const video = videoRef.current;
    if (video && !video.paused && !video.ended && !draggingRef.current) {
      scheduleHide();
    }
  }, [clearHideTimer, scheduleHide]);

  const hideAfterPointerLeaves = useCallback(() => {
    clearHideTimer();
    const video = videoRef.current;

    if (video && !video.paused && !video.ended && !draggingRef.current) {
      hideTimer.current = window.setTimeout(() => setShowUi(false), 250);
    }
  }, [clearHideTimer]);

  const toggleMute = useCallback((event: ReactMouseEvent) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  }, []);

  const seekTo = useCallback((clientX: number) => {
    const video = videoRef.current;
    const bar = barRef.current;
    if (!video || !bar || !Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }

    const rect = bar.getBoundingClientRect();
    if (rect.width <= 0) return;

    // Explicit LTR timeline: progress starts at the left, independent of page RTL.
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const nextTime = ratio * video.duration;
    video.currentTime = nextTime;
    setCurrent(nextTime);
  }, []);

  const onBarDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
      draggingRef.current = true;
      clearHideTimer();
      setShowUi(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      seekTo(event.clientX);
    },
    [clearHideTimer, seekTo],
  );

  const onBarMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (draggingRef.current) seekTo(event.clientX);
    },
    [seekTo],
  );

  const onBarUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      syncFromVideo();
      wake();
    },
    [syncFromVideo, wake],
  );

  const progress =
    duration > 0
      ? Math.min(100, Math.max(0, (current / duration) * 100))
      : 0;

  const normalMode = !open;
  const playerStyle: CSSProperties = {
    position: "fixed",
    top: isCinemaTarget ? "50%" : `${position.top}px`,
    left: isCinemaTarget ? "50%" : `${position.left}px`,
    width: isCinemaTarget
      ? "min(92vw, 1100px, calc((100dvh - 32px) * 16 / 9))"
      : `${position.width}px`,
    height: isCinemaTarget ? "auto" : `${position.height}px`,
    aspectRatio: "16 / 9",
    maxHeight: isCinemaTarget ? "calc(100dvh - 32px)" : undefined,
    maxWidth: isCinemaTarget ? "calc(100vw - 32px)" : undefined,
    transform: isCinemaTarget
      ? `translate(-50%, -50%) scale(${entered ? 1 : 0.86})`
      : "none",
    transformOrigin: "center center",
    opacity: isCinemaTarget ? (entered ? 1 : 0) : 1,
    zIndex: open ? 210 : 1,
    pointerEvents: "auto",
    transition:
      open || closing
        ? `top 600ms ${EASE}, left 600ms ${EASE}, width 600ms ${EASE}, height 600ms ${EASE}, transform 600ms ${EASE}, opacity 500ms ease`
        : "none",
    visibility:
      normalMode && position.width <= 0 ? "hidden" : "visible",
  };

  const frame = (
    <div
      onMouseMove={wake}
      onMouseEnter={wake}
      onMouseLeave={hideAfterPointerLeaves}
      onTouchStart={wake}
      className="group relative h-full w-full overflow-hidden rounded-[24px] border border-[var(--accent-2)]/40 bg-black shadow-[0_30px_70px_-25px_var(--shadow)]"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        aria-label={title}
        onClick={() => togglePlay()}
        className="block h-full w-full cursor-pointer bg-black object-contain"
      />

      {paused && !open && (
        <button
          type="button"
          onClick={openCinema}
          aria-label="پخش ویدیو با صدا"
          className="absolute inset-0 flex items-center justify-center bg-black/10 transition hover:bg-black/25"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--cta-a)] to-[var(--accent)] text-white shadow-[0_0_50px_-6px_var(--accent-2)]">
            <svg viewBox="0 0 24 24" className="ms-1 h-8 w-8" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-3 pt-10 transition-transform duration-[350ms] ease-out motion-reduce:transition-none ${
          controlsVisible ? "translate-y-0" : "translate-y-full"
        }`}
        onMouseMove={(event) => {
          event.stopPropagation();
          wake();
        }}
        onMouseEnter={wake}
      >
        <div
          ref={barRef}
          dir="ltr"
          role="slider"
          tabIndex={0}
          aria-label="نوار پیشرفت"
          aria-valuemin={0}
          aria-valuemax={duration || 0}
          aria-valuenow={current}
          onPointerDown={onBarDown}
          onPointerMove={onBarMove}
          onPointerUp={onBarUp}
          onPointerCancel={onBarUp}
          onLostPointerCapture={() => {
            if (draggingRef.current) {
              draggingRef.current = false;
              wake();
            }
          }}
          onKeyDown={(event) => {
            const video = videoRef.current;
            if (!video || !Number.isFinite(video.duration)) return;
            if (event.key === "ArrowRight") video.currentTime = Math.min(video.duration, video.currentTime + 5);
            if (event.key === "ArrowLeft") video.currentTime = Math.max(0, video.currentTime - 5);
          }}
          className="relative h-3 w-full cursor-pointer touch-none select-none"
        >
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/25" />
          <div
            className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] shadow-[0_0_10px_var(--accent-2)]"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_var(--accent-2)]"
            style={{ left: `clamp(0px, calc(${progress}% - 6px), calc(100% - 12px))` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(event) => togglePlay(event)}
              aria-label={paused ? "پخش" : "توقف"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--cta-a)] to-[var(--accent)]"
            >
              {paused ? (
                <svg viewBox="0 0 24 24" className="ms-0.5 h-4 w-4" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "روشن کردن صدا" : "بی‌صدا"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M4 9h4l5-4v14l-5-4H4z" />
                {muted ? (
                  <path d="M17 9l4 6M21 9l-4 6" />
                ) : (
                  <path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14" />
                )}
              </svg>
            </button>

            <span dir="ltr" className="ms-2 font-mono text-xs tabular-nums text-white/80">
              {fmt(current)} / {fmt(duration)}
            </span>
          </div>

          {open ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                closeCinema();
              }}
              className="inline-flex h-9 items-center rounded-full bg-white/10 px-4 text-xs transition hover:bg-white/20"
            >
              بستن
            </button>
          ) : (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openCinema();
              }}
              aria-label="بزرگ‌نمایی"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const portalContent = portalHost
    ? createPortal(
        <>
          {open && (
            <div
              aria-hidden="true"
              onClick={closeCinema}
              className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-md transition-opacity duration-500"
              style={{ opacity: isCinemaTarget && entered ? 1 : 0 }}
            />
          )}
          <div style={playerStyle}>{frame}</div>
        </>,
        portalHost,
      )
    : null;

  return (
    <>
      <div
        ref={placeholderRef}
        className="relative aspect-video w-full p-1"
        aria-hidden="true"
      />
      {portalContent}
    </>
  );
}

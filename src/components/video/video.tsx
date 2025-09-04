import { useEffect, useRef, useState } from "preact/compat";
import { VastInformation } from "../../services/vast-model";
import { ControlBar } from "../control-bar/control-bar";
import { FallbackImage } from "../fallback-image/fallback-image";
import { EventsHandler, sendBeacon } from "../../services/events-handler";
import { setupAdVerification } from "../../services/omid-js/omid-verification";
import { ClosedCaption } from "../closed-caption/closed-caption";
import { selectVideo, getCueText } from "../../services/video-utils";
import { ClosedCaptionRender } from "../closed-caption/closed-caption-render";

export interface VideoOptions {
  altText: string;
  fallbackImage?: FallbackImageProps;
  maxVolume?: number;
  ccButtonLabel?: string;
  sessionClientUrl?: string;
  omWebUrl?: string;
  targetDimensions?: {
    width: number;
    height: number;
  };
}

export interface FallbackImageProps {
  src: string;
  optionalVideoRedirectUrl: string;
  optionalRedirectTarget: string;
}

interface VideoProps {
  options: VideoOptions;
  vastInformation: VastInformation;
}

export function Video(props: VideoProps) {
  const { vastInformation, options } = props;
  const { mediaFiles } = vastInformation;
  const {
    fallbackImage,
    altText,
    maxVolume,
    targetDimensions,
    ccButtonLabel,
    sessionClientUrl,
    omWebUrl,
  } = options;
  const selectedVideo = selectVideo({ mediaFiles, targetDimensions });

  const vidRef = useRef<HTMLVideoElement>(null);
  const eventsRef = useRef<EventsHandler>(null);
  
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isCcActive, setIsCcActive] = useState(true);
  const [ccContent, setCcContent] = useState<string | null>(null);
  
  const onClickMute = () => {
    setIsMuted(prev => {
      if (prev) {
        eventsRef.current?.mute();
      } else {
        eventsRef.current?.unmute(maxVolume || 1);
      }

      return !prev;
    });
  };

  const handleTimeUpdate = (event: Event) => {
    if (isBuffering) {
      setIsBuffering(false);
      eventsRef.current?.bufferFinish();
    }

    const target = event.target as HTMLVideoElement;
    eventsRef.current?.setTime(
      target.currentTime,
      target.duration,
      target.volume
    );
  };

  const handleTimeEnded = () => {
    eventsRef.current?.loop();
    vidRef.current?.play();
  };

  const handleClick = () => {
    if (vastInformation.clickThroughUrl) {
      sendBeacon(vastInformation.beacons.clickThrough);
      window.open(vastInformation.clickThroughUrl, "_self");
    } else {
      if (isPlaying) {
        vidRef.current!.pause();
      } else {
        vidRef.current!.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const registerVideoInViewportObserver = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (let i = 0; i < entries.length; i++) {
          let entry = entries[i];
          let isVisible = entry.isIntersecting;

          if (isVisible && !isPlaying) {
            vidRef.current!.play();
            setIsPlaying(true);
          } else if (!isVisible && isPlaying) {
            vidRef.current!.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(vidRef.current!);
  };

  const registerAdVerification = async () => {
    const adVerification = await setupAdVerification(
      vastInformation,
      sessionClientUrl || "",
      omWebUrl || "",
    );
    
    if (adVerification === null) {
      eventsRef.current = new EventsHandler(vastInformation, null);
      return;
    }

    const { onAdLoaded, setVideoContext, mediaEvents } = adVerification;
    eventsRef.current = new EventsHandler(vastInformation, mediaEvents);
    setVideoContext(vidRef.current!);

    vidRef.current!.addEventListener("canplay", onAdLoaded, { once: true });
  };

  useEffect(() => {
    async function loadVerificationAndPlay() {      
      await registerAdVerification();
      registerVideoInViewportObserver();
      initializeClosedCaptionState();
      registerKeyboardControl();
    }
    
    loadVerificationAndPlay();
  }, []);

  const onClickPlayPause = () => {
    setIsPlaying(prev => {
      if (prev) {
        vidRef.current!.pause();
        eventsRef.current?.pause();
      } else {
        vidRef.current!.play();
        eventsRef.current?.play();
      }
      return !prev;
    });
  };

  const handleWaiting = () => {
    setIsBuffering(true);
    eventsRef.current?.bufferStart();
  };

  const onClickCcButton = () => {
    setIsCcActive(prev => {
      const next = !prev;

      const textTrack = vidRef.current?.textTracks?.[0];
      setCcContent(getCueText(textTrack));

      return next;
    });
  };

  const initializeClosedCaptionState = () => {    
    setIsCcActive(!!selectedVideo.closedCaptionFile);
  };

  const getVideoContainer = (): HTMLElement | null => 
    vidRef.current?.parentElement ?? null;

  const isFocusInside = (container: HTMLElement | null, ae: Element | null) =>
    !!container && !!ae && (container === ae || container.contains(ae));

  const registerKeyboardControl = () => {
    const container = getVideoContainer();
    if (!container) return;
    container.addEventListener("keydown", handleKeyDown);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const container = getVideoContainer();
    const ae = document.activeElement;

    // Only act when focus is inside the video container; let Tab proceed.
    if (!isFocusInside(container, ae) || e.key === "Tab") return;

    // Normalize key values
    const key = e.code || e.key;               // 'Space', 'KeyM', 'KeyC', etc.
    const keyLower = (e.key || "").toLowerCase(); // ' ', 'm', 'c', etc.

    // Spacebar: only when the <video> itself is focused
    if (ae === vidRef.current && (key === "Space" || e.key === " ")) {
      e.preventDefault();
      onClickPlayPause();
      return;
    }

    // M: mute/unmute (container or any child focused)
    if (key === "KeyM" || keyLower === "m") {
      e.preventDefault();
      onClickMute();
      return;
    }

    // C: toggle captions (container or any child focused)
    if (key === "KeyC" || keyLower === "c") {
      e.preventDefault();
      onClickCcButton();
      return;
    }
  };

  return (
    <div class="rm-video-player-container">
      <video
        ref={vidRef}
        class="rm-ad-player"
        muted={isMuted}
        playsInline        
        webkit-playsInline
        disablePictureInPicture
        aria-label={altText}       
        src={selectedVideo.mediaUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTimeEnded}
        onClick={handleClick}
        onWaiting={handleWaiting}
        data-testid="video-element"
        volume={maxVolume}
        tabIndex={0}
      >
        {fallbackImage?.src &&
          fallbackImage?.optionalVideoRedirectUrl &&
          fallbackImage?.optionalRedirectTarget && (
            <FallbackImage
              fallbackImage={fallbackImage?.src}
              optionalVideoRedirectUrl={fallbackImage?.optionalVideoRedirectUrl}
              optionalRedirectTarget={fallbackImage?.optionalRedirectTarget}
            />
          )}
        <ClosedCaption
          closedCaptionFile={selectedVideo.closedCaptionFile}
          closedCaptionLanguage={selectedVideo.closedCaptionLanguage}
          setCcContent={setCcContent}
        />
      </video>
      <ControlBar
        onClickPlayPause={onClickPlayPause}
        onClickMute={onClickMute}
        isMuted={isMuted}
        isPlaying={isPlaying}
        ccButtonLabel={ccButtonLabel}
        onClickCcButton={onClickCcButton}
        isCcActive={isCcActive}
      />
      <ClosedCaptionRender        
        isCcActive={isCcActive}
        content={ccContent}
      />
    </div>
  );
}

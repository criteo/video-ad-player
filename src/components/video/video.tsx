import { useEffect, useRef, useState } from "preact/compat";
import { VastInformation } from "../../services/vast-model";
import { ControlBar } from "../control-bar/control-bar";
import { EventsHandler, sendBeacon } from "../../services/events-handler";
import { setupAdVerification } from "../../services/omid-js/omid-verification";
import { ClosedCaption } from "../closed-caption/closed-caption";
import { selectVideo, getCueText } from "../../services/video-utils";
import { ClosedCaptionRender } from "../closed-caption/closed-caption-render";


export interface VideoErrorInfo {
  /** Where the error originated: VAST loading/parsing or <video> runtime failure. */
  source: "vast" | "video" | "elementId";
  /** The failing element (null for VAST errors). */
  element: HTMLElement | null;
  /** VAST URL or media file URL that failed. */
  src?: string;
  /** Human-readable description of the error. */
  message: string;
  /** Raw native event or thrown error for debugging. */
  nativeEvent?: Event | unknown;
}

export interface VideoOptions {
  /** A short, descriptive text alternative for the video content. */
  altText: string;
  /** Sets the maximum allowed volume level for playback (range: 0–1). Default is 1 */
  maxVolume?: number;
  /** Custom label for the Closed Caption (CC) button in the player UI. */
  ccButtonLabel?: string;
  /** URL for loading the OMID Session Client, required for OM SDK viewability measurement. */
  sessionClientUrl?: string;
  /** URL of the OM Web Verification script, used for OMID ad verification integrations. */
  omWebUrl?: string;
  /** Specifies the intended target width and height for video selection. The player automatically selects the closest matching video file based on these dimensions. */
  targetDimensions?: {
    width: number;
    height: number;
  };
   /** Optional callback invoked when the video fails to load or errors out. */
  onError?: (info: VideoErrorInfo) => void;
}

interface VideoProps {
  /** Configuration options for the video player including accessibility, dimensions, and OMID settings. */
  options: VideoOptions;
  /** Parsed VAST information containing media files, beacons, and ad metadata. */
  vastInformation: VastInformation;
}

export function Video(props: VideoProps) {
  const { vastInformation, options } = props;
  const { mediaFiles } = vastInformation;
  const {
    altText,
    maxVolume,
    targetDimensions,
    ccButtonLabel,
    sessionClientUrl,
    omWebUrl,
    onError,
  } = options;
  const selectedVideo = selectVideo({ mediaFiles, targetDimensions });

  const vidRef = useRef<HTMLVideoElement>(null);
  const eventsRef = useRef<EventsHandler>(null);
  const isPlayingRef = useRef(false);
  
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
      isPlayingRef.current = !isPlaying;
    }
  };

  const registerVideoInViewportObserver = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (let i = 0; i < entries.length; i++) {
          let entry = entries[i];
          let isVisible = entry.isIntersecting;

          if (isVisible && !isPlayingRef.current) {
            vidRef.current!.play();
            setIsPlaying(true);
            isPlayingRef.current = true;
          } else if (!isVisible && isPlayingRef.current) {
            vidRef.current!.pause();
            setIsPlaying(false);
            isPlayingRef.current = false;
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
      vidRef,
    );
    
    if (adVerification === null) {
      eventsRef.current = new EventsHandler(vastInformation, null);
      return;
    }

    const { onAdLoaded, mediaEvents } = adVerification;
    eventsRef.current = new EventsHandler(vastInformation, mediaEvents);
    
    // Already playable: fire immediately
    if (vidRef.current!.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      onAdLoaded();
    } else {
      // Otherwise, wait until the video can play 
      vidRef.current!.addEventListener("canplay", onAdLoaded, { once: true });
    }
  };

  const handleImpressionBeacon = () => {

    // Already playable: fire immediately
    if (vidRef.current!.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      eventsRef.current?.sendAdImpression();
    } else {
      // Otherwise, wait until the video can play
      vidRef.current!.addEventListener("canplay", () => {
        eventsRef.current?.sendAdImpression();
      }, { once: true });
    }
  }

  useEffect(() => {
    async function loadVerificationAndPlay() {      
      await registerAdVerification();
      handleImpressionBeacon();
      registerVideoInViewportObserver();
      initializeClosedCaptionState();
      registerKeyboardControl();
    }
    
    loadVerificationAndPlay();
  }, []);

  const onClickPlayPause = () => {
    setIsPlaying(prev => {
      const newPlaying = !prev;
      if (prev) {
        vidRef.current!.pause();
        eventsRef.current?.pause();
      } else {
        vidRef.current!.play();
        eventsRef.current?.play();
      }
      isPlayingRef.current = newPlaying;
      return newPlaying;
    });
  };

  const handleWaiting = () => {
    setIsBuffering(true);
    eventsRef.current?.bufferStart();
  };

  const onClickCcButton = (e?: MouseEvent | KeyboardEvent) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
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
    if (
      (key === "KeyC" || keyLower === "c") &&
      selectedVideo.closedCaptionFile
    ) {
      e.preventDefault();
      onClickCcButton(e);
      return;
    }
  };

  const handleVideoError = (event: Event) => {
    console.log("Video error event:", event);
    const video = vidRef.current;
    const mediaError = video?.error;

    onError?.({
      source: "video",
      element: video ?? null,
      src: selectedVideo?.mediaUrl,
      message: mediaError?.message ?? "Unknown video error",
      nativeEvent: event,
    });
  };

  return (
    <div class="criteo-rm-video-player-container">
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
        onError={handleVideoError}
        data-testid="video-element"
        volume={maxVolume}
        tabIndex={0}
        crossorigin="anonymous"
      >
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
        showCcButton={!!selectedVideo.closedCaptionFile}
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

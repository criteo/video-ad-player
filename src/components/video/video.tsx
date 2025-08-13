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
  const { fallbackImage, altText, maxVolume, targetDimensions, ccButtonLabel } = options;
  const selectedVideo = selectVideo({ mediaFiles, targetDimensions });

  const vidRef = useRef<HTMLVideoElement>(null);
  const eventsRef = useRef<EventsHandler>(null);
  const ccRenderRef = useRef<HTMLDivElement>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isCcActive, setIsCcActive] = useState(true);
  const [ccContent, setCcContent] = useState<string | null>(null);

  const onClickMute = () => {
    if (isMuted) {
      eventsRef.current?.mute();
    } else {
      eventsRef.current?.unmute(maxVolume || 1);
    }
    setIsMuted(!isMuted);
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
    const adVerification = await setupAdVerification(vastInformation);

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
    }

    loadVerificationAndPlay();
  }, []);

  const onClickPlayPause = () => {
    if (isPlaying) {
      vidRef.current!.pause();
      eventsRef.current?.pause();
    } else {
      vidRef.current!.play();
      eventsRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleWaiting = () => {
    setIsBuffering(true);
    eventsRef.current?.bufferStart();
  };

  const onClickCcButton = (e: MouseEvent) => {
    e.preventDefault();

    setIsCcActive(!isCcActive);
    
    const textTrack = vidRef.current?.textTracks?.[0];
    setCcContent(getCueText(textTrack));
  };

  const initializeClosedCaptionState = () => {
    setIsCcActive(!!selectedVideo.closedCaptionFile);
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
        ref={ccRenderRef}
        isCcActive={isCcActive}
        content={ccContent}
      />
    </div>
  );
}

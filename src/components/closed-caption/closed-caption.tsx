import { useEffect, useRef } from 'preact/hooks';
import { getCueText } from '../../services/video-utils';

interface ClosedCaptionProps {
  closedCaptionFile: string | undefined;
  closedCaptionLanguage: string | undefined;
  setCcContent: (content: string | null) => void;
}

export function ClosedCaption({
  closedCaptionFile,
  closedCaptionLanguage,
  setCcContent
}: ClosedCaptionProps) {
  const trackRef = useRef<HTMLTrackElement>(null);
  
  const hideNativeCCBox = () => {
    const textTrack = trackRef.current?.track;
    if (textTrack) {
      textTrack.mode = "hidden";
    }
  };

  const onCueChange = () => {
    setCcContent(trackRef.current ? getCueText(trackRef.current) : null);
  };

  useEffect(() => {
    const onLoad = () => {
      hideNativeCCBox();
      const textTrack = trackRef.current?.track;      
      textTrack?.addEventListener("cuechange", onCueChange);
    };

    trackRef.current?.addEventListener('load', onLoad);

    return () => {
      trackRef.current?.removeEventListener('load', onLoad);      
    };
  }, []);

  return (
    <track
      ref={trackRef}
      kind="subtitles"
      src={closedCaptionFile}
      srclang={closedCaptionLanguage || 'en'}
      label={(closedCaptionLanguage || '').toUpperCase()}
      default
    />
  );
}

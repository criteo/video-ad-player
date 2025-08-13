import { MediaFile } from "./vast-model";

interface VideoSelectionOptions {
  mediaFiles: MediaFile[];
  targetDimensions?: { width: number; height: number };
}

export function selectVideo(options: VideoSelectionOptions): MediaFile {  
  const { mediaFiles, targetDimensions } = options;
  let targetAspectRatio: number | undefined;
  const video: MediaFile = {
    mediaUrl: undefined,
    closedCaptionFile: undefined,
    closedCaptionLanguage: undefined,
  };
  
  if (mediaFiles.length === 0) return video;

  if (targetDimensions) {      
    targetAspectRatio = targetDimensions.width / targetDimensions.height;
  }

  if (
    mediaFiles.length === 1 ||
    (mediaFiles.length > 1 && !targetDimensions) ||
    (mediaFiles.length > 1 && !targetAspectRatio) ||
    (mediaFiles.length > 1 && mediaFiles.every(media => media.aspectRatio === undefined))
  ) {
    
    //use the first media file
    const media= mediaFiles[0];
    video.mediaUrl = media.mediaUrl;
    video.closedCaptionFile = media.closedCaptionFile || undefined
    video.closedCaptionLanguage = media.closedCaptionLanguage || '';
    return video;
  }
    
  mediaFiles.sort((a, b) => {
    const aspectA = a.aspectRatio ?? 0;
    const aspectB = b.aspectRatio ?? 0;
    return aspectA - aspectB;
  });

  // Try to match target aspect ratio
  let closestVideo = null;
  let closestRatioDifference = Infinity;
  for (const mediaFile of mediaFiles) {
    let ratioDifference = Infinity;
    if (
      typeof mediaFile.aspectRatio === "number" &&
      typeof targetAspectRatio === "number"
    ) {
      ratioDifference = Math.abs(mediaFile.aspectRatio - targetAspectRatio);
    }

    if (ratioDifference < closestRatioDifference) {
        closestRatioDifference = ratioDifference;
        closestVideo = mediaFile;
    }

    if (closestVideo &&
        closestVideo.mediaUrl !== mediaFile.mediaUrl &&
        closestVideo.aspectRatio === mediaFile.aspectRatio) {

        const targetWidth = targetDimensions?.width;
        const targetHeight = targetDimensions?.height;
        const currVideoWidthDiff = getWidthDifference(targetWidth, mediaFile.width);
        const currVideoHeightDiff = getHeightDifference(targetHeight, mediaFile.height);
        const closestVideoWidthDiff = getWidthDifference(targetWidth, closestVideo.width);
        const closestVideoHeightDiff = getHeightDifference(targetHeight, closestVideo.height);

        const currVideoTotalDiff = currVideoWidthDiff + currVideoHeightDiff;
        const closestVideoTotalDiff = closestVideoWidthDiff + closestVideoHeightDiff;
        if (currVideoTotalDiff < closestVideoTotalDiff) {
            closestVideo = mediaFile;
        }
    }
  }

  video.mediaUrl = closestVideo?.mediaUrl;
  video.closedCaptionFile = closestVideo?.closedCaptionFile || undefined;
  video.closedCaptionLanguage = closestVideo?.closedCaptionLanguage || '';

  return video;    
}

export function getWidthDifference(targetWidth?: number, mediaWidth?: string) {
  const mediaWidthNum = typeof mediaWidth === "string" ? parseFloat(mediaWidth) : mediaWidth;
  return typeof targetWidth === "number" && typeof mediaWidthNum === "number"
    ? Math.abs(targetWidth - mediaWidthNum)
    : Infinity;
}

export function getHeightDifference(targetHeight?: number, mediaHeight?: string) {
  const mediaHeightNum = typeof mediaHeight === "string" ? parseFloat(mediaHeight) : mediaHeight;
  return typeof targetHeight === "number" && typeof mediaHeightNum === "number"
    ? Math.abs(targetHeight - mediaHeightNum)
    : Infinity;
}

export function getCueText(
  trackOrElement?: HTMLTrackElement | TextTrack
): string {
  const textTrack =
    trackOrElement instanceof HTMLTrackElement
      ? trackOrElement.track
      : trackOrElement;

  const activeCues = textTrack?.activeCues;
  if (activeCues && activeCues.length > 0) {
    const cue = activeCues[0];
    if ("text" in cue && typeof cue.text === "string") {
      return cue.text;
    }
  }
  return "";
}
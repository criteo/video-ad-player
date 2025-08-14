import { describe, it, expect } from "vitest";
import { selectVideo } from "./video-utils";
import type { MediaFile } from "./vast-model";

describe("selectVideo", () => {
  const baseMedia: Partial<MediaFile> = {
    closedCaptionFile: undefined,
    closedCaptionLanguage: undefined,
  };

  it("returns empty video object if mediaFiles is empty", () => {
    const result = selectVideo({ mediaFiles: [] });
    expect(result).toMatchObject({
      mediaUrl: undefined,
      closedCaptionFile: undefined,
      closedCaptionLanguage: undefined,
    });
  });

  it("returns the only media file if only one is present", () => {
    const mediaFiles: MediaFile[] = [
      { ...baseMedia, mediaUrl: "url1.mp4", width: "640", height: "360", aspectRatio: 16 / 9 },
    ] as MediaFile[];
    const result = selectVideo({ mediaFiles });
    expect(result.mediaUrl).toBe("url1.mp4");
  });

  it("returns the first media file if multiple and no targetDimensions", () => {
    const mediaFiles: MediaFile[] = [
      { ...baseMedia, mediaUrl: "url1.mp4", width: "640", height: "360", aspectRatio: 16 / 9 },
      { ...baseMedia, mediaUrl: "url2.mp4", width: "1280", height: "720", aspectRatio: 16 / 9 },
    ] as MediaFile[];
    const result = selectVideo({ mediaFiles });
    expect(result.mediaUrl).toBe("url1.mp4");
  });

  it("returns the first media file if multiple and targetDimensions but no aspectRatio", () => {
    const mediaFiles: MediaFile[] = [
      { ...baseMedia, mediaUrl: "url1.mp4" },
      { ...baseMedia, mediaUrl: "url2.mp4" },
    ] as MediaFile[];
    const result = selectVideo({ mediaFiles, targetDimensions: { width: 640, height: 360 } });
    expect(result.mediaUrl).toBe("url1.mp4");
  });

  it("selects the media file with closest aspect ratio to target", () => {
    const mediaFiles: MediaFile[] = [
      { ...baseMedia, mediaUrl: "url1.mp4", width: "640", height: "360", aspectRatio: 16 / 9 },
      { ...baseMedia, mediaUrl: "url2.mp4", width: "800", height: "600", aspectRatio: 4 / 3 },
      { ...baseMedia, mediaUrl: "url3.mp4", width: "1024", height: "768", aspectRatio: 4 / 3 },
    ] as MediaFile[];
    const result = selectVideo({ mediaFiles, targetDimensions: { width: 1280, height: 720 } });
    expect(result.mediaUrl).toBe("url1.mp4");
  });

  it("selects the media file with closest width/height if aspect ratios are equal", () => {
    const mediaFiles: MediaFile[] = [
      { ...baseMedia, mediaUrl: "url1.mp4", width: "640", height: "360", aspectRatio: 16 / 9 },
      { ...baseMedia, mediaUrl: "url2.mp4", width: "1280", height: "720", aspectRatio: 16 / 9 },
    ] as MediaFile[];
    const result = selectVideo({ mediaFiles, targetDimensions: { width: 1200, height: 700 } });
    // url2.mp4 is closer in width/height to 1200x700 than url1.mp4
    expect(result.mediaUrl).toBe("url2.mp4");
  });

   it("returns closedCaptionFile and closedCaptionLanguage from selected media", () => {
    const mediaFiles: MediaFile[] = [
      {
        ...baseMedia,
        mediaUrl: "url1.mp4",
        aspectRatio: 16 / 9,
        closedCaptionFile: "cc1.vtt",
        closedCaptionLanguage: "en",
      },
      {
        ...baseMedia,
        mediaUrl: "url2.mp4",
        aspectRatio: 4 / 3,
        closedCaptionFile: "cc2.vtt",
        closedCaptionLanguage: "fr",
      },
    ] as MediaFile[];
    const result = selectVideo({ mediaFiles, targetDimensions: { width: 640, height: 360 } });
    expect(result.closedCaptionFile).toBe("cc1.vtt");
    expect(result.closedCaptionLanguage).toBe("en");
  });

  it("returns closedCaptionLanguage as empty string if not present", () => {
    const mediaFiles: MediaFile[] = [
      {
        ...baseMedia,
        mediaUrl: "url1.mp4",
        aspectRatio: 16 / 9,
        closedCaptionFile: undefined,
        closedCaptionLanguage: undefined,
      },
    ] as MediaFile[];
    const result = selectVideo({ mediaFiles });
    expect(result.closedCaptionLanguage).toBe("");
  });
});
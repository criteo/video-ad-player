import { describe, it, expect } from "vitest";
import { VastParser } from "./vast-parser";
import type { MediaFile } from "./vast-model";

function createVastDoc(xml: string): Document {
  return new window.DOMParser().parseFromString(xml, "text/xml");
}

describe("VastParser.queryMediaFiles", () => {
  const parser = new VastParser();

  it("parses multiple MediaFile elements with width, height, and aspectRatio", () => {
    const xml = `
      <VAST>
        <MediaFiles>
          <MediaFile width="640" height="360">http://example.com/video1.mp4</MediaFile>
          <MediaFile width="1280" height="720">http://example.com/video2.mp4</MediaFile>
        </MediaFiles>
      </VAST>
    `;
    const doc = createVastDoc(xml);
    const result = parser.queryMediaFiles(doc);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      mediaUrl: "https://example.com/video1.mp4",
      width: "640",
      height: "360",
      aspectRatio: 640 / 360,
      closedCaptionFile: undefined,
      closedCaptionLanguage: undefined,
    });
    expect(result[1]).toMatchObject({
      mediaUrl: "https://example.com/video2.mp4",
      width: "1280",
      height: "720",
      aspectRatio: 1280 / 720,
      closedCaptionFile: undefined,
      closedCaptionLanguage: undefined,
    });
  });

  it("parses top-level ClosedCaptionFile and language", () => {
    const xml = `
      <VAST>
        <MediaFiles>
          <ClosedCaptionFiles>
            <ClosedCaptionFile language="en">https://example.com/cc.vtt</ClosedCaptionFile>
          </ClosedCaptionFiles>
          <MediaFile width="640" height="360">https://example.com/video.mp4</MediaFile>
        </MediaFiles>
      </VAST>
    `;
    const doc = createVastDoc(xml);
    const result = parser.queryMediaFiles(doc);

    expect(result).toHaveLength(1);
    expect(result[0].closedCaptionFile).toBe("https://example.com/cc.vtt");
    expect(result[0].closedCaptionLanguage).toBe("en");
  });

  it("falls back to per-MediaFile ClosedCaptionFile if no top-level present", () => {
    const xml = `
      <VAST>
        <MediaFiles>
          <MediaFile width="640" height="360">
            http://example.com/video.mp4
            <ClosedCaptionFiles>
              <ClosedCaptionFile language="fr">https://example.com/cc-fr.vtt</ClosedCaptionFile>
            </ClosedCaptionFiles>
          </MediaFile>
        </MediaFiles>
      </VAST>
    `;
    const doc = createVastDoc(xml);
    const result = parser.queryMediaFiles(doc);

    expect(result).toHaveLength(1);
    expect(result[0].closedCaptionFile).toBe("https://example.com/cc-fr.vtt");
    expect(result[0].closedCaptionLanguage).toBe("fr");
  });

  it("returns empty array if no MediaFile elements", () => {
    const xml = `<VAST><MediaFiles></MediaFiles></VAST>`;
    const doc = createVastDoc(xml);
    const result = parser.queryMediaFiles(doc);
    expect(result).toEqual([]);
  });

  it("handles missing width/height", () => {
    const xml = `
      <VAST>
        <MediaFiles>
          <MediaFile>https://example.com/video.mp4</MediaFile>
        </MediaFiles>
      </VAST>
    `;
    const doc = createVastDoc(xml);
    const result = parser.queryMediaFiles(doc);

    expect(result[0].width).toBeUndefined();
    expect(result[0].height).toBeUndefined();
    expect(result[0].aspectRatio).toBeUndefined();
  });
});
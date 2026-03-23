import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EventsHandler, sendBeacon } from "../events-handler";
import type { VastInformation } from "../vast-model";
import type { MediaEvents } from "../omid-js/omid-verification";

const mockSendBeacon = vi.fn().mockReturnValue(true);
Object.defineProperty(navigator, "sendBeacon", {
  value: mockSendBeacon,
  writable: true,
  configurable: true,
});

const createMockVastInformation = (): VastInformation => ({
  mediaFiles: [],
  adVerifications: [],
  beacons: {
    impression: "https://example.com/impression",
    adStarted: "https://example.com/start",
    adFirstQuartile: "https://example.com/firstquartile",
    adMidpoint: "https://example.com/midpoint",
    adThirdQuartile: "https://example.com/thirdquartile",
    adCompleted: "https://example.com/complete",
    pause: "https://example.com/pause",
    resume: "https://example.com/resume",
    mute: "https://example.com/mute",
    unmute: "https://example.com/unmute",
    clickThrough: "https://example.com/click",
    verificationNotExecuted: "https://example.com/verification-not-executed",
  },
  clickThroughUrl: "https://example.com/clickthrough",
});

const createMockMediaEvents = (): MediaEvents => ({
  start: vi.fn(),
  firstQuartile: vi.fn(),
  midpoint: vi.fn(),
  thirdQuartile: vi.fn(),
  complete: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  volumeChange: vi.fn(),
  bufferStart: vi.fn(),
  bufferFinish: vi.fn(),
});

describe("EventsHandler", () => {
  let vastInfo: VastInformation;
  let mediaEvents: MediaEvents;
  let handler: EventsHandler;

  beforeEach(() => {
    vastInfo = createMockVastInformation();
    mediaEvents = createMockMediaEvents();
    handler = new EventsHandler(vastInfo, mediaEvents);
    mockSendBeacon.mockClear();
  });

  describe("pause", () => {
    it("sends pause beacon and calls mediaEvents.pause", () => {
      handler.pause();
      expect(mockSendBeacon).toHaveBeenCalledWith(new URL("https://example.com/pause"));
      expect(mediaEvents.pause).toHaveBeenCalled();
    });
  });

  describe("play", () => {
    it("sends resume beacon and calls mediaEvents.resume", () => {
      handler.play();
      expect(mockSendBeacon).toHaveBeenCalledWith(new URL("https://example.com/resume"));
      expect(mediaEvents.resume).toHaveBeenCalled();
    });
  });

  describe("mute", () => {
    it("sends mute beacon and calls volumeChange with 0", () => {
      handler.mute();
      expect(mockSendBeacon).toHaveBeenCalledWith(new URL("https://example.com/mute"));
      expect(mediaEvents.volumeChange).toHaveBeenCalledWith(0);
    });
  });

  describe("unmute", () => {
    it("sends unmute beacon and calls volumeChange with volume", () => {
      handler.unmute(0.8);
      expect(mockSendBeacon).toHaveBeenCalledWith(new URL("https://example.com/unmute"));
      expect(mediaEvents.volumeChange).toHaveBeenCalledWith(0.8);
    });
  });

  describe("bufferStart/bufferFinish", () => {
    it("calls mediaEvents.bufferStart", () => {
      handler.bufferStart();
      expect(mediaEvents.bufferStart).toHaveBeenCalled();
    });

    it("calls mediaEvents.bufferFinish", () => {
      handler.bufferFinish();
      expect(mediaEvents.bufferFinish).toHaveBeenCalled();
    });
  });

  describe("sendAdImpression", () => {
    it("sends impression beacon only once", () => {
      handler.sendAdImpression();
      handler.sendAdImpression();
      expect(mockSendBeacon).toHaveBeenCalledTimes(1);
      expect(mockSendBeacon).toHaveBeenCalledWith(new URL("https://example.com/impression"));
    });
  });

  describe("with null mediaEvents", () => {
    it("handles null mediaEvents gracefully", () => {
      const nullHandler = new EventsHandler(vastInfo, null);
      expect(() => {
        nullHandler.setTime(50, 100, 1);
        nullHandler.loop();
        nullHandler.pause();
        nullHandler.play();
        nullHandler.mute();
        nullHandler.unmute(1);
        nullHandler.bufferStart();
        nullHandler.bufferFinish();
      }).not.toThrow();
    });
  });
});

describe("sendBeacon", () => {
  beforeEach(() => {
    mockSendBeacon.mockClear();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("does nothing if beaconUrl is undefined", () => {
    sendBeacon(undefined);
    expect(mockSendBeacon).not.toHaveBeenCalled();
  });

  it("sends beacon for valid URL", () => {
    sendBeacon("https://example.com/beacon");
    expect(mockSendBeacon).toHaveBeenCalledWith(new URL("https://example.com/beacon"));
  });

  it("logs error for invalid URL", () => {
    sendBeacon("not-a-valid-url");
    expect(console.error).toHaveBeenCalled();
  });
});


import { render, fireEvent, waitFor } from "@testing-library/preact";
import { Video } from "../video";
import { VastInformation } from "../../../services/vast-model";
import { beforeEach, expect, Mock, test, vi, describe } from "vitest";

// IntersectionObserver Mock
let lastObserverInstance: any = null;

class IntersectionObserverMock {
  private callback: IntersectionObserverCallback;

  constructor(
    callback: IntersectionObserverCallback,
    private options?: IntersectionObserverInit
  ) {
    this.callback = callback;
    lastObserverInstance = this;
  }

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();

  trigger(entries: IntersectionObserverEntry[]) {
    this.callback(entries, this as any);
  }
}

global.IntersectionObserver = IntersectionObserverMock as any;

let vastInformation: VastInformation;
let sendBeaconMock: Mock;
let videoElement: HTMLVideoElement;
let getByTestId: (id: string) => HTMLElement;

beforeEach(async () => {
  vastInformation = {
    mediaFiles: [
      {
        mediaUrl: "https://example.com/media.mp4",
        closedCaptionFile: "https://example.com/captions.vtt",
        closedCaptionLanguage: "en",
      },
    ],
    clickThroughUrl: "https://example.com",
    beacons: {
      impression: "https://example.com/impression",
      adStarted: "https://example.com/adStarted",
      adFirstQuartile: "https://example.com/adFirstQuartile",
      adMidpoint: "https://example.com/adMidpoint",
      adThirdQuartile: "https://example.com/adThirdQuartile",
      adCompleted: "https://example.com/adCompleted",
      mute: "https://example.com/mute",
      unmute: "https://example.com/unmute",
      pause: "https://example.com/pause",
      resume: "https://example.com/resume",
      clickThrough: "https://example.com/clickThrough",
      verificationNotExecuted: "https://example.com/verificationNotExecuted",
    },
    adVerifications: [],
  };

  sendBeaconMock = vi.fn();
  Object.defineProperty(navigator, "sendBeacon", {
    value: sendBeaconMock,
    writable: true,
  });

  const renderResult = render(
    <Video options={{altText: "Video"}} vastInformation={vastInformation} />
  );

  getByTestId = renderResult.getByTestId;
  videoElement = getByTestId("video-element") as HTMLVideoElement;

  // JSDOM doesn't load real media, so manually fire loadeddata to render the ControlBar.
  fireEvent(videoElement, new Event("loadeddata"));

  await waitFor(() => {
    expect(getByTestId("play-button")).toBeInTheDocument();
  });

  Object.defineProperty(videoElement, "duration", {
    value: 100,
    writable: true,
  });
});

test("should send ad started event", async () => {
  // Fire timeupdate event
  const timeUpdateEvent = new Event("timeupdate");
  Object.defineProperty(videoElement, "currentTime", {
    value: 10,
    writable: true,
  });
  fireEvent(videoElement, timeUpdateEvent);
  await waitFor(() => {
    // Assert that the current time of the video is 10
    expect(videoElement.currentTime).toBe(10);
    expect(sendBeaconMock).toHaveBeenCalledWith(
      new URL("https://example.com/adStarted")
    );
  });
});

test("should send first quartile event", async () => {
  // Fire timeupdate event
  const timeUpdateEvent = new Event("timeupdate");
  Object.defineProperty(videoElement, "currentTime", {
    value: 24,
    writable: true,
  });
  fireEvent(videoElement, timeUpdateEvent);
  sendBeaconMock.mockClear();
  Object.defineProperty(videoElement, "currentTime", {
    value: 26,
    writable: true,
  });
  fireEvent(videoElement, timeUpdateEvent);
  await waitFor(() => {
    expect(videoElement.currentTime).toBe(26);
    expect(sendBeaconMock).toHaveBeenCalledWith(
      new URL("https://example.com/adFirstQuartile")
    );
  });
});

test("should mid point event", async () => {
  // Fire timeupdate event
  const timeUpdateEvent = new Event("timeupdate");
  Object.defineProperty(videoElement, "currentTime", {
    value: 49,
    writable: true,
  });
  fireEvent(videoElement, timeUpdateEvent);
  sendBeaconMock.mockClear();
  Object.defineProperty(videoElement, "currentTime", {
    value: 51,
    writable: true,
  });
  fireEvent(videoElement, timeUpdateEvent);
  await waitFor(() => {
    expect(videoElement.currentTime).toBe(51);
    expect(sendBeaconMock).toHaveBeenCalledWith(
      new URL("https://example.com/adMidpoint")
    );
  });
});

test("should send third quartile event", async () => {
  // Fire timeupdate event
  const timeUpdateEvent = new Event("timeupdate");
  Object.defineProperty(videoElement, "currentTime", {
    value: 74,
    writable: true,
  });
  fireEvent(videoElement, timeUpdateEvent);
  sendBeaconMock.mockClear();
  Object.defineProperty(videoElement, "currentTime", {
    value: 76,
    writable: true,
  });
  fireEvent(videoElement, timeUpdateEvent);
  await waitFor(() => {
    expect(videoElement.currentTime).toBe(76);
    expect(sendBeaconMock).toHaveBeenCalledWith(
      new URL("https://example.com/adThirdQuartile")
    );
  });
});

test("should send ad completed event", async () => {
  // Fire timeupdate event
  const endedEvent = new Event("ended");
  fireEvent(videoElement, endedEvent);
  await waitFor(() => {
    expect(sendBeaconMock).toHaveBeenCalledWith(
      new URL("https://example.com/adCompleted")
    );
  });
});

test("should send impression event when video can play", async () => {
  sendBeaconMock.mockClear();
  fireEvent(videoElement, new Event("canplay"));
  await waitFor(() => {
    expect(sendBeaconMock).toHaveBeenCalledWith(
      new URL("https://example.com/impression")
    );
  });
});

test("should send mute event when mute button is clicked", async () => {
  sendBeaconMock.mockClear();
  const muteButton = getByTestId("mute-button");
  fireEvent.click(muteButton);
  await waitFor(() => {
    expect(sendBeaconMock).toHaveBeenCalledWith(
      new URL("https://example.com/mute")
    );
  });
});

test("should send unmute event when unmute button is clicked", async () => {
  const muteButton = getByTestId("mute-button");
  fireEvent.click(muteButton);
  sendBeaconMock.mockClear();
  fireEvent.click(muteButton);
  await waitFor(() => {
    expect(sendBeaconMock).toHaveBeenCalledWith(
      new URL("https://example.com/unmute")
    );
  });
});

test("should send resume event when play button is clicked", async () => {
  sendBeaconMock.mockClear();
  const playButton = getByTestId("play-button");
  fireEvent.click(playButton);
  await waitFor(() => {
    expect(sendBeaconMock).toHaveBeenCalledWith(
      new URL("https://example.com/resume")
    );
  });
});

test("should send pause event when pause button is clicked", async () => {
  const playButton = getByTestId("play-button");
  fireEvent.click(playButton);
  sendBeaconMock.mockClear();
  fireEvent.click(playButton);
  await waitFor(() => {
    expect(sendBeaconMock).toHaveBeenCalledWith(
      new URL("https://example.com/pause")
    );
  });
});

test("should send clickThrough event when clicked", async () => {
  sendBeaconMock.mockClear();
  const videoComponent = getByTestId("video-element");
  fireEvent.click(videoComponent);
  await waitFor(() => {
    expect(sendBeaconMock).toHaveBeenCalledWith(
      new URL("https://example.com/clickThrough")
    );
  });
});

test("Dispatching several times the ended event should not resend the ad completed beacon", async () => {
  // Fire ended video event
  const endedEvent = new Event("ended");
  fireEvent(videoElement, endedEvent);
  await waitFor(() => {
    expect(sendBeaconMock).toHaveBeenCalledWith(
      new URL("https://example.com/adCompleted")
    );
  });

  sendBeaconMock.mockClear();
  fireEvent(videoElement, endedEvent);
  await waitFor(() => {
    expect(sendBeaconMock).toHaveBeenCalledTimes(0);
  });
});

test("video element has crossorigin attribute to prevent CORS issues", () => {
  expect(videoElement).toHaveAttribute("crossorigin", "anonymous");
});

test("should play video muted by default", () => {
  expect(videoElement.muted).toBe(true);  
});

test("should pause video when moved out of viewport and resume when back in viewport", async () => {
  // Mock play and pause methods
  const playMock = vi.fn();
  const pauseMock = vi.fn();

  videoElement.play = playMock;
  videoElement.pause = pauseMock;

  // Start playing the video
  const playButton = getByTestId("play-button");
  fireEvent.click(playButton);

  await waitFor(() => {
    expect(playMock).toHaveBeenCalled();
  });

  // Get the observer instance created during beforeEach
  const observerInstance = lastObserverInstance;
  expect(observerInstance).not.toBeNull();

  // Simulate video moving out of viewport
  observerInstance.trigger([
    {
      isIntersecting: false,
      target: videoElement,
    } as unknown as IntersectionObserverEntry,
  ]);

  await waitFor(() => {
    expect(pauseMock).toHaveBeenCalled();
  });

  playMock.mockClear();
  pauseMock.mockClear();

  // Simulate video moving back into viewport
  observerInstance.trigger([
    {
      isIntersecting: true,
      target: videoElement,
    } as unknown as IntersectionObserverEntry,
  ]);

  await waitFor(() => {
    expect(playMock).toHaveBeenCalled();
  });
});

describe("renderVideo function", () => {
  test("should not render video element without a target element", async () => {
    const { renderVideo } = await import("../video-render");
    const onErrorMock = vi.fn();
    
    const result = await renderVideo(vastInformation, "non-existent-id", {
      altText: "Video",
      onError: onErrorMock,
    });

    expect(result).toBeNull();
    expect(onErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "elementId",
        message: expect.stringContaining("Target element with id"),
      })
    );
  });

  test("should not render video element when mediaFiles is empty", async () => {
    const { renderVideo } = await import("../video-render");
    const container = document.createElement("div");
    container.id = "test-container";
    document.body.appendChild(container);

    const onErrorMock = vi.fn();
    const emptyVastInfo: VastInformation = {
      ...vastInformation,
      mediaFiles: [],
    };

    const result = await renderVideo(emptyVastInfo, "test-container", {
      altText: "Video",
      onError: onErrorMock,
    });

    expect(result).toBeNull();
    expect(onErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "vast",
        message: expect.stringContaining("No media files found"),
      })
    );

    document.body.removeChild(container);
  });
});


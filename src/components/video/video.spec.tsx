import { render, fireEvent, waitFor } from "@testing-library/preact";
import { Video } from "./video";
import { VastInformation } from "../../services/vast-model";
import { beforeEach, expect, Mock, test, vi } from "vitest";

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

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";
import { ControlBar } from "../control-bar";

describe("ControlBar", () => {
  const defaultProps = {
    onClickMute: vi.fn(),
    onClickPlayPause: vi.fn(),
    isPlaying: false,
    isMuted: true,
    onClickCcButton: vi.fn(),
    isCcActive: false,
  };

  it("calls onClickPlayPause when play/pause button is clicked", () => {
    const onClickPlayPause = vi.fn();
    render(<ControlBar {...defaultProps} onClickPlayPause={onClickPlayPause} />);
    fireEvent.click(screen.getByTestId("play-button"));
    expect(onClickPlayPause).toHaveBeenCalledTimes(1);
  });


  it("calls onClickMute when mute button is clicked", () => {
    const onClickMute = vi.fn();
    render(<ControlBar {...defaultProps} onClickMute={onClickMute} />);
    fireEvent.click(screen.getByTestId("mute-button"));
    expect(onClickMute).toHaveBeenCalledTimes(1);
  });

  it("calls onClickCcButton when CC button is clicked", () => {
    const onClickCcButton = vi.fn();
    render(<ControlBar {...defaultProps} onClickCcButton={onClickCcButton} />);
    fireEvent.click(screen.getByRole("button", { name: "Closed Captions Button" }));
    expect(onClickCcButton).toHaveBeenCalledTimes(1);
  });

  it("does not render the CC button when showCcButton is false", () => {
    render(<ControlBar {...defaultProps} showCcButton={false} />);
    expect(
      screen.queryByRole("button", { name: "Closed Captions Button" })
    ).toBeNull();
  });
});


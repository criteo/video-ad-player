import { JSX } from 'preact';
import { CloseCaptionIcon } from "../icons/closed-caption-icon";
import { LowVolumeIcon } from "../icons/low-volume-icon";
import { MutedIcon } from "../icons/muted-icon";
import { PauseIcon } from "../icons/pause-icon";
import { PlayIcon } from "../icons/play-icon";


interface ControlBarProps {
  onClickMute: () => void;
  onClickPlayPause: () => void;
  isPlaying: boolean;
  isMuted: boolean;
  showCcButton?: boolean;
  ccButtonLabel?: string;    
  onClickCcButton: (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => void;
  isCcActive: boolean;
}

export function ControlBar({
  onClickMute,
  onClickPlayPause,
  isMuted,
  isPlaying,
  showCcButton = true,
  ccButtonLabel,
  onClickCcButton,
  isCcActive
}: ControlBarProps) {

  return (
    <div class="rm-video-controls-container">
      <div class="controls">
        <div class="play-pause-container">
          <button
            class="play-pause-btn"
            onClick={onClickPlayPause}
            data-testid="play-button"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
        <div class="volume-container">
          <button
            class="mute-btn"
            onClick={onClickMute}
            data-testid="mute-button"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MutedIcon /> : <LowVolumeIcon />}
          </button>
        </div>
        {showCcButton ? (
        <div class="cc-container">
          <button
            class={`cc-btn ${isCcActive ? "active" : "disabled"}`}
            onClick={onClickCcButton}
            aria-label={ccButtonLabel || "Closed Captions Button"}
          >
            <CloseCaptionIcon />
          </button>          
        </div>
        ) : null}
      </div>
    </div>
  );
}

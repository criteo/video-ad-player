import { forwardRef } from "preact/compat";

export type ClosedCaptionRenderProps = {
  isCcActive: boolean;
  content: string | null;
};

export const ClosedCaptionRender = forwardRef<HTMLDivElement, ClosedCaptionRenderProps>(
  ({ isCcActive, content }, ref) => {
    return (
      <div
        ref={ref}
        class={`custom-subtitle-container ${isCcActive ? "active" : "disabled"}`}
      >
        {content}
      </div>
    );
  }
);
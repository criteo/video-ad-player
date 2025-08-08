import { criteoVideoPlayerFromContent } from "@criteo/video-player";
import "@criteo/video-player/dist/style.css";
import { vastContent } from "./vast_content";

criteoVideoPlayerFromContent(
  vastContent,
  "video-player-container",
  "Criteo Video Player"
);

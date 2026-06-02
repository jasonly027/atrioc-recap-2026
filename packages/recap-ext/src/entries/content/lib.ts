import type { Dispatch, SetStateAction } from "react";

export type StatePair<T> = {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
};

export function getVideo(signal?: AbortSignal): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);

    let video: HTMLVideoElement | null = null;
    let onLoaded: (() => void) | null = null;

    // Abort setup
    const abort = () => {
      observer.disconnect();
      if (onLoaded) video?.removeEventListener("loadedmetadata", onLoaded);
      reject(signal!.reason);
    };

    signal?.addEventListener("abort", abort, { once: true });

    const resolveWithVideo = (v: HTMLVideoElement) => {
      signal?.removeEventListener("abort", abort);
      resolve(v);
    };

    // DOM observer setup
    const observer = new MutationObserver(() => {
      video = document.querySelector<HTMLVideoElement>("video");
      if (!video) return;
      observer.disconnect();

      if (video.readyState >= 1) {
        resolveWithVideo(video);
        return;
      }

      const v = video;
      onLoaded = () => resolveWithVideo(v);
      video.addEventListener("loadedmetadata", onLoaded, { once: true });
    });

    // Try early resolve
    video = document.querySelector<HTMLVideoElement>("video");
    if (video) {
      const vid = video;

      if (vid.readyState >= 1) {
        setTimeout(() => resolveWithVideo(vid), 0);
      } else {
        onLoaded = () => resolveWithVideo(vid);
        vid.addEventListener("loadedmetadata", onLoaded, { once: true });
      }
    } else {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
}

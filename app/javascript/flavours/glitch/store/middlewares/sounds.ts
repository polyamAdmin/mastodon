import type { Middleware, AnyAction } from 'redux';

import { notificationSound } from 'flavours/glitch/initial_state';
import ready from 'flavours/glitch/ready';
import { assetHost } from 'flavours/glitch/utils/config';

import type { RootState } from '..';

interface AudioSource {
  src: string;
  type: string;
}

const createAudio = (sources: AudioSource[]) => {
  const audio = new Audio();
  sources.forEach(({ type, src }) => {
    const source = document.createElement('source');
    source.type = type;
    source.src = src;
    audio.appendChild(source);
  });
  return audio;
};

const play = (audio: HTMLAudioElement) => {
  if (!audio.paused) {
    audio.pause();
    if (typeof audio.fastSeek === 'function') {
      audio.fastSeek(0);
    } else {
      audio.currentTime = 0;
    }
  }

  void audio.play();
};

export const soundsMiddleware = (): Middleware<
  Record<string, never>,
  RootState
> => {
  const soundCache: Record<string, HTMLAudioElement> = {};

  void ready(() => {
    soundCache.notificationSound = createAudio(
      !notificationSound
        ? [
            {
              src: `${assetHost}/sounds/boop.ogg`,
              type: 'audio/ogg',
            },
            {
              src: `${assetHost}/sounds/boop.mp3`,
              type: 'audio/mpeg',
            },
          ]
        : [
            {
              src: `${assetHost}${(notificationSound[0] as AudioSource).src}`,
              type: (notificationSound[0] as AudioSource).type,
            },
            {
              src: `${assetHost}${(notificationSound[1] as AudioSource).src}`,
              type: (notificationSound[1] as AudioSource).type,
            },
          ]
    );
  });

  return () =>
    (next) =>
    (action: AnyAction & { meta?: { sound?: string } }) => {
      const sound = action.meta?.sound;

      if (sound && Object.hasOwn(soundCache, sound)) {
        play(soundCache[sound]);
      }

      return next(action);
    };
};

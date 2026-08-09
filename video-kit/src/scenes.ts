import generated from './scenes.generated.json';

export type SceneData = {
  badge: string;
  title: string;
  layout: 'intro' | 'normal';
  diagram: string | null;
  lines: string[];
  narration: string;
  audio: string;
  durationSec: number;
};

export const FPS = 30;
export const PAD_SEC = 0.7;
export const FOOTER: string = (generated as {footer: string}).footer;
export const SCENES = (generated as {scenes: SceneData[]}).scenes;

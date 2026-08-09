import React from 'react';
import {Composition} from 'remotion';
import {LessonVideo} from './Video';
import {FPS, PAD_SEC, SCENES} from './scenes';

const totalFrames = SCENES.reduce((acc, s) => acc + Math.round((s.durationSec + PAD_SEC) * FPS), 0);

export const Root: React.FC = () => (
  <Composition
    id="LessonVideo"
    component={LessonVideo}
    durationInFrames={Math.max(totalFrames, FPS)}
    fps={FPS}
    width={1920}
    height={1080}
  />
);

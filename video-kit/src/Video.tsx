import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FOOTER, FPS, PAD_SEC, SCENES, SceneData} from './scenes';
import {BacklightDiagram, I2cDiagram, LcdDiagram, PwmDiagram, QuizDiagram, ServoDiagram} from './diagrams';

const font = `@font-face {
  font-family: 'NotoKR';
  src: url('${staticFile('fonts/NotoSansKR.ttf')}') format('truetype');
}`;

const Diagram: React.FC<{scene: SceneData; t: number}> = ({scene, t}) => {
  switch (scene.diagram) {
    case 'lcd': return <LcdDiagram t={t} />;
    case 'lcd-scroll': return <LcdDiagram t={t} scroll />;
    case 'backlight': return <BacklightDiagram t={t} />;
    case 'i2c': return <I2cDiagram t={t} />;
    case 'servo': return <ServoDiagram t={t} />;
    case 'servo-sweep': return <ServoDiagram t={t} sweep steps={t > 5.5} />;
    case 'pwm': return <PwmDiagram t={t} />;
    case 'quiz': return <QuizDiagram t={t} />;
    default: return null;
  }
};

const Scene: React.FC<{scene: SceneData}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const intro = scene.layout === 'intro';
  const titleSpring = spring({frame, fps, config: {damping: 14}});
  const fadeOut = interpolate(frame, [(scene.durationSec + PAD_SEC) * fps - 12, (scene.durationSec + PAD_SEC) * fps], [1, 0], {extrapolateLeft: 'clamp'});

  return (
    <AbsoluteFill style={{background: 'linear-gradient(160deg,#0b1626 0%,#122844 55%,#0b1626 100%)', fontFamily: 'NotoKR', opacity: fadeOut}}>
      {scene.audio ? <Audio src={staticFile(`audio/${scene.audio}`)} /> : null}
      <div style={{position: 'absolute', top: 70, left: 90, right: 90}}>
        <div style={{display: 'inline-block', background: '#ffb74d', color: '#31220a', fontSize: 30, fontWeight: 800, padding: '8px 26px', borderRadius: 999, transform: `translateY(${(1 - titleSpring) * -40}px)`, opacity: titleSpring}}>
          {scene.badge}
        </div>
        <h1 style={{color: '#fff', fontSize: intro ? 110 : 72, fontWeight: 900, margin: '26px 0 0', letterSpacing: -1, transform: `translateY(${(1 - titleSpring) * 40}px)`, opacity: titleSpring, textAlign: intro ? 'center' : 'left', marginTop: intro ? 180 : 26}}>
          {scene.title}
        </h1>
      </div>
      <div style={{position: 'absolute', top: intro ? 620 : 300, left: 90, right: 90, textAlign: intro ? 'center' : 'left'}}>
        {scene.lines.map((line, i) => {
          const s = spring({frame: frame - (14 + i * 16), fps, config: {damping: 15}});
          return (
            <div key={i} style={{color: '#cfe3f7', fontSize: intro ? 46 : 40, fontWeight: 500, margin: '18px 0', opacity: s, transform: `translateX(${(1 - s) * (intro ? 0 : 40)}px)`, display: intro ? 'block' : 'flex', alignItems: 'center', gap: 20}}>
              {!intro && <span style={{width: 14, height: 14, borderRadius: 7, background: '#4fc3f7', flexShrink: 0}} />}
              {line}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: interpolate(t, [0.8, 1.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <Diagram scene={scene} t={t} />
      </div>
      <div style={{position: 'absolute', bottom: 24, right: 40, color: '#5c718a', fontSize: 24}}>
        {FOOTER}
      </div>
    </AbsoluteFill>
  );
};

export const LessonVideo: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: '#0b1626'}}>
      <style>{font}</style>
      {SCENES.map((scene, idx) => {
        const dur = Math.round((scene.durationSec + PAD_SEC) * FPS);
        const seq = (
          <Sequence key={idx} from={from} durationInFrames={dur}>
            <Scene scene={scene} />
          </Sequence>
        );
        from += dur;
        return seq;
      })}
    </AbsoluteFill>
  );
};

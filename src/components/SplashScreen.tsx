import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { GLOW_THEMES } from '../data/themes';
import type { GlowThemeId } from '../data/themes';

interface SplashScreenProps {
  onFinish: () => void;
  glowTheme?: GlowThemeId;
}

interface StepItem {
  id: string;
  name: string;
  statusText?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, glowTheme = 'cobalt' }) => {
  const steps: StepItem[] = [
    { id: 'updates', name: 'Check for updates', statusText: 'up to date' },
    { id: 'core', name: 'SpectreCore.dll', statusText: 'loaded' },
    { id: 'modules', name: 'Loading all modules', statusText: 'verified' },
    { id: 'runtime', name: 'Runtime environment', statusText: 'ready' },
  ];

  const [activeStep, setActiveStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(10);
  const [fadeOut, setFadeOut] = useState<boolean>(false);

  const theme = GLOW_THEMES.find((t) => t.id === glowTheme) || GLOW_THEMES[0];

  useEffect(() => {
    // Timeline animation sequence
    const t1 = setTimeout(() => {
      setActiveStep(1); // 1st completed
      setProgress(35);
    }, 450);

    const t2 = setTimeout(() => {
      setActiveStep(2); // 2nd completed
      setProgress(65);
    }, 900);

    const t3 = setTimeout(() => {
      setActiveStep(3); // 3rd completed
      setProgress(88);
    }, 1350);

    const t4 = setTimeout(() => {
      setActiveStep(4); // 4th completed
      setProgress(100);
    }, 1750);

    const t5 = setTimeout(() => {
      setFadeOut(true);
    }, 2250);

    const t6 = setTimeout(() => {
      onFinish();
    }, 2550);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#05070c] transition-opacity duration-300 select-none overflow-hidden ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Glow with Dynamic Theme */}
      <div
        className="absolute w-[500px] h-[360px] rounded-full pointer-events-none -z-10 transition-all duration-500"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.rgbaCenter} 0%, ${theme.rgbaEdge} 45%, transparent 75%)`,
          filter: 'blur(45px)',
        }}
      />

      <div className="w-[360px] space-y-6">
        {/* Timeline Checklist */}
        <div className="relative space-y-4 pl-1">
          {/* Vertical connecting line */}
          <div className="absolute left-[13px] top-[14px] bottom-[14px] w-[1.5px] bg-[#172033] -z-0" />

          {steps.map((step, idx) => {
            const isCompleted = activeStep > idx;
            const isCurrent = activeStep === idx;

            return (
              <div key={step.id} className="relative z-10 flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-3">
                  {/* Circle Node */}
                  <div
                    className={`w-[26px] h-[26px] rounded-full flex items-center justify-center transition-all duration-200 border ${
                      isCompleted
                        ? 'bg-[#121929] border-[#223252] text-zinc-200'
                        : isCurrent
                        ? 'bg-[#0e1626] border-zinc-600'
                        : 'bg-[#0a0f1a] border-[#162033] text-zinc-600'
                    }`}
                    style={isCurrent ? { borderColor: theme.hex } : undefined}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 text-zinc-300" strokeWidth={2.5} />
                    ) : isCurrent ? (
                      <Loader2
                        className="w-3 h-3 animate-spin"
                        style={{ color: theme.hex }}
                      />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1b253b]" />
                    )}
                  </div>

                  {/* Step Name */}
                  <span
                    className={`transition-colors duration-200 ${
                      isCompleted
                        ? 'text-zinc-200 font-medium'
                        : isCurrent
                        ? 'text-zinc-100 font-medium'
                        : 'text-zinc-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>

                {/* Right Status */}
                {step.statusText && isCompleted && (
                  <span className="text-[11px] text-zinc-500 font-sans pr-1 animate-in fade-in duration-200">
                    {step.statusText}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Glowing Dynamic Horizontal Progress Bar */}
        <div className="pt-2">
          <div className="h-[2.5px] w-full bg-[#101726] rounded-full overflow-hidden relative">
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: theme.hex,
                boxShadow: theme.boxShadow,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

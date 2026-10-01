/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DhruvaTwin Interactive Emperor Penguin Information Popup
 * Bio-telemetry modal with Web Audio API acoustic synthesizer.
 * 
 * National Centre for Polar and Ocean Research (NCPOR) / MoES
 * Smart India Hackathon 2026 - PS 26060 - Team HackFinity007
 */

import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';

interface PenguinInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PenguinInfoPopup: React.FC<PenguinInfoPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const [isPlayingCall, setIsPlayingCall] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Synthesize realistic Emperor Penguin dual-syrinx trumpet call using Web Audio API
  const playPenguinCall = () => {
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      const now = audioCtx.currentTime;

      // Realistic dual-syrinx acoustic trumpet modulation
      osc.frequency.setValueAtTime(430, now);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.32);
      osc.frequency.exponentialRampToValueAtTime(630, now + 0.52);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.82);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.82);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.82);

      setIsPlayingCall(true);
      setTimeout(() => setIsPlayingCall(false), 850);
    } catch {
      // Graceful audio fallback
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="dhruva-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="penguin-modal-title"
    >
      <div
        className="dhruva-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="dhruva-modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00E0C6]/15 border border-[#00E0C6]/40 flex items-center justify-center text-xl">
              🐧
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="penguin-modal-title" className="text-base font-extrabold uppercase tracking-wider text-white">
                  EMPEROR PENGUIN
                </h3>
                <span className="text-[10px] font-mono font-bold bg-[#3EE07F]/20 text-[#3EE07F] px-2 py-0.5 rounded border border-[#3EE07F]/30">
                  PROTECTED FAUNA
                </span>
              </div>
              <div className="text-xs text-[#8CA0BA] italic">
                Aptenodytes forsteri · Madrid Protocol Annex II
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="dhruva-modal-close-btn"
            aria-label="Close information popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="dhruva-modal-body space-y-4">
          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#060B14]/80 p-3 rounded-xl border border-white/5">
              <div className="text-[#64748B] font-bold uppercase tracking-wider mb-1">
                SCIENTIFIC NAME
              </div>
              <div className="text-white font-medium italic text-sm">
                Aptenodytes forsteri
              </div>
            </div>

            <div className="bg-[#060B14]/80 p-3 rounded-xl border border-white/5">
              <div className="text-[#64748B] font-bold uppercase tracking-wider mb-1">
                HABITAT
              </div>
              <div className="text-white font-medium text-sm flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#00E0C6]" />
                <span>Antarctica Pack Ice</span>
              </div>
            </div>

            <div className="bg-[#060B14]/80 p-3 rounded-xl border border-white/5">
              <div className="text-[#64748B] font-bold uppercase tracking-wider mb-1">
                CATEGORY
              </div>
              <div className="text-[#00E0C6] font-semibold text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00E0C6]" />
                <span>Antarctic Wildlife</span>
              </div>
            </div>

            <div className="bg-[#060B14]/80 p-3 rounded-xl border border-white/5">
              <div className="text-[#64748B] font-bold uppercase tracking-wider mb-1">
                COLONY BIO-STATUS
              </div>
              <div className="text-[#3EE07F] font-mono font-bold text-sm">
                ACTIVE · 1,240 INDIV.
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            The largest of all living penguin species, endemic to Antarctica. In the Schirmacher Oasis and coastal Larsemann Hills,
            colonies are continuously monitored via passive acoustic sensor grids and thermal satellite telemetry integrated into DhruvaTwin.
          </p>

          {/* Bio-Acoustic Syrinx Call Synthesizer Button */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10">
            <button
              type="button"
              onClick={playPenguinCall}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00E0C6]/15 hover:bg-[#00E0C6]/25 border border-[#00E0C6]/40 text-[#00E0C6] hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
            >
              {isPlayingCall ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingCall ? 'Synthesizing Call...' : 'Play Penguin Vocalization'}</span>
            </button>

            <span className="text-[11px] text-[#64748B] font-mono">
              Web Audio 430Hz–760Hz
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DhruvaTwin Antarctic Research Station Information Modal
 * Interactive inspection card for Maitri Station telemetry.
 * 
 * National Centre for Polar and Ocean Research (NCPOR) / MoES
 * Smart India Hackathon 2026 - PS 26060 - Team HackFinity007
 */

import React, { useEffect } from 'react';
import { X, ArrowRight, Radio, Zap, Droplets, MapPin, ShieldCheck, Thermometer } from 'lucide-react';

interface ResearchStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterLogin: () => void;
}

export const ResearchStationModal: React.FC<ResearchStationModalProps> = ({
  isOpen,
  onClose,
  onEnterLogin,
}) => {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="dhruva-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="station-modal-title"
    >
      <div
        className="dhruva-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="dhruva-modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4A9EFF]/15 border border-[#4A9EFF]/40 flex items-center justify-center text-xl">
              🏢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="station-modal-title" className="text-base font-extrabold uppercase tracking-wider text-white">
                  MAITRI RESEARCH STATION
                </h3>
                <span className="text-[10px] font-mono font-bold bg-[#3EE07F]/20 text-[#3EE07F] px-2 py-0.5 rounded border border-[#3EE07F]/30">
                  OPERATIONAL
                </span>
              </div>
              <div className="text-xs text-[#8CA0BA]">
                Central Dronning Maud Land · Antarctica · 70°45′58″S, 11°43′56″E
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="dhruva-modal-close-btn"
            aria-label="Close station modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="dhruva-modal-body space-y-4">
          {/* Key Facts */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#060B14]/80 p-3 rounded-xl border border-white/5">
              <div className="text-[#64748B] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#00E0C6]" />
                <span>DIGITAL TWIN STATUS</span>
              </div>
              <div className="text-[#00E0C6] font-mono font-bold text-sm">
                ONLINE · MQTT SCADA
              </div>
            </div>

            <div className="bg-[#060B14]/80 p-3 rounded-xl border border-white/5">
              <div className="text-[#64748B] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#FFB020]" />
                <span>POWER MICROGRID</span>
              </div>
              <div className="text-white font-medium text-sm">
                4 × 62.5 kVA Diesel + Solar
              </div>
            </div>

            <div className="bg-[#060B14]/80 p-3 rounded-xl border border-white/5">
              <div className="text-[#64748B] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-[#4A9EFF]" />
                <span>WATER PIPELINE</span>
              </div>
              <div className="text-white font-medium text-sm">
                Lake Priyadarshini Trace-Heated
              </div>
            </div>

            <div className="bg-[#060B14]/80 p-3 rounded-xl border border-white/5">
              <div className="text-[#64748B] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>AMBIENT TEMP</span>
              </div>
              <div className="text-[#38BDF8] font-mono font-bold text-sm">
                -28.4°C · Wind 42 km/h
              </div>
            </div>
          </div>

          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Maitri is India&apos;s second permanent research station in Antarctica, commissioned in 1989 on the rocky Schirmacher Oasis.
            Its life-support systems, thermal balance, fuel bunkering, and environmental sensors are modeled in real-time in DhruvaTwin.
          </p>

          {/* Action CTA */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10">
            <span className="text-[11px] text-[#64748B] font-mono">
              STATION ID: MAITRI-01
            </span>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEnterLogin();
              }}
              className="dhruva-btn-primary py-2 px-4 text-xs"
              aria-label="View Maitri Station in Digital Twin Platform"
            >
              <span>VIEW STATION IN TWIN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

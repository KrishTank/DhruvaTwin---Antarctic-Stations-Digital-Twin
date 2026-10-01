/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DhruvaTwin Main Glassmorphism Control Panel
 * Advanced Antarctic research interface with interactive telemetry layers.
 * 
 * National Centre for Polar and Ocean Research (NCPOR) / MoES
 * Smart India Hackathon 2026 - PS 26060 - Team HackFinity007
 */

import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';

interface AntarcticInfoPanelProps {
  onEnterLogin: () => void;
  activePill: string;
  onSelectPill: (pill: string) => void;
}

export const AntarcticInfoPanel: React.FC<AntarcticInfoPanelProps> = ({
  onEnterLogin,
  activePill,
  onSelectPill,
}) => {
  return (
    <aside className="dhruva-glass-panel" aria-label="Antarctic Digital Twin Telemetry Control">
      {/* Header */}
      <div className="dhruva-glass-header">
        <div className="dhruva-glass-badge">
          <span className="dhruva-glass-pulse" aria-hidden="true" />
          <span>DIGITAL TWIN TELEMETRY</span>
        </div>
        <Layers className="w-4 h-4 text-[#00E0C6]/70" />
      </div>

      <h3 className="dhruva-glass-title">ANTARCTIC DIGITAL TWIN</h3>

      <p className="dhruva-glass-desc">
        Explore India&apos;s Antarctic research stations through an interactive virtual environment.
      </p>

      {/* Interactive Telemetry Pills */}
      <div className="dhruva-pills-grid" role="group" aria-label="Environmental telemetric categories">
        <button
          type="button"
          onClick={() => onSelectPill('wildlife')}
          className={`dhruva-telemetry-pill ${activePill === 'wildlife' ? 'active' : ''}`}
          aria-pressed={activePill === 'wildlife'}
        >
          <span>🐧</span>
          <span>WILDLIFE</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectPill('ice')}
          className={`dhruva-telemetry-pill ${activePill === 'ice' ? 'active' : ''}`}
          aria-pressed={activePill === 'ice'}
        >
          <span>🧊</span>
          <span>ICE</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectPill('climate')}
          className={`dhruva-telemetry-pill ${activePill === 'climate' ? 'active' : ''}`}
          aria-pressed={activePill === 'climate'}
        >
          <span>🌡</span>
          <span>CLIMATE</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectPill('research')}
          className={`dhruva-telemetry-pill ${activePill === 'research' ? 'active' : ''}`}
          aria-pressed={activePill === 'research'}
        >
          <span>🔬</span>
          <span>RESEARCH</span>
        </button>
      </div>

      {/* Direct CTA */}
      <button
        type="button"
        onClick={onEnterLogin}
        className="dhruva-btn-primary w-full justify-center"
        aria-label="Enter DhruvaTwin Platform and go to Login"
      >
        <span>ENTER DHRUVATWIN</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </aside>
  );
};

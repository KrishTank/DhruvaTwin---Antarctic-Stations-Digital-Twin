/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DhruvaTwin Minimal Transparent Glass Navigation Header
 * National Centre for Polar and Ocean Research (NCPOR) / MoES
 * Smart India Hackathon 2026 - PS 26060 - Team HackFinity007
 */

import React from 'react';
import { Compass, Globe2, ArrowRight } from 'lucide-react';

interface AntarcticHeaderProps {
  onEnterLogin: () => void;
  activeNav: string;
  onSelectNav: (nav: string) => void;
}

const NAV_ITEMS = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'stations', label: 'STATIONS' },
  { id: 'twin', label: 'DIGITAL TWIN' },
  { id: 'monitoring', label: 'MONITORING' },
  { id: 'simulation', label: 'SIMULATION' },
  { id: 'analytics', label: 'ANALYTICS' },
];

export const AntarcticHeader: React.FC<AntarcticHeaderProps> = ({
  onEnterLogin,
  activeNav,
  onSelectNav,
}) => {
  return (
    <header className="dhruva-nav" role="banner">
      {/* Left: Brand Identity & Hackathon PS ID */}
      <div className="dhruva-nav-brand">
        <div className="dhruva-nav-logo" aria-hidden="true">
          <Globe2 className="w-5 h-5 text-[#00E0C6]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="dhruva-nav-title">DHRUVATWIN</span>
            <span className="text-[10px] font-mono font-bold text-[#00E0C6] bg-[#00E0C6]/10 px-1.5 py-0.5 rounded border border-[#00E0C6]/30">
              PS 26060
            </span>
          </div>
          <div className="dhruva-nav-subtitle">
            Antarctic Stations Digital Twin · NCPOR · MoES
          </div>
        </div>
      </div>

      {/* Center: Desktop Minimal Glass Navigation */}
      <nav className="dhruva-nav-links" aria-label="Antarctic Landing Navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`dhruva-nav-link ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => onSelectNav(item.id)}
            aria-current={activeNav === item.id ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right: Telemetry Signal & Primary Enter Platform Button */}
      <div className="dhruva-nav-right">
        <div className="dhruva-status-pill" title="SCADA & Digital Twin Telemetry Connected">
          <span className="dhruva-status-dot" aria-hidden="true" />
          <span>SYSTEM ONLINE</span>
        </div>

        <button
          type="button"
          onClick={onEnterLogin}
          className="dhruva-enter-btn"
          aria-label="Enter DhruvaTwin Platform and proceed to login"
        >
          <span>ENTER PLATFORM</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

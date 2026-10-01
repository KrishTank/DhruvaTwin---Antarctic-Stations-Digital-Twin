/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DhruvaTwin Cinematic Desktop Hero Section
 * National Centre for Polar and Ocean Research (NCPOR) / MoES
 * Smart India Hackathon 2026 - PS 26060 - Team HackFinity007
 */

import React from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

interface AntarcticHeroProps {
  onEnterLogin: () => void;
  onExplore: () => void;
}

export const AntarcticHero: React.FC<AntarcticHeroProps> = ({
  onEnterLogin,
  onExplore,
}) => {
  return (
    <section className="dhruva-hero-container" aria-label="DhruvaTwin Antarctic Digital Twin Introduction">
      {/* Small futuristic scientific label */}
      <div className="dhruva-hero-pill">
        <Sparkles className="w-3.5 h-3.5 text-[#00E0C6]" />
        <span>ANTARCTIC RESEARCH • DIGITAL TWIN</span>
      </div>

      {/* Main cinematic title */}
      <h1 className="dhruva-hero-title">
        DHRUVATWIN
      </h1>

      {/* Secondary title */}
      <h2 className="dhruva-hero-subtitle">
        ANTARCTIC STATIONS<br />DIGITAL TWIN
      </h2>

      {/* Project description */}
      <p className="dhruva-hero-desc">
        Explore, monitor and simulate India&apos;s Antarctic research stations through an interactive digital twin.
      </p>

      {/* Project context metadata */}
      <div className="dhruva-hero-meta">
        <span>NCPOR</span>
        <span className="dhruva-hero-meta-dot">•</span>
        <span>MoES</span>
        <span className="dhruva-hero-meta-dot">•</span>
        <span>SIH 2026</span>
        <span className="dhruva-hero-meta-dot">•</span>
        <span>PS 26060</span>
      </div>

      {/* Primary & Secondary Call to Actions */}
      <div className="dhruva-hero-actions">
        <button
          type="button"
          onClick={onEnterLogin}
          className="dhruva-btn-primary"
          aria-label="Enter DhruvaTwin Platform and go to Login"
        >
          <span>ENTER DHRUVATWIN</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onExplore}
          className="dhruva-btn-secondary"
          aria-label="Explore Antarctic Virtual Environment"
        >
          <Compass className="w-4 h-4 text-[#4A9EFF]" />
          <span>EXPLORE ANTARCTICA</span>
        </button>
      </div>
    </section>
  );
};

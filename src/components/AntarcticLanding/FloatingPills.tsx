/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DhruvaTwin Floating Environmental HUD Indicators
 * Clean three-zone composition with guaranteed 20-30px spacing and zero overlapping.
 * 
 * Zone 2 (Center 25%):
 *                 46TH ISEA RESEARCH (420-520px wide)
 *                        ↓ (20-30px gap)
 *                  CLIMATE SENSORS (360-480px wide)
 *                        ↓ (20-30px gap)
 *                 MAITRI BASE • OPERATIONAL (420-500px wide)
 * 
 * Zone 1 (Left 45%, lower landscape below CTA):
 *        ICE & GLACIERS
 *               ↓ (25-40px gap)
 *        WILDLIFE SANCTUARY
 * 
 * National Centre for Polar and Ocean Research (NCPOR) / MoES
 * Smart India Hackathon 2026 - PS 26060 - Team HackFinity007
 */

import React from 'react';

export interface FloatingCardsProps {
  onOpenWildlife: () => void;
  onOpenStation: () => void;
  onSelectPill: (pill: string) => void;
}

/**
 * Top Floating Data Cards (Zone 2: Center 25%)
 * Staggered stack with horizontal offsets and guaranteed 20-30px gap
 */
export const FloatingTopCards: React.FC<FloatingCardsProps> = ({
  onOpenStation,
  onSelectPill,
}) => {
  return (
    <div
      className="dhruva-top-cards-cluster"
      aria-label="Antarctic Atmospheric and Research Telemetry"
    >
      {/* 1. 46TH ISEA RESEARCH (Upper-center/right, approx 420-520px wide) */}
      <div
        className="dhruva-hud-card dhruva-card-isea"
        onClick={() => onSelectPill('research')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectPill('research');
          }
        }}
        aria-label="46th ISEA Research Program"
      >
        <div className="dhruva-hud-card-header">
          <span className="dhruva-card-icon">🔬</span>
          <span className="dhruva-card-title">46TH ISEA RESEARCH</span>
          <span className="dhruva-card-status-dot" />
        </div>
        <div className="dhruva-hud-card-body">
          Upper Atmospheric Physics & Magnetometer
        </div>
      </div>

      {/* 2. CLIMATE SENSORS (Directly below ISEA, slightly left, approx 360-480px wide) */}
      <div
        className="dhruva-hud-card dhruva-card-climate"
        onClick={() => onSelectPill('climate')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectPill('climate');
          }
        }}
        aria-label="Climate Sensors Monitoring"
      >
        <div className="dhruva-hud-card-header">
          <span className="dhruva-card-icon">🌡</span>
          <span className="dhruva-card-title">CLIMATE SENSORS</span>
          <span className="dhruva-card-status-dot" />
        </div>
        <div className="dhruva-hud-card-body">
          -28°C · Katabatic 42.6 km/h · 984 hPa
        </div>
      </div>

      {/* 3. MAITRI BASE • OPERATIONAL (Below Climate, slightly right, approx 420-500px wide) */}
      <div
        className="dhruva-hud-card dhruva-card-maitri"
        onClick={onOpenStation}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenStation();
          }
        }}
        aria-label="Maitri Research Station Operational"
      >
        <div className="dhruva-hud-card-header">
          <span className="dhruva-card-icon">🏢</span>
          <span className="dhruva-card-title">MAITRI BASE • OPERATIONAL</span>
          <span className="dhruva-card-status-dot pulse" />
        </div>
        <div className="dhruva-hud-card-body">
          70°45′58″S 11°43′56″E · [VIEW BASE →]
        </div>
      </div>
    </div>
  );
};

/**
 * Lower Information Cards Group (Zone 1: Lower landscape below CTA)
 * ICE & GLACIERS + WILDLIFE SANCTUARY with 25-40px vertical gap
 */
export const FloatingLowerCards: React.FC<FloatingCardsProps> = ({
  onOpenWildlife,
  onSelectPill,
}) => {
  return (
    <div
      className="dhruva-lower-cards-cluster"
      aria-label="Antarctic Cryosphere and Wildlife Telemetry"
    >
      {/* 4. ICE & GLACIERS (Lower-left/middle landscape) */}
      <div
        className="dhruva-hud-card dhruva-card-ice"
        onClick={() => onSelectPill('ice')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectPill('ice');
          }
        }}
        aria-label="Ice and Glaciers Cryosphere Layer"
      >
        <div className="dhruva-hud-card-header">
          <span className="dhruva-card-icon">🧊</span>
          <span className="dhruva-card-title">ICE & GLACIERS</span>
          <span className="dhruva-card-status-dot" />
        </div>
        <div className="dhruva-hud-card-body">
          Schirmacher Shelf · 420m Core Stability
        </div>
      </div>

      {/* 5. WILDLIFE SANCTUARY (Below ICE & GLACIERS, slightly offset) */}
      <div
        className="dhruva-hud-card dhruva-card-wildlife"
        onClick={onOpenWildlife}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenWildlife();
          }
        }}
        aria-label="Emperor Penguin Wildlife Sanctuary"
      >
        <div className="dhruva-hud-card-header">
          <span className="dhruva-card-icon">🐧</span>
          <span className="dhruva-card-title">WILDLIFE SANCTUARY</span>
          <span className="dhruva-card-status-dot pulse" />
        </div>
        <div className="dhruva-hud-card-body">
          Aptenodytes forsteri · [CLICK TO INSPECT]
        </div>
      </div>
    </div>
  );
};

/**
 * Combined FloatingPills component for backward compatibility
 */
export const FloatingPills: React.FC<FloatingCardsProps & { zone?: 'top' | 'lower' | 'all' }> = ({
  zone = 'all',
  ...props
}) => {
  if (zone === 'top') {
    return <FloatingTopCards {...props} />;
  }
  if (zone === 'lower') {
    return <FloatingLowerCards {...props} />;
  }
  return (
    <>
      <FloatingTopCards {...props} />
      <FloatingLowerCards {...props} />
    </>
  );
};


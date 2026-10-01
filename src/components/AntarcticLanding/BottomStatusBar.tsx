/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DhruvaTwin Desktop Telemetry Bottom Status Bar
 * Continuous real-time stream status across polar stations.
 * 
 * National Centre for Polar and Ocean Research (NCPOR) / MoES
 * Smart India Hackathon 2026 - PS 26060 - Team HackFinity007
 */

import React from 'react';

interface BottomStatusBarProps {
  temperature?: number;
}

export const BottomStatusBar: React.FC<BottomStatusBarProps> = ({
  temperature = -28,
}) => {
  return (
    <footer className="dhruva-bottom-bar" role="contentinfo" aria-label="Polar Telemetry Status">
      <div className="dhruva-telemetry-metrics">
        <div className="dhruva-metric-item">
          <span className="dhruva-metric-label">ACTIVE STATIONS:</span>
          <span className="dhruva-metric-val">02</span>
        </div>

        <div className="dhruva-metric-item">
          <span className="dhruva-metric-label">TEMPERATURE:</span>
          <span className="dhruva-metric-val highlight">{temperature}°C</span>
        </div>

        <div className="dhruva-metric-item">
          <span className="dhruva-metric-label">WEATHER:</span>
          <span className="dhruva-metric-val">SNOW</span>
        </div>

        <div className="dhruva-metric-item">
          <span className="dhruva-metric-label">WILDLIFE:</span>
          <span className="dhruva-metric-val highlight">ACTIVE</span>
        </div>

        <div className="dhruva-metric-item">
          <span className="dhruva-metric-label">DIGITAL TWIN:</span>
          <span className="dhruva-metric-val highlight">ONLINE</span>
        </div>
      </div>

      <div className="dhruva-coords">
        <span>SCHIRMACHER OASIS · 70°45′58″S 11°43′56″E · NCPOR / MoES</span>
      </div>
    </footer>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DhruvaTwin Environmental Status Floating Panel
 * Real-time Antarctic telemetry data indicators.
 * 
 * National Centre for Polar and Ocean Research (NCPOR) / MoES
 * Smart India Hackathon 2026 - PS 26060 - Team HackFinity007
 */

import React from 'react';
import { Activity } from 'lucide-react';

interface EnvironmentStatusPanelProps {
  temperature?: number;
}

export const EnvironmentStatusPanel: React.FC<EnvironmentStatusPanelProps> = ({
  temperature = -28,
}) => {
  return (
    <aside className="dhruva-env-panel" aria-label="Antarctic Environmental Telemetry">
      <div className="dhruva-env-header">
        <span className="dhruva-env-title">ANTARCTIC ENVIRONMENT</span>
        <Activity className="w-3.5 h-3.5 text-[#00E0C6]" />
      </div>

      <div className="space-y-1">
        <div className="dhruva-env-row">
          <span className="dhruva-env-label">ACTIVE STATIONS</span>
          <span className="dhruva-env-value">02</span>
        </div>

        <div className="dhruva-env-row">
          <span className="dhruva-env-label">TEMPERATURE</span>
          <span className="dhruva-env-value cyan">{temperature}°C</span>
        </div>

        <div className="dhruva-env-row">
          <span className="dhruva-env-label">WEATHER</span>
          <span className="dhruva-env-value">SNOW</span>
        </div>

        <div className="dhruva-env-row">
          <span className="dhruva-env-label">ICE STATUS</span>
          <span className="dhruva-env-value">STABLE</span>
        </div>

        <div className="dhruva-env-row">
          <span className="dhruva-env-label">SYSTEM</span>
          <span className="dhruva-env-value cyan">ONLINE</span>
        </div>
      </div>
    </aside>
  );
};

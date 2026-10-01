/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DhruvaTwin Antarctic Landing Page — Master Component
 * Premium, immersive, cinematic, DESKTOP-FIRST Antarctic Landing Page.
 * 
 * National Centre for Polar and Ocean Research (NCPOR) / MoES
 * Smart India Hackathon 2026 - PS 26060 - Team HackFinity007
 */

import React, { useState } from 'react';
import './AntarcticLanding.css';

import { AntarcticEnvironment } from './AntarcticEnvironment';
import { PENGUIN_FOCUS_TARGETS } from './penguinData';
import { Snowfall } from './Snowfall';
import { AntarcticHeader } from './AntarcticHeader';
import { AntarcticHero } from './AntarcticHero';
import { AntarcticInfoPanel } from './AntarcticInfoPanel';
import { PenguinInfoPopup } from './PenguinInfoPopup';
import { ResearchStationModal } from './ResearchStationModal';
import { EnvironmentStatusPanel } from './EnvironmentStatusPanel';
import { BottomStatusBar } from './BottomStatusBar';
import { FloatingTopCards, FloatingLowerCards } from './FloatingPills';

interface AntarcticLandingProps {
  onEnterDhruvaTwin: () => void;
  stationTemp?: number;
}

export const AntarcticLanding: React.FC<AntarcticLandingProps> = ({
  onEnterDhruvaTwin,
  stationTemp = -28.4,
}) => {
  // Navigation & Interactive States
  const [activeNav, setActiveNav] = useState('overview');
  const [activePill, setActivePill] = useState('');
  const [isPenguinHovered, setIsPenguinHovered] = useState(false);
  const [hoveredPenguinName, setHoveredPenguinName] = useState('Emperor Mascot');
  const [isPenguinPopupOpen, setIsPenguinPopupOpen] = useState(false);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);

  // 3D Camera Focus & Multi-Penguin Navigation
  const [cameraFocus, setCameraFocus] = useState<
    'overview' | 'station' | 'wildlife' | 'ice' | 'climate' | 'research'
  >('overview');
  const [focusedPenguinIndex, setFocusedPenguinIndex] = useState<number>(-1);

  const handleNextPenguin = () => {
    setFocusedPenguinIndex((prev) => (prev + 1) % PENGUIN_FOCUS_TARGETS.length);
  };

  const handlePrevPenguin = () => {
    setFocusedPenguinIndex((prev) =>
      prev <= 0 ? PENGUIN_FOCUS_TARGETS.length - 1 : prev - 1
    );
  };

  const handleResetFocus = () => {
    setFocusedPenguinIndex(-1);
    setCameraFocus('overview');
  };

  const handleSelectNav = (navId: string) => {
    setActiveNav(navId);
    setFocusedPenguinIndex(-1);
    if (navId === 'stations') {
      setCameraFocus('station');
      setIsStationModalOpen(true);
    } else if (navId === 'monitoring') {
      setCameraFocus('climate');
    } else if (navId === 'twin' || navId === 'simulation') {
      setCameraFocus('station');
    } else {
      setCameraFocus('overview');
    }
  };

  const handleSelectPill = (pillId: string) => {
    setActivePill(pillId);
    if (pillId === 'wildlife') {
      setFocusedPenguinIndex(1); // Focus Social Visitor moving between penguins
      setIsPenguinPopupOpen(true);
    } else if (pillId === 'ice') {
      setFocusedPenguinIndex(-1);
      setCameraFocus('ice');
    } else if (pillId === 'climate') {
      setFocusedPenguinIndex(-1);
      setCameraFocus('climate');
    } else if (pillId === 'research') {
      setFocusedPenguinIndex(-1);
      setCameraFocus('research');
    }
  };

  const handleExplore = () => {
    // Cycle camera to showcase Antarctic research base and wildlife
    if (cameraFocus === 'overview') {
      setFocusedPenguinIndex(0);
    } else if (focusedPenguinIndex >= 0) {
      handleNextPenguin();
    } else {
      setCameraFocus('overview');
    }
  };

  return (
    <div className="dhruva-landing-root" role="main" aria-label="DhruvaTwin Antarctic Landing Experience">
      {/* ── 1. Full-Screen 3D Three.js Antarctic Environment (z-index: 1) ── */}
      <AntarcticEnvironment
        onPenguinHover={(isHovered, name) => {
          setIsPenguinHovered(isHovered);
          if (name) setHoveredPenguinName(name);
        }}
        onPenguinClick={(idx) => {
          if (idx !== undefined && idx >= 0) {
            setFocusedPenguinIndex(idx % PENGUIN_FOCUS_TARGETS.length);
          } else {
            setFocusedPenguinIndex((prev) => (prev + 1) % PENGUIN_FOCUS_TARGETS.length);
          }
        }}
        onStationClick={() => setIsStationModalOpen(true)}
        activeFocus={cameraFocus}
        focusedPenguinIndex={focusedPenguinIndex}
      />

      {/* ── 2. Natural Multi-Layer Falling Snowflakes (z-index: 4, behind UI) ── */}
      <Snowfall />

      {/* ── 3. Minimal Transparent Top Glass Navigation (z-index: 20+) ── */}
      <AntarcticHeader
        onEnterLogin={onEnterDhruvaTwin}
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
      />

      {/* ── 4. Main 16:9 Desktop Command-Center Shell (Three-Zone Composition) ── */}
      <main className="dhruva-desktop-shell" role="region" aria-label="DhruvaTwin Command Center Interface">
        <div className="dhruva-three-zone-layout">
          {/* ── ZONE 1: LEFT 45% (Protected Hero Block & Lower Landscape Cards) ── */}
          <section className="dhruva-zone-left" aria-label="DhruvaTwin Hero Zone">
            {/* Protected Hero Area (z-index: 7 for text, z-index: 8 for CTA) */}
            <div className="dhruva-hero-column">
              <AntarcticHero
                onEnterLogin={onEnterDhruvaTwin}
                onExplore={handleExplore}
              />
            </div>

            {/* Lower Information Cards (z-index: 6, above bottom telemetry, 30px+ below CTA) */}
            <div className="dhruva-lower-cards-container">
              <FloatingLowerCards
                onOpenWildlife={() => {
                  setCameraFocus('wildlife');
                  setIsPenguinPopupOpen(true);
                }}
                onOpenStation={() => {
                  setCameraFocus('station');
                  setIsStationModalOpen(true);
                }}
                onSelectPill={handleSelectPill}
              />
            </div>
          </section>

          {/* ── ZONE 2: CENTER 25% (Top Research Cards Stack & Open Antarctic Environment) ── */}
          <section className="dhruva-zone-center" aria-label="Research Telemetry Zone">
            {/* Top Floating Data Cards Stack (z-index: 6, 20-30px gap, controlled offsets) */}
            <FloatingTopCards
              onOpenWildlife={() => {
                setCameraFocus('wildlife');
                setIsPenguinPopupOpen(true);
              }}
              onOpenStation={() => {
                setCameraFocus('station');
                setIsStationModalOpen(true);
              }}
              onSelectPill={handleSelectPill}
            />

            {/* Quick Observe Button (Initiates camera gliding between penguins) */}
            {focusedPenguinIndex === -1 && (
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => setFocusedPenguinIndex(1)}
                  className="dhruva-quick-observe-pill"
                  title="Glide camera between penguins to observe their movements and interactions"
                  aria-label="Observe Penguins moving from one to another"
                >
                  <span>🐧</span>
                  <span>Observe Penguins (Moving 1 to Another)</span>
                  <span className="text-[#00E0C6] font-mono text-[10px]">►</span>
                </button>
              </div>
            )}

            {/* Interactive Penguin Hover Tooltip (z-index: 6) */}
            {isPenguinHovered && (
              <div
                className="dhruva-penguin-tooltip"
                onClick={() => {
                  const targetIdx = PENGUIN_FOCUS_TARGETS.findIndex((p) =>
                    hoveredPenguinName.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
                  );
                  setFocusedPenguinIndex(targetIdx >= 0 ? targetIdx : 0);
                }}
                role="tooltip"
                aria-label={`${hoveredPenguinName} Antarctic Wildlife, Click to focus view`}
              >
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-white">
                  {hoveredPenguinName.toUpperCase()}
                </div>
                <div className="text-[9px] text-[#00E0C6] font-mono font-bold mt-0.5">
                  Antarctic Wildlife · CLICK TO MOVE CAMERA HERE
                </div>
              </div>
            )}
          </section>

          {/* ── ZONE 3: RIGHT 30% (Dedicated Antarctic Environment Panel) ── */}
          <section className="dhruva-zone-right" aria-label="Antarctic Environment Dashboard Zone">
            <div className="dhruva-dashboard-column">
              <EnvironmentStatusPanel temperature={Math.round(stationTemp)} />

              <AntarcticInfoPanel
                onEnterLogin={onEnterDhruvaTwin}
                activePill={activePill}
                onSelectPill={handleSelectPill}
              />
            </div>
          </section>
        </div>
      </main>

      {/* ── Floating Multi-Penguin Focus Controller Bar (Moving One to Another) ── */}
      {focusedPenguinIndex >= 0 && (
        <div className="dhruva-penguin-focus-bar" role="region" aria-label="Penguin Observation Controller">
          <div className="dhruva-focus-badge">
            <span className="dhruva-focus-icon">🐧</span>
            <span className="dhruva-focus-counter">
              {focusedPenguinIndex + 1} / {PENGUIN_FOCUS_TARGETS.length}
            </span>
          </div>
          <div className="dhruva-focus-info">
            <div className="dhruva-focus-title">
              {PENGUIN_FOCUS_TARGETS[focusedPenguinIndex].name}
            </div>
            <div className="dhruva-focus-desc">
              {PENGUIN_FOCUS_TARGETS[focusedPenguinIndex].role}
            </div>
          </div>
          <div className="dhruva-focus-controls">
            <button
              onClick={handlePrevPenguin}
              className="dhruva-focus-btn"
              title="Previous Penguin"
              aria-label="Previous Penguin"
            >
              ◄ Prev
            </button>
            <button
              onClick={handleNextPenguin}
              className="dhruva-focus-btn dhruva-focus-btn-primary"
              title="Next Penguin"
              aria-label="Next Penguin"
            >
              Next Penguin ►
            </button>
            <button
              onClick={() => setIsPenguinPopupOpen(true)}
              className="dhruva-focus-btn"
              title="Wildlife Information"
              aria-label="Open Wildlife Information"
            >
              ℹ Info
            </button>
            <button
              onClick={handleResetFocus}
              className="dhruva-focus-btn dhruva-focus-btn-close"
              title="Exit to Wide Overview"
              aria-label="Exit to Overview"
            >
              ✕ Overview
            </button>
          </div>
        </div>
      )}

      {/* ── 5. Bottom Telemetry Bar (z-index: 20+) ── */}
      <BottomStatusBar temperature={Math.round(stationTemp)} />

      {/* ── 6. Interactive Modals (z-index: 100) ── */}
      <PenguinInfoPopup
        isOpen={isPenguinPopupOpen}
        onClose={() => setIsPenguinPopupOpen(false)}
      />

      <ResearchStationModal
        isOpen={isStationModalOpen}
        onClose={() => setIsStationModalOpen(false)}
        onEnterLogin={onEnterDhruvaTwin}
      />
    </div>
  );
};

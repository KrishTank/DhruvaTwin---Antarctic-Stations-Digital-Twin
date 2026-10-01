/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DhruvaTwin Antarctic Penguin Observational Targets & Route Data
 * Configured viewpoints for moving between penguins and observing behaviors.
 */

export interface PenguinFocusTarget {
  id: string;
  name: string;
  role: string;
  description: string;
  cameraPos: { x: number; y: number; z: number };
  cameraLook: { x: number; y: number; z: number };
}

export const PENGUIN_FOCUS_TARGETS: PenguinFocusTarget[] = [
  {
    id: 'hero',
    name: 'Emperor Mascot',
    role: 'Station Wildlife Guardian',
    description: 'High-detail Emperor Penguin watching over the Antarctic coast and greeting researchers.',
    cameraPos: { x: 2.4, y: 1.8, z: 14.8 },
    cameraLook: { x: 2.4, y: 0.8, z: 10.5 },
  },
  {
    id: 'visitor',
    name: 'Social Visitor Penguin',
    role: 'Colony Envoy (Visiting Friends)',
    description: 'Active penguin moving sequentially between fellow penguins to exchange Antarctic greeting rituals.',
    cameraPos: { x: 2.2, y: 1.8, z: 12.0 },
    cameraLook: { x: 2.0, y: 0.5, z: 7.0 },
  },
  {
    id: 'caravan',
    name: 'Caravan March',
    role: 'Line Trek (One After Another)',
    description: 'Single-file procession marching across the central snowfield in synchronized sequence.',
    cameraPos: { x: 3.3, y: 1.6, z: 10.5 },
    cameraLook: { x: 3.2, y: 0.3, z: 6.2 },
  },
  {
    id: 'huddle',
    name: 'Colony Huddle',
    role: 'Thermal Protection Trio',
    description: 'Three Emperor penguins huddled closely together against polar winds with communal micro-sways.',
    cameraPos: { x: 4.0, y: 1.4, z: 9.0 },
    cameraLook: { x: 3.9, y: 0.2, z: 4.6 },
  },
  {
    id: 'duo',
    name: 'Communicating Duo',
    role: 'Social Vocalization Pair',
    description: 'Pair of midground penguins nodding in conversation and exchanging wing gestures.',
    cameraPos: { x: 1.6, y: 1.0, z: 2.2 },
    cameraLook: { x: 1.5, y: -0.1, z: -2.4 },
  },
  {
    id: 'lookout',
    name: 'Mountain Ridge Scout',
    role: 'Aurora & Horizon Sentinel',
    description: 'Distant scout positioned near Maitri Base boundary surveying the shimmering southern lights.',
    cameraPos: { x: 3.2, y: 1.0, z: -3.5 },
    cameraLook: { x: 3.2, y: -0.1, z: -8.0 },
  },
];

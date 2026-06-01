/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SlideLayoutType = 'cover' | 'schedule' | 'standard' | 'divider' | 'activity' | 'closing' | 'grid';

export interface PresenterNote {
  title: string;
  points: string[];
}

export interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  section?: string;
  layout: SlideLayoutType;
  presenterNotes: PresenterNote;
  
  // Layout specific attributes
  bannerText?: string; // e.g., "กิจกรรม / ฝึกปฏิบัติ"
  points?: string[];
  subPoints?: Record<string, string[]>;
  illustrationKey?: string;
  hugeText?: string;
  terracottaStripe?: boolean;
}

export interface SelfIntroState {
  hook: string;
  mission: string;
  value: string;
  goal: string;
}

export interface ProjectProposalState {
  title: string;
  challenge: string;
  solution: string;
  outcome: string;
  cta: string;
}

export interface ReflectionCard {
  id: string;
  text: string;
  category: 'start' | 'stop' | 'continue';
}

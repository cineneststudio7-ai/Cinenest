export interface TimecodeSegment {
  startSec: number;
  endSec: number;
  durationSec: number;
  title: string;
  cameraShot: string;
  visualAction: string;
  audioDialogueEn: string;
  audioDialogueBn: string;
  audioDialogueBnScript: string;
  pukuState: string;
  lightingAndLens: string;
}

export interface Episode {
  id: number; // 1 to 105
  title: string;
  titleBn: string;
  timeOfDay: 'Golden Sunrise' | 'Warm Morning' | 'Breezy Midday' | 'Amber Afternoon' | 'Twilit Sunset';
  location: string;
  courtyardOrigin: string;
  prevEpisodeRecap: string; // One line strictly recapping episode N-1 (continuity)
  problem: string;
  learningMoment: string;
  rhyme: {
    title: string;
    bengali: string; // Phonetic / Romanized
    bengaliScript: string; // Bengali Script
    english: string;
    melodyNotes: string;
  };
  pukuGlowLesson: {
    lessonEn: string;
    lessonBn: string;
    lessonBnScript: string;
    pukuVisualAction: string;
    glowColor: string; // e.g. "Warm Rosy Gold"
  };
  closingCliffhanger: string; // Small cliffhanger leading to next episode
  timecodes: {
    opening: TimecodeSegment;   // 0s - 20s (20s)
    adventure: TimecodeSegment; // 20s - 260s (240s)
    lesson: TimecodeSegment;    // 260s - 300s (40s)
    closing: TimecodeSegment;   // 300s - 330s (30s)
  };
  productionPrompts: {
    establishingShot: string;
    adventureKeyframe: string;
    rhymeSongScene: string;
    pukuGlowLessonKeyframe: string;
    closingShot: string;
    omniVideoKinematicPrompt: string;
  };
  tags: string[];
}

export interface EncryptedVaultItem {
  id: string;
  title: string;
  category: 'note' | 'draft' | 'bookmark' | 'export_log' | 'sticker_order';
  episodeId?: number;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface StorageEncryptionPayload {
  version: number;
  cipherText: string;
  iv: string;
  salt: string;
}

export interface CharacterProfile {
  id: 'rutti' | 'putti' | 'roboc' | 'puchu' | 'puku' | string;
  name: string;
  nameBn: string;
  role: string;
  tagline: string;
  bio: string;
  personalityTraits: string[];
  signatureItem: string;
  voiceNotes: string;
  lockedTraits: { label: string; value: string }[];
  soundbites: { title: string; en: string; bn: string; speechText: string }[];
  featuredEpisodeIds: number[];
}

export interface UniverseLocation {
  id: string;
  name: string;
  nameBn: string;
  growthOrigin: string;
  description: string;
  signatureElement: string;
  bestTimeOfDay: string;
  featuredEpisodeIds: number[];
}

export interface CoworkerStickerOrder {
  id: string;
  stickerId: string;
  stickerName: string;
  category: string;
  recipientName: string;
  senderName: string;
  customMessage: string;
  characterPose: string;
  mockupFormat: string;
  timestamp: number;
}

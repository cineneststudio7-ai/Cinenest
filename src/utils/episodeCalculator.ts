import { Episode } from '../types/series';

export const TOTAL_EPISODE_SECONDS = 330;
export const OPENING_SECONDS = 20;
export const ADVENTURE_SECONDS = 240;
export const LESSON_SECONDS = 40;
export const CLOSING_SECONDS = 30;

export function formatTimecode(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function validateEpisodeTiming(episode: Episode): {
  isValid: boolean;
  total: number;
  breakdown: { opening: number; adventure: number; lesson: number; closing: number };
} {
  const opening = episode.timecodes.opening.durationSec;
  const adventure = episode.timecodes.adventure.durationSec;
  const lesson = episode.timecodes.lesson.durationSec;
  const closing = episode.timecodes.closing.durationSec;
  const total = opening + adventure + lesson + closing;

  return {
    isValid:
      total === TOTAL_EPISODE_SECONDS &&
      opening === OPENING_SECONDS &&
      adventure === ADVENTURE_SECONDS &&
      lesson === LESSON_SECONDS &&
      closing === CLOSING_SECONDS,
    total,
    breakdown: { opening, adventure, lesson, closing },
  };
}

export function exportEpisodeToPlainText(episode: Episode, personalNote?: string): string {
  const timing = validateEpisodeTiming(episode);
  const sep = '='.repeat(70);
  const subSep = '-'.repeat(70);

  return `${sep}
PUCHU PUKU 3D CGI ANIMATION SERIES
EPISODE ${episode.id} OF 105: "${episode.title}" (${episode.titleBn})
TOTAL RUNTIME: ${TOTAL_EPISODE_SECONDS} SECONDS (05:30) | RESOLUTION: 720p 16:9 3D CGI PIXAR STYLE
${sep}

[CHARACTER LOCK SPECIFICATIONS - STRICT PRODUCTION DIRECTIVE]
- PUCHU: Toddler baby girl, curly brown pigtails with emerald green ribbons, rosy cheeks, fine freckles across nose bridge, large warm brown eyes, light mint green A-line dress with white Peter Pan collar. Identical face/scale across all 105 episodes.
- PUKU: Round smiling white ceramic mug companion with expressive eyes and internal glowing heart (glows warm golden-pink when lesson learned).
- COURTYARD SIGNATURE: Sunny Bangladeshi village courtyard, terracotta flower pots (marigold & jasmine), wicker picnic basket, checkered tablecloth on rustic garden table.

[SERIES CONTINUITY]
PREVIOUS EPISODE RECAP:
"${episode.prevEpisodeRecap}"

[EPISODE OVERVIEW]
Time of Day: ${episode.timeOfDay}
Location Setting: ${episode.location} (Grown out of: ${episode.courtyardOrigin})
Themes / Tags: ${episode.tags.join(', ')}

CORE PROBLEM:
${episode.problem}

LEARNING MOMENT:
${episode.learningMoment}

${subSep}
SCENE-BY-SCENE PRODUCTION BREAKDOWN (EXACTLY 330 SECONDS)
${subSep}

--- PART 1: OPENING [00:00 - 00:20] (20 SECONDS) ---
Camera: ${episode.timecodes.opening.cameraShot}
Lighting: ${episode.timecodes.opening.lightingAndLens}
Visual: ${episode.timecodes.opening.visualAction}
Dialogue (EN): ${episode.timecodes.opening.audioDialogueEn}
Dialogue (BN Script): ${episode.timecodes.opening.audioDialogueBnScript}
Dialogue (BN Romanized): ${episode.timecodes.opening.audioDialogueBn}
Puku State: ${episode.timecodes.opening.pukuState}

--- PART 2: THE ADVENTURE & RHYME [00:20 - 04:20] (240 SECONDS) ---
Camera: ${episode.timecodes.adventure.cameraShot}
Lighting: ${episode.timecodes.adventure.lightingAndLens}
Visual: ${episode.timecodes.adventure.visualAction}
Dialogue (EN): ${episode.timecodes.adventure.audioDialogueEn}
Dialogue (BN Script): ${episode.timecodes.adventure.audioDialogueBnScript}
Dialogue (BN Romanized): ${episode.timecodes.adventure.audioDialogueBn}

[FEATURED BILINGUAL SONG / RHYME]
Song Title: "${episode.rhyme.title}"
Bengali Script:
${episode.rhyme.bengaliScript}

Bengali (Romanized):
${episode.rhyme.bengali}

English Translation & Sing-Along:
${episode.rhyme.english}

Musical Direction: ${episode.rhyme.melodyNotes}

--- PART 3: LESSON RECAP & PUKU GLOW [04:20 - 05:00] (40 SECONDS) ---
Camera: ${episode.timecodes.lesson.cameraShot}
Lighting: ${episode.timecodes.lesson.lightingAndLens}
Visual: ${episode.timecodes.lesson.visualAction}
Puku Glow Action: ${episode.pukuGlowLesson.pukuVisualAction} (${episode.pukuGlowLesson.glowColor})
Puchu Lesson (EN): "${episode.pukuGlowLesson.lessonEn}"
Puchu Lesson (BN Script): "${episode.pukuGlowLesson.lessonBnScript}"
Puchu Lesson (BN Romanized): "${episode.pukuGlowLesson.lessonBn}"

--- PART 4: CLOSING & CLIFFHANGER [05:00 - 05:30] (30 SECONDS) ---
Camera: ${episode.timecodes.closing.cameraShot}
Lighting: ${episode.timecodes.closing.lightingAndLens}
Visual: ${episode.timecodes.closing.visualAction}
Closing Cliffhanger Line: "${episode.closingCliffhanger}"
Lead-In to Episode ${episode.id === 105 ? 1 : episode.id + 1}

${subSep}
PIXAR-GRADE 3D CGI PRODUCTION PROMPTS
${subSep}
1. Establishing Shot:
${episode.productionPrompts.establishingShot}

2. Adventure Keyframe:
${episode.productionPrompts.adventureKeyframe}

3. Rhyme Song Scene:
${episode.productionPrompts.rhymeSongScene}

4. Puku Glow Lesson Keyframe:
${episode.productionPrompts.pukuGlowLessonKeyframe}

5. Closing Shot:
${episode.productionPrompts.closingShot}

6. Omni 1.1 Flash Video Kinematic Prompt:
${episode.productionPrompts.omniVideoKinematicPrompt}
${personalNote ? `\n${subSep}\n[PERSONAL PRODUCTION NOTES (ENCRYPTED IN LOCAL DATABASE)]\n${personalNote}\n` : ''}
${sep}
END OF EPISODE ${episode.id} SCRIPT
${sep}
`;
}

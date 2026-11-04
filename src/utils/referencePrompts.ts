export interface CharacterAnalysis {
  characterName: string;
  visualStyle: string;
  eyeColor: string;
  hairStyleAndColor: string;
  upperOutfit: string;
  fullOutfitAndFootwear: string;
  proportionsAndFeatures: string;
}

export const PUCHU_MASTER_ANALYSIS: CharacterAnalysis = {
  characterName: "Puchu",
  visualStyle: "Pixar-quality stylized 3D CGI animation, soft subsurface scattering, warm cinematic lighting",
  eyeColor: "Warm expressive chocolate brown eyes with bright specular highlights and subtle child-like wonder",
  hairStyleAndColor: "Voluminous curly chestnut brown hair tied into two high bouncy pigtails with emerald green satin ribbon bows",
  upperOutfit: "Light mint green toddler A-line dress with a rounded Peter Pan white cotton collar and small front button details",
  fullOutfitAndFootwear: "Light mint green toddler A-line pinafore dress with rounded Peter Pan white collar, soft white ankle socks, and dark chocolate brown mary-jane shoes",
  proportionsAndFeatures: "Toddler chibi stylized proportions, chubby rosy cheeks with delicate natural freckles across the nose bridge, gentle button nose, small happy smiling mouth"
};

export const PUKU_MASTER_ANALYSIS = {
  characterName: "Puku",
  visualStyle: "Pixar-quality stylized 3D CGI animation with high-gloss glazed ceramic shaders",
  objectDescription: "Round, smiling white ceramic tea mug companion with animated expressive oval black eyes, curved mouth, a sturdy ceramic handle on the right side, and an internal magical glowing heart emblem that pulses warm golden-pink",
  materialsAndColors: "Glossy white porcelain ceramic, smooth glazed finish, reflective highlights, soft warm pink blush on ceramic cheeks"
};

/**
 * 1. Full-Body Character Sheet Generator
 */
export function generateFullBodyCharacterSheetPrompt(analysis: CharacterAnalysis = PUCHU_MASTER_ANALYSIS): string {
  return `Create a 4-view full-body character reference sheet based on the uploaded reference image, in ${analysis.visualStyle}, arranged horizontally on a plain neutral gray background.
Eye Color: ${analysis.eyeColor}
Outfit and Footwear: ${analysis.fullOutfitAndFootwear}

Show the same character in four evenly spaced views: front, strict left-side profile (90°), back, and left-facing three-quarter view (45°). Keep the full body and feet visible, with consistent scale and proportions.

Strictly lock and preserve the character's exact identity, facial features, skin tone, hairstyle, and hair color from the reference image. Completely remove and ignore only sunglasses or dark/reflective eyewear that hide the eyes (do not show them anywhere).

Ensure the character’s hands are completely empty and visible, free of any handheld items.

Standing in a relaxed natural A-pose with arms held slightly away from the torso and open fingers, clean neutral studio lighting, sharp focus on all details. A clean seamless composition without any written text, typography, or dividing border lines.`;
}

/**
 * 2. Medium-Shot Character Grid Generator
 */
export function generateMediumShotGridPrompt(analysis: CharacterAnalysis = PUCHU_MASTER_ANALYSIS): string {
  return `Create a 4-panel medium-shot character reference sheet based on the uploaded reference image, in ${analysis.visualStyle}, laid out on a 16:9 canvas with a plain neutral gray background.

Eye Color: ${analysis.eyeColor}
Upper Outfit: ${analysis.upperOutfit}

Split the canvas into four distinct framing views arranged in a balanced two-by-two layout (top-left: front view, top-right: strict left profile at 90°, bottom-left: three-quarter view at 45°, bottom-right: rear back-of-head view). Exactly four views in total, no more and no less.

Show the same character framed consistently from the mid-chest upward across all four quadrants. Keep framing scale, head size, and lighting identical in every view.

Strictly lock and preserve the character's exact identity, facial features, skin tone, hair color, and natural hairstyle from the reference image. Completely remove and ignore only sunglasses or dark/reflective eyewear that hide the eyes (do not show them anywhere).

Clean neutral studio lighting, sharp focus on all details. A clean seamless composition without any written text, typography, black dividers, panel borders, or frame lines.`;
}

/**
 * 3. Prop & Object Reference Sheet Generator
 */
export function generatePropReferenceSheetPrompt(
  objectDesc: string = PUKU_MASTER_ANALYSIS.objectDescription,
  visualStyle: string = PUKU_MASTER_ANALYSIS.visualStyle
): string {
  return `Create a professional two-view prop reference sheet for ${objectDesc} based on the uploaded reference image, in ${visualStyle}.

Arrange two complete views of the exact same object side by side with balanced spacing on a plain seamless medium-gray background.

Left view: Front view (or primary side profile)
Right view: Three-quarter view (or opposite profile to display all functional parts)

Strictly lock and preserve the object's original shape, proportions, construction, materials, colors, and weathered surface details directly from the reference image. Keep both views fully visible, centered, and rendered at an identical scale.

Show the object isolated as a clean studio product display, completely free of hands, holders, characters, or pedestals. Consistent studio lighting, sharp focus on materials and textures. A clean presentation without any written text, labels, logos, or dividing border lines.`;
}

/**
 * 4. Character Scene Generator
 */
export function generateCharacterScenePrompt(options: {
  action: string;
  environment: string;
  interaction: string;
  envDetails: string;
  lighting?: string;
  analysis?: CharacterAnalysis;
}): string {
  const analysis = options.analysis || PUCHU_MASTER_ANALYSIS;
  const lighting = options.lighting || "Warm golden morning sunlight filtering through courtyard leaves, soft depth of field";

  return `A candid, cinematic medium-wide shot of the exact same character from the reference image, fully preserving their specific identity, facial features, hairstyle, and their exact outfit [${analysis.upperOutfit}, curly brown pigtails with green ribbons] based directly on the provided reference, now in ${analysis.visualStyle}.

The character is ${options.action} in ${options.environment}.

Capture an unposed, natural moment where the character is fully engaged with the scene [${options.interaction}].

Environment details: [${options.envDetails}].

${lighting}, realistic depth of field with the background softly out of focus, natural color grading. A single-frame cinematic still with no splits, no borders, no UI overlays, and no written text.`;
}

/**
 * 5. Scene to Video Motion Generator (for Omni 1.1 Flash)
 * Must remain under 30 words strictly!
 */
export function generateOmniVideoMotionPrompt(options: {
  cameraMovement?: string;
  characterAction?: string;
  environmentPhysics?: string;
}): string {
  const cam = options.cameraMovement || "Slow Dolly-in";
  const action = options.characterAction || "Puchu blinks with curiosity, smiling as Puku rocks gently";
  const physics = options.environmentPhysics || "Soft steam rising from mug, leaves swaying in breeze";

  // Formatted kinematic prompt for Omni 1.1 Flash under 30 words
  return `Camera Movement: ${cam}. Character Action: ${action}. Environment Physics: ${physics}. Pacing: Smooth continuous motion, 24fps.`;
}

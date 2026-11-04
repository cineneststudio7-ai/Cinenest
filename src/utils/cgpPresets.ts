/**
 * CGP (Cinematography, Color Grading & Post-Production) Suite for CineNest Studio
 * Tailored for Disney/Pixar 3D stylized preschool series (Puchu Puku / Rutti & Putti).
 * Generates realtime CSS filters, camera lens profiles, and downloadable .cube 3D LUTs / EDLs
 * for agency-grade video editing in DaVinci Resolve, Premiere Pro, and Final Cut.
 */

export interface CGPPreset {
  id: string;
  name: string;
  category: 'Courtyard' | 'Atmospheric' | 'Stylized' | 'Broadcast';
  description: string;
  colorGrade: {
    temperature: number; // -50 (Cool) to +50 (Warm)
    tint: number; // -50 (Green) to +50 (Magenta)
    exposure: number; // -2.0 to +2.0 EV
    contrast: number; // 0.8 to 1.4
    saturation: number; // 0.5 to 1.8
    vibrance: number;
    filmGrain: number; // 0 to 100%
    bloomGlow: number; // 0 to 100%
    vignette: number; // 0 to 100%
    lutHueRotateDeg: number;
  };
  cameraLens: {
    lensModel: string;
    focalLengthMm: number;
    apertureFStop: string;
    bokehStyle: 'Circular Creamy' | 'Anamorphic Oval' | 'Soft Dreamy';
    anamorphicStreak: boolean;
  };
  audioMasterProfile: {
    dialogueWarmth: string;
    folkInstrumentBalance: string;
    ambientBed: string;
    eqCurve: string;
  };
}

export const CGP_PRESETS: CGPPreset[] = [
  {
    id: 'pixar-golden-courtyard',
    name: 'Pixar Warm Courtyard',
    category: 'Courtyard',
    description: 'Rich amber sunlight, soft peach skin subsurface scattering, terracotta soil warmth, and creamy 35mm bokeh.',
    colorGrade: {
      temperature: 24,
      tint: 4,
      exposure: 0.15,
      contrast: 1.08,
      saturation: 1.25,
      vibrance: 1.2,
      filmGrain: 12,
      bloomGlow: 28,
      vignette: 18,
      lutHueRotateDeg: 2,
    },
    cameraLens: {
      lensModel: 'Arri Master Anamorphic 35mm T1.9',
      focalLengthMm: 35,
      apertureFStop: 'f/1.9',
      bokehStyle: 'Anamorphic Oval',
      anamorphicStreak: true,
    },
    audioMasterProfile: {
      dialogueWarmth: '+3dB @ 250Hz child resonance, gentle de-esser',
      folkInstrumentBalance: 'Bansuri flute centered, Dotara panned 25% R',
      ambientBed: 'Rural morning finches, gentle breeze in banana leaves',
      eqCurve: 'Warm Broadcast Standard (-0.5dB @ 10kHz roll-off)',
    },
  },
  {
    id: 'monsoon-emerald-rain',
    name: 'Monsoon Teal & Terracotta',
    category: 'Atmospheric',
    description: 'Rain-washed emerald greens, moody damp clay reflections, high specular highlight bloom on wet terracotta.',
    colorGrade: {
      temperature: -14,
      tint: -10,
      exposure: -0.05,
      contrast: 1.15,
      saturation: 1.18,
      vibrance: 1.1,
      filmGrain: 20,
      bloomGlow: 35,
      vignette: 30,
      lutHueRotateDeg: -4,
    },
    cameraLens: {
      lensModel: 'Cooke S4/i 50mm Prime f/2.0',
      focalLengthMm: 50,
      apertureFStop: 'f/2.0',
      bokehStyle: 'Circular Creamy',
      anamorphicStreak: false,
    },
    audioMasterProfile: {
      dialogueWarmth: 'High vocal intelligibility with room dampening',
      folkInstrumentBalance: 'Ektara drone in lower register, water drop foley',
      ambientBed: 'Gentle monsoon drizzle on tin roof and courtyard puddle plinks',
      eqCurve: 'Cinema Dynamic Range (wide stereo spread)',
    },
  },
  {
    id: 'twilight-lantern-puku',
    name: 'Twilight Lantern Glow',
    category: 'Atmospheric',
    description: 'Deep cobalt sky with contrasting golden-pink interior luminescence from Puku’s heart and oil lamps.',
    colorGrade: {
      temperature: 18,
      tint: 15,
      exposure: -0.2,
      contrast: 1.22,
      saturation: 1.35,
      vibrance: 1.3,
      filmGrain: 25,
      bloomGlow: 50,
      vignette: 45,
      lutHueRotateDeg: 6,
    },
    cameraLens: {
      lensModel: 'Leica Summilux-C 85mm T1.4',
      focalLengthMm: 85,
      apertureFStop: 'f/1.4',
      bokehStyle: 'Soft Dreamy',
      anamorphicStreak: true,
    },
    audioMasterProfile: {
      dialogueWarmth: 'Intimate bedtime warmth, low proximity boost',
      folkInstrumentBalance: 'Soft bamboo flute harmonic whisper, gentle glockenspiel',
      ambientBed: 'Night crickets, distant river lapping, soft courtyard firefly hum',
      eqCurve: 'Gentle Preschool Lullaby Profile (-2dB @ 4kHz harshness)',
    },
  },
  {
    id: 'technicolor-preschool-pop',
    name: 'Technicolor Preschool Pop',
    category: 'Broadcast',
    description: 'Ultra-clear, high-vibrancy educational palette tuned for toddler optical attention, pristine clarity.',
    colorGrade: {
      temperature: 8,
      tint: 0,
      exposure: 0.25,
      contrast: 1.05,
      saturation: 1.45,
      vibrance: 1.4,
      filmGrain: 4,
      bloomGlow: 15,
      vignette: 10,
      lutHueRotateDeg: 0,
    },
    cameraLens: {
      lensModel: 'Zeiss Supreme Prime 28mm T1.5',
      focalLengthMm: 28,
      apertureFStop: 'f/2.8',
      bokehStyle: 'Circular Creamy',
      anamorphicStreak: false,
    },
    audioMasterProfile: {
      dialogueWarmth: 'Punchy broadcast presence, 0VU normalized',
      folkInstrumentBalance: 'Bright acoustic nylon guitar, crisp tabla accents',
      ambientBed: 'Subtle uplifting courtyard sun birds',
      eqCurve: 'YouTube Kids / US PBS Kids Broadcast EBU R128 (-14 LUFS)',
    },
  },
  {
    id: 'bengal-vintage-16mm',
    name: 'Bengal 16mm Heritage Film',
    category: 'Stylized',
    description: 'Warm analog organic halation, soft sepia shadow tints, authentic celluloid feel reminiscent of classic cinema.',
    colorGrade: {
      temperature: 32,
      tint: 12,
      exposure: 0.05,
      contrast: 1.18,
      saturation: 0.95,
      vibrance: 0.9,
      filmGrain: 48,
      bloomGlow: 38,
      vignette: 40,
      lutHueRotateDeg: 5,
    },
    cameraLens: {
      lensModel: 'Canon K35 Vintage 24mm f/1.6',
      focalLengthMm: 24,
      apertureFStop: 'f/2.0',
      bokehStyle: 'Soft Dreamy',
      anamorphicStreak: false,
    },
    audioMasterProfile: {
      dialogueWarmth: 'Analog tape saturation warmth with gentle tape hiss',
      folkInstrumentBalance: 'Authentic Baul dotara strumming and harmonium breath',
      ambientBed: 'Village wind, river ferry horn in distance',
      eqCurve: 'Warm Vintage Heritage (-1dB high shelf @ 8kHz)',
    },
  },
];

/**
 * Computes CSS filter string corresponding to a CGPPreset
 */
export function getCGPCssFilter(preset: CGPPreset, customWarmth = 0, customExposure = 0): string {
  const c = preset.colorGrade;
  const tempAdjust = (c.temperature + customWarmth) * 0.4;
  const sepia = Math.max(0, Math.min(1, (c.temperature + customWarmth + 20) / 100 * 0.35));
  const brightness = Math.max(0.6, Math.min(1.5, 1 + c.exposure + customExposure));
  const contrast = c.contrast;
  const saturate = c.saturation;
  const hueRotate = c.lutHueRotateDeg + (tempAdjust > 0 ? 2 : -2);

  return `brightness(${brightness.toFixed(2)}) contrast(${contrast.toFixed(2)}) saturate(${saturate.toFixed(2)}) sepia(${sepia.toFixed(2)}) hue-rotate(${hueRotate}deg)`;
}

/**
 * Generates an Adobe Premiere Pro / DaVinci Resolve 3D LUT (.cube file format)
 */
export function generateDaVinciResolveCubeLUT(preset: CGPPreset): string {
  const size = 16;
  let lines: string[] = [];
  lines.push(`# CineNest Studio - Agency Grade 3D LUT`);
  lines.push(`# Title: ${preset.name}`);
  lines.push(`# Series: Puchu Puku (105-Episode Pixar/Disney Standard)`);
  lines.push(`# Target Camera: ${preset.cameraLens.lensModel} (${preset.cameraLens.apertureFStop})`);
  lines.push(`LUT_3D_SIZE ${size}`);
  lines.push('');

  const tempFactor = (preset.colorGrade.temperature + 50) / 100;
  const satFactor = preset.colorGrade.saturation;
  const contrast = preset.colorGrade.contrast;

  for (let b = 0; b < size; b++) {
    for (let g = 0; g < size; g++) {
      for (let r = 0; r < size; r++) {
        let rNorm = r / (size - 1);
        let gNorm = g / (size - 1);
        let bNorm = b / (size - 1);

        // Apply temperature shift
        rNorm = Math.min(1, Math.max(0, rNorm * (0.9 + tempFactor * 0.25)));
        bNorm = Math.min(1, Math.max(0, bNorm * (1.1 - tempFactor * 0.2)));

        // Contrast
        rNorm = Math.min(1, Math.max(0, (rNorm - 0.5) * contrast + 0.5));
        gNorm = Math.min(1, Math.max(0, (gNorm - 0.5) * contrast + 0.5));
        bNorm = Math.min(1, Math.max(0, (bNorm - 0.5) * contrast + 0.5));

        // Saturation
        const luma = 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
        rNorm = Math.min(1, Math.max(0, luma + (rNorm - luma) * satFactor));
        gNorm = Math.min(1, Math.max(0, luma + (gNorm - luma) * satFactor));
        bNorm = Math.min(1, Math.max(0, luma + (bNorm - luma) * satFactor));

        lines.push(`${rNorm.toFixed(6)} ${gNorm.toFixed(6)} ${bNorm.toFixed(6)}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Generates an Edit Decision List (EDL) text representation for video editors
 */
export function generateAgencyEDL(episodeId: number, title: string, preset: CGPPreset): string {
  return `TITLE: CINEMEST_EP${String(episodeId).padStart(3, '0')}_${title.toUpperCase().replace(/\s+/g, '_')}
FCM: NON-DROP FRAME

001  AX       V     C        00:00:00:00 00:00:20:00 00:00:00:00 00:00:20:00
* FROM CLIP NAME: EP${episodeId}_PART1_COURTYARD_OPENING.MOV
* CGP PRESET: ${preset.name} (${preset.cameraLens.lensModel})
* COLOR LUT: ${preset.id}.cube
* AUDIO STEM 1: DIALOGUE_EN_BN_24BIT_48KHZ
* AUDIO STEM 2: BENGALI_FOLK_BANSURI_DRONE

002  AX       V     C        00:00:20:00 00:04:20:00 00:00:20:00 00:04:20:00
* FROM CLIP NAME: EP${episodeId}_PART2_ADVENTURE_RHYME.MOV
* CGP PRESET: ${preset.name}
* LENS APERTURE: ${preset.cameraLens.apertureFStop}
* KEYFRAME ACTION: PUCHU & PUKU BILINGUAL SONG (ECHO CUE)

003  AX       V     C        00:04:20:00 00:05:00:00 00:04:20:00 00:05:00:00
* FROM CLIP NAME: EP${episodeId}_PART3_PUKU_GLOW_LESSON.MOV
* VFX BLOOM: ${preset.colorGrade.bloomGlow}% ANAMORPHIC HEART PULSE
* MASTER LUFS: -14.0 LUFS EBU R128

004  AX       V     C        00:05:00:00 00:05:30:00 00:05:00:00 00:05:30:00
* FROM CLIP NAME: EP${episodeId}_PART4_CLOSING_CLIFFHANGER.MOV
* TOTAL RUNTIME: EXACTLY 330.00 SECONDS (05:30)
`;
}

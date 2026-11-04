/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StickerSvgOptions {
  stickerName: string;
  stickerNameBn: string;
  category: string;
  customMessage: string;
  recipientName: string;
  senderName: string;
  characterPose?: string;
}

export const CHARACTER_POSE_LABELS: Record<string, string> = {
  puchu_puku_tea: '🍵 Puchu & Puku Warm Tea Pour',
  puku_glowing_heart: '💖 Puku Glowing Heart of Joy',
  banana_leaf_rain: '🌿 Banana Leaf Courtyard Shelter',
  shabash_applause: '🌟 Shabash! Standing Ovation',
};

/**
 * Escapes characters for safe XML/SVG embedding.
 */
export function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates an SVG string for a Puchu & Puku die-cut sticker
 * embedding the personalized custom message, recipient, and sender.
 */
export function generateStickerSvg(options: StickerSvgOptions): string {
  const safeMsg = escapeXml((options.customMessage || '').trim().slice(0, 80));
  const safeRecipient = escapeXml((options.recipientName || '').trim().slice(0, 45));
  const safeSender = escapeXml((options.senderName || '').trim().slice(0, 45));
  const safeName = escapeXml(options.stickerName || 'Courtyard Kindness');
  const safeNameBn = escapeXml(options.stickerNameBn || 'উঠোনের সৌহার্দ্য');
  const safeCategory = escapeXml((options.category || 'Appreciation').toUpperCase());
  const poseText = escapeXml(CHARACTER_POSE_LABELS[options.characterPose || 'puchu_puku_tea'] || '🍵 Puchu & Puku Special Edition');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="460" viewBox="0 0 460 460">
  <defs>
    <radialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.95" />
      <stop offset="60%" stop-color="#fb7185" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.1" />
    </radialGradient>
    <filter id="stickerShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#78350f" flood-opacity="0.22" />
    </filter>
    <linearGradient id="msgBannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef3c7" />
      <stop offset="100%" stop-color="#fde68a" />
    </linearGradient>
  </defs>

  <!-- Die-cut outer white decal border with shadow -->
  <rect x="20" y="20" width="420" height="420" rx="38" fill="#ffffff" stroke="#e2e8f0" stroke-width="6" filter="url(#stickerShadow)" />
  <!-- Inner warm courtyard backdrop -->
  <rect x="32" y="32" width="396" height="396" rx="30" fill="#fffbeb" />

  <!-- Header Category Badge -->
  <rect x="120" y="46" width="220" height="26" rx="13" fill="#047857" />
  <text x="230" y="63" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="1">${safeCategory} • COURTYARD DECAL</text>

  <!-- Puku Ceramic Mug Graphic -->
  <circle cx="230" cy="148" r="54" fill="#ffffff" stroke="#cbd5e1" stroke-width="4" />
  <!-- Mug Handle -->
  <path d="M 284 132 C 308 132 308 164 284 164" fill="none" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round" />
  <!-- Puku Glowing Heart -->
  <circle cx="230" cy="162" r="19" fill="url(#heartGlow)" />
  <path d="M 230 156 C 226 150 219 152 219 158 C 219 165 230 171 230 171 C 230 171 241 165 241 158 C 241 152 234 150 230 156 Z" fill="#ffffff" />
  <!-- Puku Eyes & Rosy Smile -->
  <ellipse cx="221" cy="136" rx="4" ry="5.5" fill="#1e293b" />
  <ellipse cx="239" cy="136" rx="4" ry="5.5" fill="#1e293b" />
  <ellipse cx="215" cy="144" rx="3.5" ry="2" fill="#fda4af" />
  <ellipse cx="245" cy="144" rx="3.5" ry="2" fill="#fda4af" />
  <path d="M 225 144 Q 230 149 235 144" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" />

  <!-- Character Pose Tag -->
  <text x="230" y="218" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="600" fill="#059669" text-anchor="middle">${poseText}</text>

  <!-- Sticker Titles -->
  <text x="230" y="246" font-family="Georgia, serif" font-size="20" font-weight="bold" fill="#1c1917" text-anchor="middle">${safeName}</text>
  <text x="230" y="266" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#047857" text-anchor="middle">${safeNameBn}</text>

  <!-- Custom Message Banner / Personalized Text -->
  <rect x="46" y="282" width="368" height="42" rx="12" fill="url(#msgBannerGrad)" stroke="#f59e0b" stroke-width="1.5" />
  <text x="230" y="308" font-family="Georgia, serif" font-size="12" font-style="italic" font-weight="bold" fill="#78350f" text-anchor="middle">“${safeMsg || 'Bringing warm smiles to your day!'}”</text>

  <!-- Recipient & Sender Dedication -->
  <text x="230" y="348" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="600" fill="#334155" text-anchor="middle">To: ${safeRecipient || 'Valued Teammate'}</text>
  <text x="230" y="367" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#64748b" text-anchor="middle">From: ${safeSender || 'Courtyard Team'}</text>

  <!-- Authenticity Watermark -->
  <text x="230" y="404" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#94a3af" text-anchor="middle">Puchu &amp; Puku Character Studio © 105-Episode Pre-K &amp; Coworker Universe</text>
</svg>`;
}

/**
 * Creates a data URI for direct embedding or downloading in browsers.
 */
export function createStickerDataUri(svgContent: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
}

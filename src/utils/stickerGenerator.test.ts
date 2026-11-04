import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateStickerSvg, escapeXml, createStickerDataUri } from './stickerGenerator.ts';

test('escapeXml escapes &, <, >, ", and single quotes', () => {
  const unescaped = 'Tea & "Joy" <Puchu\'s Picnic> > Garden';
  const escaped = escapeXml(unescaped);
  assert.equal(escaped, 'Tea &amp; &quot;Joy&quot; &lt;Puchu&apos;s Picnic&gt; &gt; Garden');
});

test('generateStickerSvg embeds custom message, names, and titles in SVG', () => {
  const customMessage = 'You are the calm in every sprint storm!';
  const svg = generateStickerSvg({
    stickerName: 'Courtyard Calm & Resilient',
    stickerNameBn: 'উঠোনের শান্ত ধৈর্য',
    category: 'Encouragement',
    customMessage,
    recipientName: 'Sarah Jenkins',
    senderName: 'Priyo & Frontend Team',
    characterPose: 'banana_leaf_rain',
  });

  // Verify custom message is embedded
  assert.match(svg, new RegExp(`“${customMessage}”`));
  assert.match(svg, /To: Sarah Jenkins/);
  assert.match(svg, /From: Priyo &amp; Frontend Team/);
  assert.match(svg, /Courtyard Calm &amp; Resilient/);
  assert.match(svg, /Banana Leaf Courtyard Shelter/);
  assert.match(svg, /<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  assert.match(svg, /<\/svg>/);
});

test('generateStickerSvg safely sanitizes hostile HTML in custom message', () => {
  const hostileMsg = '<script>alert("hack")</script> & "special"';
  const svg = generateStickerSvg({
    stickerName: 'Warm Tea Pour',
    stickerNameBn: 'চা ঢালার উষ্ণতা',
    category: 'Appreciation',
    customMessage: hostileMsg,
    recipientName: 'Alex',
    senderName: 'Maya',
  });

  assert.doesNotMatch(svg, /<script>/);
  assert.match(svg, /&lt;script&gt;alert\(&quot;hack&quot;\)&lt;\/script&gt; &amp; &quot;special&quot;/);
});

test('createStickerDataUri produces valid data:image/svg+xml URI', () => {
  const svg = '<svg><text>Hello</text></svg>';
  const uri = createStickerDataUri(svg);
  assert.ok(uri.startsWith('data:image/svg+xml;charset=utf-8,'));
  assert.match(uri, /%3Csvg%3E/);
});

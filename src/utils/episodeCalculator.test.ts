import test from 'node:test';
import assert from 'node:assert/strict';
import { getEpisode, getAllEpisodes, searchEpisodes } from '../data/episodesDirectory';
import { validateEpisodeTiming, exportEpisodeToPlainText, TOTAL_EPISODE_SECONDS } from './episodeCalculator';

test('validates 330-second exact timing for Episode 1, Episode 42, Episode 105', () => {
  const testIds = [1, 2, 42, 75, 105];

  for (const id of testIds) {
    const ep = getEpisode(id);
    const result = validateEpisodeTiming(ep);

    assert.equal(result.isValid, true, `Episode ${id} must have valid exact 330s breakdown`);
    assert.equal(result.total, 330, `Episode ${id} total seconds must equal 330`);
    assert.equal(result.breakdown.opening, 20, `Episode ${id} opening must be 20s`);
    assert.equal(result.breakdown.adventure, 240, `Episode ${id} adventure must be 240s`);
    assert.equal(result.breakdown.lesson, 40, `Episode ${id} lesson must be 40s`);
    assert.equal(result.breakdown.closing, 30, `Episode ${id} closing must be 30s`);
  }
});

test('all 105 episodes exist and have continuity links and character lock definitions', () => {
  const all = getAllEpisodes();
  assert.equal(all.length, 105, 'Must generate all 105 episodes');

  for (const ep of all) {
    assert.ok(ep.title.length > 0, `Ep ${ep.id} missing title`);
    assert.ok(ep.titleBn.length > 0, `Ep ${ep.id} missing Bengali title`);
    assert.ok(ep.prevEpisodeRecap.length > 0, `Ep ${ep.id} missing continuity recap`);
    assert.ok(ep.rhyme.english.length > 0, `Ep ${ep.id} missing rhyme`);
    assert.ok(ep.pukuGlowLesson.lessonEn.length > 0, `Ep ${ep.id} missing lesson`);
    assert.ok(ep.productionPrompts.establishingShot.length > 0, `Ep ${ep.id} missing establishing shot prompt`);
  }
});

test('searchEpisodes finds keywords correctly across English and Bengali', () => {
  const butterflySearch = searchEpisodes('butterfly');
  assert.ok(butterflySearch.length >= 1, 'Should find butterfly episode');
  assert.equal(butterflySearch[0].id, 1);

  const bengaliSearch = searchEpisodes('প্রজাপতি');
  assert.ok(bengaliSearch.length >= 1, 'Should find episode by Bengali script query');

  const numberSearch = searchEpisodes('42');
  assert.equal(numberSearch.some(e => e.id === 42), true, 'Should find episode 42');
});

test('exportEpisodeToPlainText formats cleanly with all 330s scenes and prompts', () => {
  const ep = getEpisode(1);
  const text = exportEpisodeToPlainText(ep);

  assert.ok(text.includes('EPISODE 1 OF 105: "The Dancing Butterfly"'), 'Must include header title');
  assert.ok(text.includes('TOTAL RUNTIME: 330 SECONDS'), 'Must include runtime statement');
  assert.ok(text.includes('CHARACTER LOCK SPECIFICATIONS'), 'Must include character lock specs');
  assert.ok(text.includes('PART 1: OPENING [00:00 - 00:20]'), 'Must include opening scene');
  assert.ok(text.includes('PART 2: THE ADVENTURE & RHYME [00:20 - 04:20]'), 'Must include adventure scene');
  assert.ok(text.includes('PART 3: LESSON RECAP & PUKU GLOW [04:20 - 05:00]'), 'Must include lesson recap');
  assert.ok(text.includes('PART 4: CLOSING & CLIFFHANGER [05:00 - 05:30]'), 'Must include closing');
  assert.ok(text.includes('PIXAR-GRADE 3D CGI PRODUCTION PROMPTS'), 'Must include prompts section');
});

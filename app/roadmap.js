// Leonida Trophy Guide — roadmap: the three-stage plan to the platinum,
// built from the official descriptions and the published roadmaps.
// Sources: PowerPyx (difficulty 4/10, ~200 hours, 1 playthrough, no online
// trophies, cheats disable trophies) and KeenGamer (manual saves, the 100%
// checklist breakdown). Every claim below names its source in the text.

export const ROADMAP = {
  meta: {
    difficulty: '4 out of 10',
    time: 'about 200 hours',
    playthroughs: '1 — no New Game+, no mission replay, free-roam after the story',
    online: '0 online trophies — every one of the 55 is single-player',
  },
  warning: {
    title: 'The one missable trophy',
    body: 'Positive Mental Attitude (meditate at every spot across Leonida) is the only trophy the guide sites flag as possibly missable. In Chapter 1, after the mission Down to Earth, Lucia is in the kitchen at Jason\u2019s house in the morning and says she is going to meditate — follow her to the balcony and choose Accept. It is not marked as a Meditation Spot like the rest, and it is still unclear whether it is required, so do it anyway. The last spot needs Jason and Lucia both playable, which opens after Coffee Break in Chapter 2. Safety net: the 100% checklist only asks for 15 of the 18 spots, so a missed first meditation cannot cost you the gold — but it may cost you this bronze.',
    source: 'PowerPyx trophy guide; KeenGamer roadmap; ViceCityHustle trophy list',
  },
  steps: [
    {
      stage: 1,
      title: 'Finish the story and the side strands',
      hours: '60–80 hours',
      points: [
        'Play all five chapters and the final mission. Story trophies pop as you go; none can be missed.',
        'Do the Chapter 1 meditation for Positive Mental Attitude before Chapter 1 ends (see the warning above).',
        'Take optional missions as they appear — Andy (Lucia-only), Tyrone and Bret (Jason-only) each have a trophy at the end of their strand.',
        'Scan unfamiliar vehicles and locations with the WAiNK app as you travel: it feeds Whip It Good, You WAiNKer! and the 100% checklist.',
        'Make a manual save at the start and end of every chapter. There is no mission replay, so a chapter save is your only way back (KeenGamer).',
      ],
    },
    {
      stage: 2,
      title: 'Clear the 100% checklist',
      hours: 'about 100 hours',
      points: [
        'Open Progress, then Stats, then 100% Completion. Progress made during the story already counts, and nothing on the checklist is missable.',
        'Robberies first: 39 gang operations, 22 bank jobs, 7 payday loan jobs and 8 bank vaults (KeenGamer). Bank jobs open through an optional mission in Chapter 4.',
        'Then the collectibles: 15 complete card sets, 100 WAiNK locations, 33 underwater discoveries — and the 100% asks for 300 stunts, past the 250 of Cunning Stunts.',
        'Work the 80 challenges (eight groups of ten) toward 70 of them; One Last Thing pops at 50 (PowerPyx via GTASpotter).',
        'Gold all 42 Shooting Range challenges for The Shootist, win a drone race at all 14 Top Fun locations, and finish the exploration, vehicle and money trophies.',
      ],
    },
    {
      stage: 3,
      title: 'Cleanup and the platinum',
      hours: 'about 10 hours',
      points: [
        'Finish any Strangers & Freaks strands still open — eight full strands for the silver, doable entirely after the story.',
        'Sweep up the odd one-out trophies: the Ocean Beach cocktail, the showroom smash, the bowling alley, the strange event behind The Truth Is Out There.',
        'Check this tracker: whatever is unticked is what is left. When the last box ticks, Vice Got a Price! pops.',
      ],
    },
  ],
  checklist100: [
    '39 gang operations',
    '22 bank jobs',
    '7 payday loan jobs',
    '8 bank vault robberies',
    '100 optional tasks',
    '15 complete card sets',
    '100 WAiNK locations',
    '33 underwater discoveries',
    '300 stunts',
    '70 of the 80 challenges',
  ],
  tips: [
    'Cheats disable trophies and saving — leave them off for the whole run (PowerPyx; GTABase via EGamers).',
    'Quest givers who vanish mid-story (Kenton is one) all return later; every trophy-related character is available again in free-roam (PowerPyx).',
    'Optional missions with an hourglass expire, but they do not count for trophies — do not chase them at the cost of the story (GTASpotter).',
    'The Irredeemable profile choice cannot be undone — know what it does before you take it (GTASpotter).',
    'Tick trophies off in the Tracker as you earn them — progress is saved in your browser, and Export gives you a file you can keep or move to another machine.',
  ],
};

function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  if (className) node.className = className;
  return node;
}

export function renderRoadmap(host, doc) {
  const intro = el('div', null, 'roadmap-step');
  intro.append(el('h3', 'Roadmap to the platinum'));
  const meta = el('p', `Difficulty ${ROADMAP.meta.difficulty} · ${ROADMAP.meta.time} · ${ROADMAP.meta.playthroughs} · ${ROADMAP.meta.online}. Sources: PowerPyx trophy guide and roadmap; KeenGamer platinum roadmap.`);
  intro.append(meta);
  host.append(intro);

  const warn = el('div', null, 'roadmap-note warn');
  warn.append(el('h3', `⚠ ${ROADMAP.warning.title}`));
  warn.append(el('p', ROADMAP.warning.body));
  warn.append(el('p', `Sources: ${ROADMAP.warning.source}.`, 'sources'));
  host.append(warn);

  for (const step of ROADMAP.steps) {
    const box = el('div', null, 'roadmap-step');
    const heading = el('h3');
    heading.textContent = `Stage ${step.stage}: ${step.title} `;
    heading.append(el('span', step.hours, 'hours'));
    box.append(heading);
    const list = el('ul');
    for (const point of step.points) list.append(el('li', point));
    box.append(list);
    host.append(box);
  }

  const hundred = el('div', null, 'roadmap-step');
  hundred.append(el('h3', 'What the 100% checklist asks for'));
  const list = el('ul');
  for (const item of ROADMAP.checklist100) list.append(el('li', item));
  hundred.append(list);
  hundred.append(el('p', 'Source: KeenGamer platinum roadmap; the in-game checklist is at Progress > Stats > 100% Completion.', 'sources'));
  host.append(hundred);

  const tips = el('div', null, 'roadmap-note');
  tips.append(el('h3', 'Four things that save a run'));
  const tipList = el('ul');
  for (const tip of ROADMAP.tips) tipList.append(el('li', tip));
  tips.append(tipList);
  host.append(tips);

  const counts = el('p', `The list: ${doc.counts.total} trophies — ${doc.counts.platinum} platinum, ${doc.counts.gold} gold, ${doc.counts.silver} silver, ${doc.counts.bronze} bronze, ${doc.counts.hidden} hidden until earned, ${doc.counts.online} online.`, 'sources');
  host.append(counts);
}

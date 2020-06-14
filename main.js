// Copyright 2020 National Research Council Canada. MIT licensed.
// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const { ime } = chrome.input;

const INVALID_INPUT_CONTEXT = -1;
const SYLLABICS_FULL_STOP = '\u166E'; // ᙮ U+166E CANADIAN SYLLABICS FULL STOP

// Match Cree text:
const wordPattern = /^(?:[ptkcsmnhwylreioa]|-)+$/i;

// /////////////////////////////// Globals //////////////////////////////// //
let input = '';

/**
 * ID of an input target. It becomes invalid on a blur event.
 */
let contextID = INVALID_INPUT_CONTEXT;

/**
 * Set the global input context when a text area is focused.
 */
ime.onFocus.addListener((context) => { contextID = context.contextID; });

/**
 * Unset the global input context when a text area is no longer focused.
 */
ime.onBlur.addListener(() => { contextID = INVALID_INPUT_CONTEXT; });

/**
 * This is the good stuff.
 *
 * This can change text based on the key pressed.
 */
ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type !== 'keydown') {
    return false;
  }

  if (wordPattern.test(input + keyData.key)) {
    // looks like syllabic input. Add it!
    input += keyData.key;
    ime.setComposition({
      contextID,
      text: sro2syllabics(input),
      cursor: input.length,
    });

    return true;
  }

  if (input && keyData.key === '.') {
    // special case for full stop -- only occur AFTER syllabics.
    input = sro2syllabics(input) + SYLLABICS_FULL_STOP;

    ime.setComposition({
      contextID,
      text: input,
      cursor: input.length,
    });

    return true;
  }

  // Pressed literally anything other than syllabics. Accept the syllabics input!

  ime.commitText({ contextID, text: sro2syllabics(input) }, (success) => {
    if (!success) return;

    ime.clearComposition({ contextID });
    input = '';
  });

  /* Let another layer handle the spacebar proper.
   * this usually means inserting a space! */
  return false;
});

// //////////////////////// cree-sro-syllabics library ////////////////////////////
/**
 * HEAVILY Adapted from: https://github.com/eddieantonio/cree-sro-syllabics.js/blob/5934dce1614573cca44f68c857be695d4a8f35d0/cree-sro-syllabics.js
 */

// ============================ Constants ============================ \\

// Lookup tables:
const sro2syllabicsLookup = {
  '-': '\u202f',
  e: 'ᐁ',
  i: 'ᐃ',
  ii: 'ᐄ',
  o: 'ᐅ',
  oo: 'ᐆ',
  a: 'ᐊ',
  aa: 'ᐋ',
  we: 'ᐍ',
  wi: 'ᐏ',
  wii: 'ᐑ',
  wo: 'ᐓ',
  woo: 'ᐕ',
  wa: 'ᐘ',
  waa: 'ᐚ',
  w: 'ᐤ',
  p: 'ᑊ',
  pe: 'ᐯ',
  pi: 'ᐱ',
  pii: 'ᐲ',
  po: 'ᐳ',
  poo: 'ᐴ',
  pa: 'ᐸ',
  paa: 'ᐹ',
  pwe: 'ᐻ',
  pwi: 'ᐽ',
  pwii: 'ᐿ',
  pwo: 'ᑁ',
  pwoo: 'ᑃ',
  pwa: 'ᑅ',
  pwaa: 'ᑇ',
  t: 'ᐟ',
  te: 'ᑌ',
  ti: 'ᑎ',
  tii: 'ᑏ',
  to: 'ᑐ',
  too: 'ᑑ',
  ta: 'ᑕ',
  taa: 'ᑖ',
  twe: 'ᑘ',
  twi: 'ᑚ',
  twii: 'ᑜ',
  two: 'ᑞ',
  twoo: 'ᑠ',
  twa: 'ᑢ',
  twaa: 'ᑤ',
  k: 'ᐠ',
  ke: 'ᑫ',
  ki: 'ᑭ',
  kii: 'ᑮ',
  ko: 'ᑯ',
  koo: 'ᑰ',
  ka: 'ᑲ',
  kaa: 'ᑳ',
  kwe: 'ᑵ',
  kwi: 'ᑷ',
  kwii: 'ᑹ',
  kwo: 'ᑻ',
  kwoo: 'ᑽ',
  kwa: 'ᑿ',
  kwaa: 'ᒁ',
  c: 'ᐨ',
  ce: 'ᒉ',
  ci: 'ᒋ',
  cii: 'ᒌ',
  co: 'ᒍ',
  coo: 'ᒎ',
  ca: 'ᒐ',
  caa: 'ᒑ',
  cwe: 'ᒓ',
  cwi: 'ᒕ',
  cwii: 'ᒗ',
  cwo: 'ᒙ',
  cwoo: 'ᒛ',
  cwa: 'ᒝ',
  cwaa: 'ᒟ',
  m: 'ᒼ',
  me: 'ᒣ',
  mi: 'ᒥ',
  mii: 'ᒦ',
  mo: 'ᒧ',
  moo: 'ᒨ',
  ma: 'ᒪ',
  maa: 'ᒫ',
  mwe: 'ᒭ',
  mwi: 'ᒯ',
  mwii: 'ᒱ',
  mwo: 'ᒳ',
  mwoo: 'ᒵ',
  mwa: 'ᒷ',
  mwaa: 'ᒹ',
  n: 'ᐣ',
  ne: 'ᓀ',
  ni: 'ᓂ',
  nii: 'ᓃ',
  no: 'ᓄ',
  noo: 'ᓅ',
  na: 'ᓇ',
  naa: 'ᓈ',
  nwe: 'ᓊ',
  nwa: 'ᓌ',
  nwaa: 'ᓎ',
  s: 'ᐢ',
  se: 'ᓭ',
  si: 'ᓯ',
  sii: 'ᓰ',
  so: 'ᓱ',
  soo: 'ᓲ',
  sa: 'ᓴ',
  saa: 'ᓵ',
  swe: 'ᓷ',
  swi: 'ᓹ',
  swii: 'ᓻ',
  swo: 'ᓽ',
  swoo: 'ᓿ',
  swa: 'ᔁ',
  swaa: 'ᔃ',
  y: 'ᕀ',
  ye: 'ᔦ',
  yi: 'ᔨ',
  yii: 'ᔩ',
  yo: 'ᔪ',
  yoo: 'ᔫ',
  ya: 'ᔭ',
  yaa: 'ᔮ',
  ywe: 'ᔰ',
  ywi: 'ᔲ',
  ywii: 'ᔴ',
  ywo: 'ᔶ',
  ywoo: 'ᔸ',
  ywa: 'ᔺ',
  ywaa: 'ᔼ',
  th: 'ᖮ',
  the: 'ᖧ',
  thi: 'ᖨ',
  thii: 'ᖩ',
  tho: 'ᖪ',
  thoo: 'ᖫ',
  tha: 'ᖬ',
  thaa: 'ᖭ',
  thwe: '\u1677',
  thwi: '\u1678',
  thwii: '\u1679',
  thwo: '\u167A',
  thwoo: '\u167B',
  thwa: '\u167C',
  thwaa: '\u167D',
  l: 'ᓬ',
  r: 'ᕒ',
  h: 'ᐦ',
  hk: 'ᕽ',
};

const sroPattern = (function createSROPattern() {
  let parts = Array.from(Object.keys(sro2syllabicsLookup));
  parts = parts
    // remove replacement that happens in post-processing
    .filter((key) => key !== 'hk')
    // sort in order of LONGEST match first!
    .sort((a, b) => b.length - a.length);

  return RegExp(`^(${parts.join('|')})`);
}());

function sro2syllabics(sro) {
  const lookup = sro2syllabicsLookup;

  return nfc(sro).replace(wordPattern, transcodeSROWordToSyllabics);

  function transcodeSROWordToSyllabics(sroWord) {
    let toTranscribe = sroWord.toLowerCase();

    let parts = [];
    let match = toTranscribe.match(sroPattern);

    while (match) {
      const syllable = match[0];
      const nextSyllablePos = syllable.length;

      const syllabic = lookup[syllable];
      parts.push(syllabic);
      toTranscribe = toTranscribe.slice(nextSyllablePos);

      match = toTranscribe.match(sroPattern);
    }

    if (endsWithHK(parts)) {
      // Replace last two charcters with 'hk' syllabic
      parts = parts.slice(0, parts.length - 2).concat('ᕽ');
    }

    return parts.join('');
  }
}

// ========================= Helper functions ========================= \\

/**
 * Returns the string in NFC Unicode normalization form.
 * This means latin characters with accents will always be precomposed, if
 * possible.
 */
function nfc(string) {
  return string.normalize('NFC');
}

/**
 * Returns whether the array ends with ᐦᐠ
 */
function endsWithHK(parts) {
  const n = parts.length;
  return parts[n - 1] === 'ᐠ' && parts[n - 2] === 'ᐦ';
}

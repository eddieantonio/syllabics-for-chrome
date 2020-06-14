// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const ime = chrome.input.ime;

// dunno what this is lol
let context_id = -1;

/**
 * Occurs when a text input area is focused.
 *
 * All we need to do is set the context.
 */
ime.onFocus.addListener((context) => {
  console.log(`onFocus: ${context.contextID}`);
  context_id = context.contextID;
});

/**
 * When unfcoused, unset the context.
 */
ime.onBlur.addListener((contextID) => {
  console.log('onBlur:' + contextID);
  context_id = -1;
});

/**
 * When the keyboard is activated.
 */
ime.onActivate.addListener(function(engineID) {
  // engine ID will be something like 'syllabics'
  console.log('onActivate:' + engineID);
});

/**
 * When the keyboard is deactivated.
 */
ime.onDeactivated.addListener(function(engineID) {
  // engine ID will be something like 'syllabics'
  console.log('onDeactivated:' + engineID);
});

/**
 * This is the good stuff.
 *
 * This can change text based on the key pressed.
 */
ime.onKeyEvent.addListener((engineID, keyData) => {
  console.log(`onKeyEvent: ${keyData.key} context: {context_id}`);

  if (keyData.type == "keydown" && keyData.key.match(/^[eioa]$/)) {
    chrome.input.ime.commitText({
      "contextID": context_id,
      "text": {
        "e": "\u1401",
        "i": "\u1403",
        "o": "\u1405",
        "a": "\u140a",
      }[keyData.key],
    });
    return true;
  }

  return false
});

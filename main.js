// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const ime = chrome.input.ime;
const INVALID_INPUT_CONTEXT = -1;

/**
 * ID of an input target. It becomes invalid on a blur event.
 */
let contextID = INVALID_INPUT_CONTEXT;

/**
 * Occurs when a text input area is focused.
 *
 * All we need to do is set the context.
 */
ime.onFocus.addListener((context) => {
  contextID = context.contextID;
});

/**
 * When unfcoused, unset the context.
 */
ime.onBlur.addListener((contextID) => {
  contextID = INVALID_INPUT_CONTEXT;
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
  if (keyData.type == "keydown" && keyData.key.match(/^[eioa]$/)) {
    chrome.input.ime.commitText({
      "contextID": contextID,
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

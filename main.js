// Copyright 2020 National Research Council Canada. MIT licensed.
// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const { ime } = chrome.input;
const INVALID_INPUT_CONTEXT = -1;

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
  if (keyData.type === 'keydown' && keyData.key.match(/^[eioa]$/)) {
    // TODO: use chrome.input.setComposition?
    chrome.input.ime.commitText({
      contextID,
      text: {
        e: '\u1401',
        i: '\u1403',
        o: '\u1405',
        a: '\u140a',
      }[keyData.key],
    });
    return true;
  }

  return false;
});

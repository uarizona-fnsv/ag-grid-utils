/**
 * Add functions to window to allow cypress-storybook to work with Vue.
 */

import { forceReRender } from "@storybook/vue"

import { setCurrentStory, changeKnob } from "cypress-storybook/common"

window.__setCurrentStory = function(categorization, story) {
  setCurrentStory(categorization, story)
  forceReRender()
}

window.__changeKnob = function(changedKnob) {
  changeKnob(changedKnob)

  // force story to rerender with updated knob
  forceReRender()
}

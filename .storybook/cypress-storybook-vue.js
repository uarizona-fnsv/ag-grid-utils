/**
 * Add functions to window to allow cypress-storybook to work with Vue.
 */

import { forceReRender } from "@storybook/vue"

import { setCurrentStory, changeKnob } from "cypress-storybook/common"

function resetCurrentStory() {
  const root = document.querySelector("#root")
  // Changing key forces remount
  if (root.__vue__) {
    const vnode = root.__vue__._vnode
    vnode.key = vnode.key ? vnode.key + 1 : 1
  }
}

window.__setCurrentStory = function(categorization, story) {
  resetCurrentStory()
  setCurrentStory(categorization, story)
  forceReRender()
}

window.__changeKnob = function(changedKnob) {
  changeKnob(changedKnob)

  // force story to rerender with updated knob
  forceReRender()
}

<template>
  <div
    ref="root"
    class="w-100"
    style="font-size: 1rem; font-family: var(--font-family-sans-serif);"
  >
    <div
      class="card-header sticky-top shadow-sm mb-2 border-right d-flex justify-content-between align-items-center"
    >
      <!-- @slot Title display of the panel -->
      <slot name="title">
        <div></div>
      </slot>
      <div class="d-flex">
        <!-- @slot Additional controls for header -->
        <slot name="extra-controls" />
        <!-- @slot Override panel controls entirely -->
        <slot name="controls">
          <button
            aria-label="Resize panel"
            class="btn btn-sm btn-outline-dark mr-1"
            title="Resize panel"
            data-cy="panel-resize"
            @click="resizePanel"
          >
            <MoveIcon width="16" />
          </button>
          <button
            class="btn btn-sm btn-outline-dark"
            aria-label="Close panel"
            title="Close panel"
            data-cy="panel-close"
            @click="closePanel"
          >
            <XIcon width="18" /></button
        ></slot>
      </div>
    </div>
    <!-- @slot Body for the panel -->
    <slot />
  </div>
</template>

<script>
import XIcon from "./icons/XIcon"
import MoveIcon from "./icons/MoveIcon"
/**
 * A base component for a grid panel providing basic controls.
 *
 * Extend this component using its slots.
 */
export default {
  components: { XIcon, MoveIcon },
  props: { gridParams: { type: Object, default: null } },
  methods: {
    resizePanel() {
      const el = this.$refs.root.closest(".ag-tool-panel-wrapper")
      el.style.width = parseInt(el.style.width) > 550 ? "550px" : "800px"
    },
    closePanel() {
      const params = this.params || this.gridParams
      params.api.closeToolPanel()
    },
  },
}
</script>

<style></style>

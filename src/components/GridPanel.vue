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
      <div>
        <!-- @slot Additional controls for header -->
        <slot name="extra-controls" />
        <!-- @slot Override panel controls entirely -->
        <slot name="controls">
          <button
            aria-label="Resize panel"
            class="btn btn-sm btn-outline-dark mr-1"
            title="Resize panel"
            @click="resizePanel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="18 8 22 12 18 16"></polyline>
              <polyline points="6 8 2 12 6 16"></polyline>
              <line x1="2" y1="12" x2="22" y2="12"></line>
            </svg>
          </button>
          <button
            class="btn btn-sm btn-outline-dark"
            aria-label="Close panel"
            title="Close panel"
            @click="closePanel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-x"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg></button
        ></slot>
      </div>
    </div>
    <!-- @slot Body for the panel -->
    <slot />
  </div>
</template>

<script>
export default {
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

<template>
  <div ref="root">
    <slot></slot>
    <div v-if="showCollapse" class="btn-group mr-1">
      <button
        class="btn btn-sm btn-outline-dark"
        aria-label="Expand All"
        title="Expand all"
        @click="$emit('expand')"
      >
        <span aria-hidden>▾</span>
      </button>
      <button
        aria-label="Collapse All"
        class="btn btn-sm btn-outline-dark"
        title="Collapse all"
        @click="$emit('collapse')"
      >
        <span aria-hidden>▴</span>
      </button>
    </div>
    <button
      aria-label="Resize panel"
      class="btn btn-sm btn-outline-dark mr-1"
      title="Resize panel"
      @click="resizePanel"
    >
      <ResizeIcon aria-hidden class="feather-sm"></ResizeIcon>
    </button>
    <button
      class="btn btn-sm btn-outline-dark"
      aria-label="Close panel"
      title="Close panel"
      @click="closePanel"
    >
      <XIcon aria-hidden class="feather-sm" stroke-width="2.5"></XIcon>
    </button>
  </div>
</template>

<script>
import XIcon from "../assets/x.svg"
import ResizeIcon from "../assets/move-horizontal.svg"

export default {
  components: {
    ResizeIcon,
    XIcon,
  },
  props: {
    showCollapse: { type: Boolean, default: true },
  },
  methods: {
    resizePanel() {
      const el = this.$refs.root.closest(".ag-tool-panel-wrapper")
      el.style.width = parseInt(el.style.width) > 550 ? "550px" : "800px"
    },
    closePanel() {
      this.$emit("close")
      this.$store.state.gridApi.closeToolPanel()
    },
  },
}
</script>

<style></style>

<template>
  <div class="card mb-2">
    <div
      class="card-header"
      :aria-expanded="collapse"
      :aria-controls="`${title}-collapse`"
      @click="$emit('click')"
    >
      <h5 class="mb-0 d-flex justify-content-between">
        {{ title }}
        <span class="arrow" :class="{ collapsed: collapse }">▾</span>
      </h5>
    </div>
    <div class="card-body" :class="{ collapse: collapse }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    collapse: { type: Boolean, default: false },
  },
}
</script>

<style scoped>
.card-header {
  cursor: pointer;
  transition: filter 0.3s;
}
.card-header:hover {
  filter: brightness(90%);
}
.arrow {
  transition: transform 0.5s;
  display: inline-block;
  margin-left: 0.1rem;
  color: #555;
}
.arrow.collapsed {
  transform: rotate(-180deg);
}
</style>

<template>
  <datalist :id="id">
    <option value="(Blanks)">(Blanks)</option>
    <option v-for="option in options" :key="option" :value="option">
      {{ option }}
    </option>
  </datalist>
</template>

<script>
export default {
  props: {
    /** Datalist's id should be unique and match the input's `list` attr */
    id: { type: String, required: true },
    /** The value to match options against */
    value: { type: [String, Number], default: null },
    /** Function used to get options; called with `value` */
    getOptions: { type: Function, required: true },
    /** Display option to filter blanks. */
    blankOption: { type: Boolean, default: false },
    /** Whether the associated input is focused, triggers getOption on focus */
    focus: { type: Boolean, default: false },
  },
  data() {
    return { options: [] }
  },
  watch: {
    value() {
      this.options = this.getOptions(this.value)
    },
    focus(value) {
      if (value) {
        this.options = this.getOptions(this.value)
      }
    },
  },
}
</script>

<style></style>

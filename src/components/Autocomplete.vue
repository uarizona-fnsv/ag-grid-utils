<template>
  <div>
    <!-- 
    @slot default displays list of options
    @param {boolean} blankOption weather to display an option for blanks
    @param {array} options the list of options
   -->
    <slot v-bind="{ blankOption, options }">
      <datalist :id="id">
        <option v-if="blankOption" value="(Blanks)">(Blanks)</option>
        <option v-for="option in options" :key="option" :value="option">
          {{ option }}
        </option>
      </datalist>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    /** Datalist's id should be unique and match the input's `list` attr */
    id: { type: String, required: true },
    /** The value to match options against */
    value: { type: String, default: null },
    /** Function used to get options; called with `value` */
    getOptions: { type: Function, required: true },
    /** Display option to filter blanks. */
    blankOption: { type: Boolean, default: false },
    /** Whether the associated input is focused, triggers getOption on focus */
    focus: { type: Boolean, default: false },
    /** Whether the component should fetch on mount or wait for the focus prop. */
    delayFetch: { type: Boolean, default: true },
  },
  data() {
    return { options: [] }
  },
  watch: {
    async value() {
      this.options = await this.getOptions(this.value)
    },
    async focus(value) {
      if (value) {
        this.options = await this.getOptions(this.value)
      }
    },
  },
  async mounted() {
    if (!this.delayFetch) {
      this.options = await this.getOptions()
    }
  },
}
</script>

<style></style>

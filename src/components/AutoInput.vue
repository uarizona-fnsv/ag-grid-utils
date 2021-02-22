<template>
  <div class="w-100">
    <div v-if="type" class="input-group">
      <input
        v-if="type === 'number'"
        :id="id"
        :value="stringValue"
        type="number"
        class="form-control"
        v-bind="$props"
        data-cy="ai-input"
        @input="emitValue"
        @change="emitValue"
        @focus="focus = true"
        @blur="focus = false"
        @keypress="$emit('keypress', $event)"
      />
      <input
        v-else-if="['date', 'datetime'].includes(type)"
        :id="id"
        :value="stringValue"
        type="date"
        class="form-control"
        v-bind="$props"
        data-cy="ai-input"
        @input="emitValue"
        @change="emitValue"
        @focus="focus = true"
        @blur="focus = false"
        @keypress="$emit('keypress', $event)"
      />
      <input
        v-else
        :id="id"
        :value="stringValue"
        :autocomplete="getOptions && 'off'"
        :list="id + '-list'"
        type="text"
        class="form-control"
        :pattern="repeatingPattern"
        v-bind="$props"
        data-cy="ai-input"
        @input="emitValue"
        @change="emitValue"
        @focus="focus = true"
        @blur="focus = false"
        @keypress="$emit('keypress', $event)"
      />
      <div v-if="clearable" class="input-group-append">
        <button
          class="btn btn-outline-secondary"
          type="button"
          aria-label="Clear input"
          title="Clear input"
          data-cy="ai-clear"
          @click="clear"
        >
          <span class="close">&times;</span>
        </button>
      </div>
    </div>
    <Autocomplete
      v-if="getOptions"
      :id="id + '-list'"
      :value="stringValue"
      :get-options="getOptions"
      :focus="focus"
      :delay-fetch="delayOptions"
    ></Autocomplete>
  </div>
</template>

<script>
import Autocomplete from "./Autocomplete.vue"

/**
 * A text input with autocomplete and multi-value support.
 *
 * Multiple values can be separated by semicolons.
 */
export default {
  components: {
    Autocomplete,
  },
  props: {
    /** id for input */
    id: { type: String, required: true },
    /** Input type. Either string, date, or number. */
    type: {
      type: String,
      required: true,
      validator: x => ["string", "date", "datetime", "number"].includes(x),
    },
    /** Current value; compatible with v-model */
    value: { type: [String, Array], required: true },
    /** Title text to show on hover */
    pattern: { type: String, default: null },
    /** Function returning autocomplete options. String fields only. */
    getOptions: { type: Function, default: null },
    /** Whether autocomplete should fetch on mount or wait for input focus. */
    delayOptions: { type: Boolean, default: true },
    /** Allow many vaues delimited by semicolons */
    multi: { type: Boolean, default: false },
    /** Display button to clear input  */
    clearable: { type: Boolean, default: false },
  },
  data() {
    return {
      focus: false,
    }
  },
  computed: {
    stringValue() {
      return Array.isArray(this.value) ? this.value.join(";") : this.value
    },
    repeatingPattern() {
      if (!this.multi) return this.pattern
      return this.pattern && `^${this.pattern}(;${this.pattern})*$`
    },
  },
  watch: {
    $props: {
      immediate: true,
      handler() {
        const stringValue = typeof this.value === "string"
        if (stringValue === this.multi) {
          console.warn(
            "Invalid props: value prop type must match the multi prop.",
            { ...this.$props },
          )
        }
      },
    },
  },
  methods: {
    emitValue(event) {
      let { value } = event.target
      if (this.multi) {
        // Allow multiple values separated by semicolons
        value = value.split(";")
      }
      /**
       * Always emits an array on change and input.
       * @event input-change
       * @type {string[]} - value
       */
      this.$emit(event.type, value)
    },
    clear() {
      const event = { target: { value: "" } }
      this.emitValue({ ...event, type: "input" })
      this.emitValue({ ...event, type: "change" })
    },
  },
}
</script>

<style scoped>
.form-control:invalid {
  box-shadow: none; /* Override browser default */
}
.form-control:invalid:not(:focus) {
  border-color: var(--danger);
}
</style>

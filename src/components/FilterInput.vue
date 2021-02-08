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
        @input="emitValue"
        @change="emitValue"
        @focus="focus = true"
        @blur="focus = false"
        @keypress="$emit('keypress', $event)"
      />
      <div class="input-group-append">
        <button
          class="btn btn-outline-secondary"
          type="button"
          aria-label="Clear input"
          title="Clear input"
          @click="clear"
        >
          <span class="close">&times;</span>
        </button>
      </div>
    </div>
    <Autocomplete
      v-if="getOptions"
      :id="id + '-list'"
      :value="value"
      :get-options="getOptions"
      :focus="focus"
    ></Autocomplete>
  </div>
</template>

<script>
import Autocomplete from "./Autocomplete"
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
    title: { type: String, default: null },
    /** Regex pattern for validation */
    pattern: { type: String, default: null },
    /** Function returning autocomplete options. String fields only. */
    getOptions: { type: Function, default: null },
    /** Whether to allow many vaues delimited by semicolons */
    many: { type: Boolean, default: true },
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
      if (!this.many) return this.pattern
      return this.pattern && `^${this.pattern}(;${this.pattern})*$`
    },
  },
  methods: {
    emitValue(event) {
      let { value } = event.target
      // Allow multiple values separated by semicolons
      if (value?.includes(";")) {
        value = value.split(";").map(x => x.trim())
      }
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

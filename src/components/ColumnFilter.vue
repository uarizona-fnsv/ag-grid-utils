<template>
  <div
    v-observe-visibility="syncValue"
    class="px-2 pt-3"
    style="font-size: 1rem; font-family: var(--font-family-sans-serif);"
  >
    <div class="form-group">
      <label class="mb-2">{{ params.colDef.headerName }}</label>
      <AutoInput
        :id="params.colDef.field + '_column'"
        v-model="value"
        :type="params.colDef.__metadata__.type"
        :col="params.colDef"
        :get-options="getOptionsPartial"
        :multi="true"
        :clearable="true"
        @keypress.enter="submit"
      ></AutoInput>
    </div>
  </div>
</template>

<script>
import AutoInput from "./AutoInput.vue"
import { ObserveVisibility } from "vue-observe-visibility"
/**
 * Filters the a string, number, or date column with a simple text input.
 *
 * Autocomplete suggestions can be provided via `filterParams.getOptions`
 *
 * Multiple values separated by semicolons are accepted.
 *
 * `__metadata__.type` must be defined on the column definition.
 */
export default {
  components: { AutoInput },
  directives: { ObserveVisibility },
  data() {
    return {
      value: [""],
    }
  },
  computed: {
    datasource() {
      return this.params.api.rowModel.datasource
    },
    /**
     * Partially apply getOptions with field argument
     * @returns {(value: string) => string[]}
     */
    getOptionsPartial() {
      return this.params.colDef.filterParams.getOptions.bind(
        null,
        this.params.colDef.field,
      )
    },
  },
  mounted() {
    this.syncValue(true)
  },
  methods: {
    /** Submit any change on close, grab latest state on open. */
    syncValue(visible) {
      const field = this.params.colDef.field
      const datasourceValue = this.datasource.getFilter(field)
      if (visible) {
        this.value = datasourceValue?.raw || ""
      } else if (this.value[0] !== datasourceValue?.raw[0]) {
        this.submit()
      }
    },
    submit() {
      this.datasource.updateFilter(this.params.colDef, this.value)
      this.params.api.hidePopupMenu()
    },
    isFilterActive() {
      const field = this.params.colDef.field
      return Boolean(this.datasource.getFilter(field))
    },
  },
}
</script>

<style></style>

<template>
  <div
    v-observe-visibility="syncValue"
    class="px-2 pt-3"
    style="font-size: 1rem; font-family: var(--font-family-sans-serif);"
  >
    <div class="form-group">
      <label class="mb-2">{{ params.colDef.headerName }}</label>
      <FilterInput
        :id="params.colDef.field + '_column'"
        v-model="value"
        :type="params.colDef.__metadata__.type"
        :col="params.colDef"
        :get-options="getOptionsPartial"
        @keypress.enter="submit"
      ></FilterInput>
    </div>
  </div>
</template>

<script>
import FilterInput from "./FilterInput"
import { ObserveVisibility } from "vue-observe-visibility"

export default {
  components: { FilterInput },
  directives: { ObserveVisibility },
  data() {
    return {
      value: "",
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
  methods: {
    /** Submit any change on close, grab latest state on open. */
    syncValue(visible) {
      const field = this.params.colDef.field
      const datasourceValue = this.datasource.getFilter(field)
      if (visible) {
        this.value = datasourceValue?.raw || ""
      } else if (this.value?.raw !== datasourceValue?.raw) {
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

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
        :col="params.colDef"
        @keypress.enter="submit"
      ></FilterInput>
    </div>
  </div>
</template>

<script>
import FilterInput from "./FilterInput"

export default {
  components: {
    FilterInput,
  },
  data() {
    return {
      value: "",
    }
  },
  computed: {
    datasource() {
      return this.params.api.rowModel.datasource
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

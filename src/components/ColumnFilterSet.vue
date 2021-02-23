<template>
  <div
    v-observe-visibility="syncValue"
    class="pt-1"
    style="font-size: 1rem; font-family: var(--font-family-sans-serif);"
  >
    <div class="form-group mb-2 px-2">
      <label>{{ params.colDef.headerName }}</label>
      <input
        v-model="filter"
        type="text"
        placeholder="Filter options"
        class="form-control form-control-sm mt-1"
        data-cy="cfs-filter"
      />
    </div>
    <div class="px-2" style="max-height: 400px; overflow-y: scroll;">
      <div
        v-if="
          params.colDef.filterParams.blanks && !selected.includes('(Blanks)')
        "
        class="py-1"
        @click="toggleBlanks"
      >
        <input :checked="blanksFilter" type="checkbox" />
        <span class="pl-2">(Blanks)</span>
      </div>
      <div
        v-for="option in selected"
        :key="option"
        class="py-1"
        data-cy="cfs-selected"
        @click="toggle(option)"
      >
        <input :checked="selected.includes(option)" type="checkbox" />
        <span
          class="pl-2"
          :title="format(option)"
          v-text="truncate(format(option))"
        ></span>
      </div>
      <div
        v-for="option in unselected"
        :key="option"
        class="py-1"
        data-cy="cfs-unselected"
        @click="toggle(option)"
      >
        <input :checked="selected.includes(option)" type="checkbox" />
        <span
          class="pl-2"
          :title="format(option)"
          v-text="truncate(format(option))"
        ></span>
      </div>
    </div>
    <div class="py-1 px-2 d-flex justify-content-end border-top">
      <button
        class="btn btn-sm btn-outline-primary"
        data-cy="cfs-clear"
        @click="clear"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script>
import { ObserveVisibility } from "vue-observe-visibility"
import { truncate } from "lodash"
/**
 * Filters a column by matching any number of selected options.
 *
 * Option values can be provided via `filterParams.getOptions`
 *
 * A Blanks option can be enabled via `filterParams.blanks`
 */
export default {
  directives: { ObserveVisibility },
  data() {
    return {
      options: [],
      selected: [],
      filter: "",
      change: false,
      blanksFilter: false,
    }
  },
  computed: {
    unselected() {
      return this.options.filter(x => !this.selected.includes(x))
    },
    datasource() {
      return this.params.api.rowModel.datasource
    },
  },
  watch: {
    filter() {
      this.fetchOptions()
    },
  },
  methods: {
    truncate,
    format(value) {
      const method = this.params.colDef.valueFormatter
      return method ? method({ value }) : value
    },
    async fetchOptions() {
      this.options = await this.params.colDef.filterParams.getOptions(
        this.params.colDef.field,
        this.filter,
      )
    },
    /** Submit any change on close, grab latest state on open. */
    async syncValue(visible) {
      this.filter = ""
      if (!this.options.length) await this.fetchOptions()
      const field = this.params.colDef.field
      const filter = this.datasource.getFilter(field)
      if (visible && filter?.raw) {
        this.change = false
        this.selected = filter.raw
      } else if (this.change) {
        this.submit()
      }
    },
    toggle(option) {
      this.change = true
      const index = this.selected.indexOf(option)
      if (index === -1) {
        this.selected.push(option)
      } else this.selected.splice(index, 1)
      this.blanksFilter = false
    },
    toggleBlanks() {
      this.blanksFilter = !this.blanksFilter
      if (this.blanksFilter) {
        this.selected = ["(Blanks)"]
      }
      this.change = true
    },
    submit() {
      this.change = false
      const value = this.blanksFilter ? ["(Blanks)"] : this.selected
      this.datasource.updateFilter(this.params.colDef, value)
    },
    clear() {
      this.change = true
      this.selected = []
    },
    isFilterActive() {
      const field = this.params.colDef.field
      return Boolean(this.datasource.getFilter(field))
    },
  },
}
</script>

<style></style>

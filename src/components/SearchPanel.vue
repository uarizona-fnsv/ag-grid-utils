<template>
  <GridPanel v-observe-visibility="onVisibility" :grid-params="params">
    <template #title>
      <h4 class="m-0">Search</h4>
    </template>

    <template #extra-controls>
      <button class="btn btn-sm btn-primary-light mr-1" @click="submit">
        <SearchIcon width="16" style="margin-bottom: 2px;" />
        <strong>Go</strong>
      </button>
      <button class="btn btn-sm btn-outline-primary mr-1" @click="clearSearch">
        <strong>Clear</strong>
      </button>
    </template>

    <template #default>
      <form ref="form" class="p-2" @keyup.enter.prevent="submit">
        <div class="input-group mb-2">
          <input
            :v-model="quickSearch"
            type="text"
            class="form-control"
            placeholder="Quick Search"
            aria-label="Quick Search"
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              aria-label="Clear search"
              title="Clear search"
              @click="search = null"
            >
              <span class="close">&times;</span>
            </button>
          </div>
        </div>

        <ErrorAlert
          v-if="error"
          :error="error"
          @close="error = null"
        ></ErrorAlert>

        <div class="my-2 text-muted d-flex align-items-center">
          <FilterIcon class="mx-2" width="16" style="flex-shrink: 0;" />
          <span v-if="currentFilters.length">
            <span
              v-for="filter in currentFilters"
              :key="filter.key"
              class="filter-badge badge border border-secondary mr-1 my-1"
            >
              {{ colName(filter.key.replace("__", ".")) }}:
              <span v-if="['date', 'datetime'].includes(filter.type)">
                {{ formatDate(filter.value) }}
              </span>
              <span v-else>{{ filter.value }}</span>
            </span>
          </span>
          <span v-else>No Filters</span>
        </div>

        <!-- Columns without groups -->
        <template v-for="col in soloColumns">
          <div
            v-if="col.__metadata__.type"
            :key="col.headerName"
            class="form-group"
          >
            <label class="mb-1" :for="col.field"> {{ col.headerName }}: </label>
            <template>
              <div class="d-flex">
                <AutoInput
                  :id="col.field + '-panel'"
                  :col="col"
                  :value="getParamAttr(col.field, 'raw')"
                  :pattern="col.__metadata__.pattern"
                  :type="col.__metadata__.type"
                  :title="col.__metadata__.title || ''"
                  :many="true"
                  :aria-describedby="col.field"
                  @input="setParam(col, $event)"
                  @change="setParam(col, $event)"
                >
                </AutoInput>
              </div>
            </template>
          </div>
        </template>

        <!-- Grouped columnsS -->
        <CollapseCard
          v-for="group in columnGroups"
          :key="group.headerName"
          :title="group.headerName"
          :collapse="collapse[group.headerName]"
          class="card mb-2"
          @click="collapse[group.headerName] = !collapse[group.headerName]"
        >
          <template v-for="col in group.children">
            <div
              v-if="col.__metadata__.type"
              :key="col.headerName"
              class="form-group"
            >
              <label class="mb-1" :for="col.field">
                {{ col.headerName }}:
              </label>
              <template>
                <div class="d-flex">
                  <AutoInput
                    :id="col.field + '-panel'"
                    :col="col"
                    :value="getParamAttr(col.field, 'raw')"
                    :pattern="col.__metadata__.pattern"
                    :type="col.__metadata__.type"
                    :title="col.__metadata__.title"
                    :aria-describedby="col.field"
                    @input="setParam(col, $event)"
                    @change="setParam(col, $event)"
                  >
                  </AutoInput>
                </div>
              </template>
            </div>
          </template>
        </CollapseCard>
      </form>
    </template>
  </GridPanel>
</template>

<script>
import { ObserveVisibility } from "vue-observe-visibility"
import { cloneDeep, debounce } from "lodash"
import CollapseCard from "./CollapseCard.vue"
import GridPanel from "./GridPanel.vue"
import AutoInput from "./AutoInput.vue"
import ErrorAlert from "./ErrorAlert.vue"
import SearchIcon from "./icons/SearchIcon.vue"
import FilterIcon from "./icons/FilterIcon.vue"

export default {
  name: "PanelSearch",
  components: {
    CollapseCard,
    GridPanel,
    AutoInput,
    SearchIcon,
    FilterIcon,
    ErrorAlert,
  },
  directives: { ObserveVisibility },
  data() {
    return {
      error: null,
      collapse: {},
      currentFilters: [],
      filters: {},
      changed: false,
      sliderState: { data: null, open: false, searchField: null },
    }
  },
  computed: {
    /*
    Careful using computed properties for this.params, it's not a proper prop
    and so changes won't invalidate the computed cache. Ex. can't have a
    datasource computed property as it is set by the grid later.
    */
    columnDefs() {
      return this.params.api.gridOptionsWrapper.gridOptions.columnDefs
    },
    soloColumns() {
      return this.columnDefs.filter(x => !Object.keys(x).includes("children"))
    },
    columnGroups() {
      return this.columnDefs.filter(x => Object.keys(x).includes("children"))
    },
    quickSearch: {
      get() {
        return this.params.api.rowModel.datasource?.search || ""
      },
      set: debounce(function(value) {
        const datasource = this.params.api.rowModel.datasource
        datasource.search = value
        datasource.refresh()
      }, 500),
    },
  },
  mounted() {
    this.collapse = Object.fromEntries(
      this.columnDefs.map(cd => [cd.headerName, true]),
    )
  },
  methods: {
    /**
     * Sync panel state with datasource
     * The params object is not reactive so must be done manually.
     */
    onVisibility(visible) {
      if (visible) this.resetPanel()
    },
    /** Collapse/expand all collapsible cards */
    collapseAll(v) {
      Object.keys(this.collapse).forEach(k => (this.collapse[k] = v))
    },
    /** Set search params from datasource */
    resetPanel() {
      const datasource = this.params.api.rowModel.datasource
      if (!datasource) return
      this.filters = cloneDeep(datasource.filters)
      this.currentFilters = Object.values(datasource.filters)
    },
    /** Set new filtered grid datasource and update column filtered status */
    submit() {
      if (this.$refs.form.checkValidity()) {
        const datasource = this.params.api.rowModel.datasource
        datasource.filters = this.filters
        datasource.refresh()
        this.changed = false
        this.currentFilters = Object.values(datasource.filters)
      } else {
        return this.$refs.form.reportValidity()
      }
    },
    clearSearch() {
      this.quickSearch = ""
      this.filters = {}
      this.submit()
    },
    getParamAttr(field, attr, fallback = "") {
      field = field.replace(".", "__")
      return this.filters[field] ? this.filters[field][attr] : fallback
    },
    /** Store search params as an object of key, Django lookup, and value */
    setParam(col, value) {
      const datasource = this.params.api.rowModel.datasource
      this.changed = true
      const filter = datasource.createFilter(col, value)
      if (filter.raw && filter.raw[0]) {
        this.$set(this.filters, filter.key, filter)
      } else {
        this.$delete(this.filters, filter.key)
      }
    },
    colName(id) {
      const columnApi = this.params.api.columnController.columnApi
      return columnApi.getColumn(id).colDef.headerName
    },
  },
}
</script>

<style>
.filter-badge {
  text-overflow: ellipsis;
  max-width: 400px;
  overflow: hidden;
}
</style>

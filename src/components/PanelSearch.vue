<template>
  <div
    ref="panel"
    v-observe-visibility="resetPanel"
    class="w-100"
    style="font-size: 1rem; font-family: var(--font-family-sans-serif);"
  >
    <div
      class="card-header sticky-top shadow-sm mb-2 border-right d-flex justify-content-between align-items-center"
    >
      <h4 class="mb-0">
        Search
      </h4>
      <div>
        <PanelControls
          @collapse="collapseAll(true)"
          @expand="collapseAll(false)"
        >
          <button
            class="btn btn-sm btn-primary-light mr-1"
            :disabled="!changed"
            @click="submit"
          >
            <SearchIcon class="feather-sm mr-1"></SearchIcon>
            <strong>Go</strong>
          </button>
          <button
            class="btn btn-sm btn-outline-primary mr-2"
            title="Clear search filters"
            @click="clearSearch"
          >
            <strong>Clear</strong>
          </button>
        </PanelControls>
      </div>
    </div>

    <form ref="form" class="p-2" @keyup.enter="submit">
      <div class="input-group mb-2">
        <input
          v-model="search"
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

      <div class="my-2 text-muted d-flex align-items-start">
        <FilterIcon
          aria-label="Filters"
          class="mx-2 mt-1"
          width="16"
          style="flex-shrink: 0;"
        ></FilterIcon>
        <span v-if="Object.keys(datasource.filters || {}).length">
          <span
            v-for="(param, key) in datasource.filters"
            :key="key"
            class="filter-badge badge border border-secondary mr-1 my-1"
          >
            {{ colName(param.key.replace("__", ".")) }}:
            <span v-if="['date', 'datetime'].includes(param.type)">
              {{ formatDate(param.value) }}
            </span>
            <span v-else>{{ param.value }}</span>
          </span>
        </span>
        <span v-else>None</span>
      </div>

      <CollapseCard
        v-for="group in columnDefs"
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
            <label class="mb-1" :for="col.field"> {{ col.headerName }}: </label>

            <CodesSelector
              v-if="col.field === 'annotation.status_codes'"
              :key="col.__metadata__.type"
              :code-type="col.__metadata__.type"
              :show-inactive="true"
              :value="getParamAttr(col.field, 'raw', [])"
              :blanks-option="true"
              @input="setParam(col, $event)"
            />

            <CodesSelector
              v-if="col.field === 'annotation.type_codes'"
              :key="col.__metadata__.type"
              :code-type="col.__metadata__.type"
              :show-inactive="true"
              :value="getParamAttr(col.field, 'raw', [])"
              :blanks-option="true"
              @input="setParam(col, $event)"
            />

            <template
              v-else-if="col.field === 'annotation.department_communication'"
            >
              <CommunicationSelector
                @change="setParam(col, $event)"
              ></CommunicationSelector>
              <textarea
                ref="commInput"
                class="form-control my-2"
                cols="30"
                rows="2"
                :value="getParamAttr(col.field, 'raw')"
                @input="setParam(col, $event.target.value)"
                @change="setParam(col, $event.target.value)"
              ></textarea>
            </template>

            <template v-else>
              <div class="d-flex">
                <div v-if="col.__metadata__.edsEndpoint" class="mr-1">
                  <SearchPeopleButton
                    :search-for="getParamAttr(col.field, 'value')"
                    :eds-endpoint="col.__metadata__.edsEndpoint"
                    :search-field="col.field"
                    @error="error = $event"
                    @change="sliderState = $event"
                  />
                </div>
                <AutoInput
                  :id="col.field + '-panel'"
                  :col="col"
                  :value="getParamAttr(col.field, 'raw')"
                  :pattern="col.__metadata__.pattern"
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
      <div class="alert alert-primary-light d-flex">
        <FeatherIcon class="feather-sm mr-2"></FeatherIcon>
        <span
          >Text fields accept multiple values separated by a semicolon.</span
        >
      </div>
    </form>
    <SearchPeopleSlider
      :slider-state="sliderState"
      @close="sliderState = { data: null, open: false, searchField: null }"
      @input="copyPerson($event)"
    />
  </div>
</template>

<script>
import { debounce, cloneDeep } from "lodash"
import { mapGetters } from "vuex"
import { columns, getColumnDefs } from "./Grid/gridOptions"
import formatters from "../utils/formatters"
import ErrorAlert from "./ErrorAlert"
import CollapseCard from "./CollapseCard"
import PanelControls from "./PanelControls"
import CodesSelector from "./CodesSelector"
import SearchPeopleButton from "./SearchPeopleButton"
import SearchPeopleSlider from "./SearchPeopleSlider"
import AutoInput from "./AutoInput"
import CommunicationSelector from "./CommunicationSelector"
import FilterIcon from "../assets/filter.svg"
import SearchIcon from "../assets/search.svg"
import FeatherIcon from "../assets/feather.svg"

export default {
  name: "PanelSearch",
  components: {
    ErrorAlert,
    CollapseCard,
    PanelControls,
    SearchPeopleButton,
    SearchPeopleSlider,
    AutoInput,
    FilterIcon,
    CodesSelector,
    CommunicationSelector,
    SearchIcon,
    FeatherIcon,
  },
  data() {
    return {
      columnDefs: null,
      collapse: null,
      searchParams: {},
      changed: false,
      error: null,
      sliderState: { data: null, open: false, searchField: null },
    }
  },
  computed: {
    ...mapGetters(["datasource"]),
    search: {
      get() {
        return this.$store.state.search
      },
      set: debounce(function(value) {
        this.$store.commit("setSearch", value)
        if (this.$store.state.gridApi.serverSideRowModel) {
          this.$store.state.gridApi.purgeServerSideCache()
        }
      }, 500),
    },
  },
  /** Get columndefs for use as schema, removing unsearchable fields. */
  mounted() {
    this.columnDefs = getColumnDefs(columns).filter(
      group => !group.__metadata__?.hideInSearch,
    )
    this.collapse = Object.fromEntries(
      this.columnDefs.map(cd => [cd.headerName, true]),
    )
  },
  methods: {
    formatDate: formatters.date,
    /** Collapse/expand all collapsible cards. */
    collapseAll(v) {
      Object.keys(this.collapse).forEach(k => (this.collapse[k] = v))
    },
    /** Set search params from datasource. */
    resetPanel() {
      this.sliderState = { data: null, open: false, searchField: null }
      if (this.datasource.filters) {
        this.searchParams = cloneDeep(this.datasource.filters)
      }
    },
    /** Set new filtered grid datasource and update column filtered status. */
    submit() {
      if (!this.$refs.form.checkValidity())
        return this.$refs.form.reportValidity()
      this.datasource.filters = this.searchParams
      this.params.api.purgeServerSideCache()
      this.changed = false
    },
    clearSearch() {
      this.search = ""
      this.searchParams = {}
      this.submit()
    },
    getParamAttr(field, attr, fallback = "") {
      field = field.replace(".", "__")
      return this.searchParams[field]
        ? this.searchParams[field][attr]
        : fallback
    },
    /** Store search params as an object of key, Django lookup, and value. */
    setParam(col, value) {
      this.changed = true
      const filter = this.datasource.createFilter(col, value)
      if (!filter.raw || !filter.raw.length) {
        this.$delete(this.searchParams, filter.key)
      } else {
        this.$set(this.searchParams, filter.key, filter)
      }
    },
    /** Copy new person to fields within "Cardhholder group" */
    copyPerson(person) {
      let fields
      if (person.searchField.includes("responsible_pcholder")) {
        fields = {
          responsible_pcholder_name: person.cn,
        }
      } else if (person.searchField.includes("pcholder")) {
        fields = {
          pcholder_name: person.phoneBookDisplayName.toUpperCase(),
          pcholder_netid: person.uid,
          pcholder_emplid: person.emplId,
        }
      } else {
        fields = {
          responsible_user_name: person.phoneBookDisplayName.toUpperCase(),
          responsible_user_emplid: person.emplId,
        }
      }
      const columns = this.columnDefs.find(
        columnGroup => columnGroup.headerName === "Cardholder",
      ).children
      Object.entries(fields).forEach(([key, value]) => {
        const col = columns.find(
          column => column.field.replace("annotation.", "") === key,
        )
        this.setParam(col, value)
      })
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

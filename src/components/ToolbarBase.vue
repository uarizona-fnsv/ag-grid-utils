<template>
  <nav class="d-flex h-100 align-items-center px-2" style="background: #EEE;">
    <div style="flex-basis: calc(50% - 175px);">
      <router-view name="toolbar"></router-view>
    </div>
    <div class="input-group" style="max-width: 350px;">
      <div class="input-group-prepend">
        <span class="input-group-text">
          <SearchIcon class="feather-sm"></SearchIcon>
        </span>
      </div>
      <input
        v-model="searchInput"
        type="text"
        class="form-control"
        placeholder="Quick Search"
        aria-label="Quick Search"
        title="Search all text fields"
        @keyup.enter="submitSearch"
      />
      <div class="input-group-append">
        <button
          class="btn btn-outline-secondary text-dark"
          aria-label="More search options"
          title="More search options"
          @click="togglePanel('search')"
        >
          <MenuIcon class="feather-sm"></MenuIcon>
        </button>
      </div>
    </div>
    <div class="ml-auto">
      <span
        v-if="datasource && datasource.totalRows"
        class="badge mx-2 border border-secondary"
        title="Row count"
        @click="showStats"
        >{{ datasource.totalRows.toLocaleString("en-US") }} Rows</span
      >
      <button
        class="btn btn-primary mx-1"
        title="Show statistics"
        @click="showStats"
      >
        <span v-if="statsProgress" class="spinner-grow spinner-grow-sm"></span>
        <InfoIcon v-else class="feather-sm"></InfoIcon>
      </button>
      <button
        id="refresh"
        class="btn btn-primary mx-1"
        title="Refresh grid"
        @click="$store.state.gridApi.purgeServerSideCache()"
      >
        <RefreshIcon class="feather-sm"></RefreshIcon>
      </button>
      <button
        class="btn btn-primary mx-1"
        title="Export CSV of filtered rows"
        @click="downloadCsv"
      >
        <span v-if="exportProgress" class="spinner-grow spinner-grow-sm"></span>
        <FileIcon v-else class="feather-sm"></FileIcon>
        CSV
      </button>
    </div>
  </nav>
</template>

<script>
import SearchIcon from "../assets/search.svg"
import MenuIcon from "../assets/menu.svg"
import FileIcon from "../assets/file.svg"
import RefreshIcon from "../assets/refresh-cw.svg"
import InfoIcon from "../assets/info.svg"

export default {
  components: {
    SearchIcon,
    MenuIcon,
    FileIcon,
    RefreshIcon,
    InfoIcon,
  },
  data() {
    return {
      searchInput: "",
      exportProgress: false,
      statsProgress: false,
    }
  },
  computed: {
    ...mapGetters(["datasource"]),
  },
  methods: {
    /** Request CSV from server and initiate download through phantom link.  */
    async downloadCsv() {
      this.exportProgress = true
      const columns = this.$store.state.columnApi
        .getAllGridColumns()
        .filter(c => c.visible)
        .map(c => c.colId.replace("annotation.", ""))
        .join()
      const [err, res] = await this.$api.get("transactions/export/", {
        params: { ...this.datasource.params, columns },
      })
      if (err) {
        console.error(err)
        this.$alert.fire({
          icon: "error",
          text: err.response?.data || err.toString(),
        })
      } else if (res.data) {
        const url = window.URL.createObjectURL(
          new Blob([res.data], { type: "text/csv; encoding=utf8" }),
        )
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "export.csv")
        document.body.appendChild(link)
        link.click()
      }
      this.exportProgress = false
    },
    togglePanel(name) {
      const { gridApi } = this.$store.state
      if (gridApi.getOpenedToolPanel() === name) {
        gridApi.closeToolPanel()
      } else {
        gridApi.openToolPanel(name)
      }
    },
    submitSearch() {
      this.$store.commit("setSearch", this.searchInput)
      if (this.$store.state.gridApi.serverSideRowModel) {
        this.$store.state.gridApi.purgeServerSideCache()
      }
    },
    async showStats() {
      this.statsProgress = true
      const [err, res] = await this.$api.get("transactions/stats/", {
        params: this.datasource.params,
      })
      if (err) {
        this.$alert.fire({
          icon: "error",
          text: err.response?.data || err.toString(),
        })
        return console.error(err)
      }
      const fmt = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format
      const { total, average } = res.data
      const html = `
      <div style="max-width: 300px; margin-left: auto; margin-right: auto;">
        <p>
          Statistics for currently filtered rows.
        </p>
        <p class="d-flex justify-content-between">
          <strong>Count</strong>
          <span class="badge badge-primary">${this.datasource.totalRows}</span>
        </p>
        <p class="d-flex justify-content-between">
          <strong>Average</strong>
          <span class="badge badge-primary">${fmt(average)}</span>
        </p>
        <p class="d-flex justify-content-between">
          <strong>Total</strong>
          <span class="badge badge-primary">${fmt(total)}</span>
        </p>
      </div>
      `
      this.$alert.fire({ html, icon: "info" })
      this.statsProgress = false
    },
  },
}
</script>

<style></style>

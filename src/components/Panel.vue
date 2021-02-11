<template>
  <div
    class="w-100"
    style="font-size: 1rem; font-family: var(--font-family-sans-serif);"
  >
    <div
      class="card-header sticky-top shadow-sm mb-2 border-right d-flex justify-content-between align-items-center"
    >
      <h4 class="mb-0">
        Related Items
      </h4>
      <PanelControls
        @collapse="collapseAll(true)"
        @expand="collapseAll(false)"
      ></PanelControls>
    </div>

    <ErrorAlert v-if="error" :error="error" @close="error = null"></ErrorAlert>

    <div v-if="!transaction">
      <p class="text-center">
        Select a transaction to view its related items.
      </p>
    </div>

    <div v-else class="p-2">
      <p class="alert alert-secondary">
        Transactions with violations which match the selected:
      </p>
      <CollapseCard
        class="mb-2"
        title="Linked Groups"
        :collapse="collapse.groups"
        @click="collapse.groups = !collapse.groups"
      >
        <GroupsViewer
          v-if="groupParams"
          :unlink="false"
          :groups="groups"
          :groups-params="groupParams"
        ></GroupsViewer>
        <div v-else class="my-3 text-center text-muted">No linked groups.</div>
      </CollapseCard>
      <CollapseCard
        class="mb-2"
        :title="'PCard: ' + pcard"
        :collapse="collapse.pcard"
        @click="collapse.pcard = !collapse.pcard"
      >
        <ClientSideGrid
          :style="{ height: '250px', width: '100%' }"
          :transactions="relatedItems.pcard"
          :row-selection="false"
        ></ClientSideGrid>
      </CollapseCard>
      <CollapseCard
        class="mb-2"
        :title="'Cardholder EmplID: ' + pcholder_emplid"
        :collapse="collapse.pcholder"
        @click="collapse.pcholder = !collapse.pcholder"
      >
        <ClientSideGrid
          :style="{ height: '250px', width: '100%' }"
          :transactions="relatedItems.pcholder_emplid"
          :row-selection="false"
        ></ClientSideGrid>
      </CollapseCard>
      <CollapseCard
        class="mb-2"
        :title="'Reponsible User: ' + responsible_pcholder_emplid"
        :collapse="collapse.responsible"
        @click="collapse.responsible = !collapse.responsible"
      >
        <ClientSideGrid
          :style="{ height: '250px', width: '100%' }"
          :transactions="relatedItems.responsible_pcholder_emplid"
          :row-selection="false"
        ></ClientSideGrid>
      </CollapseCard>
    </div>
  </div>
</template>

<script>
import ErrorAlert from "./ErrorAlert"
import PanelControls from "./PanelControls"
import CollapseCard from "./CollapseCard"
import ClientSideGrid from "./ClientSideGrid"
import GroupsViewer from "./GroupsViewer"
export default {
  name: "RelatedPanel",
  components: {
    ErrorAlert,
    PanelControls,
    CollapseCard,
    ClientSideGrid,
    GroupsViewer,
  },
  data() {
    return {
      error: null,
      selection: null,
      transaction: null,
      groups: null,
      collapse: {
        groups: false,
        pcard: false,
        pcholder: false,
        responsible: false,
      },
    }
  },
  computed: {
    pcard() {
      return this.getField("pcard")
    },
    relatedItems() {
      const fields = ["pcard", "pcholder_emplid", "responsible_pcholder_emplid"]
      const items = Object.fromEntries(fields.map(f => [f, []]))
      if (!this.transaction.related_violations) return items
      this.transaction.related_violations.forEach(related => {
        fields.forEach(field => {
          const relatedValue = this.getField(field, related)
          const transactionValue = this.getField(field)
          if (relatedValue === transactionValue) {
            items[field].push(related)
          }
        })
      })
      return items
    },
    pcholder_emplid() {
      return this.getField("pcholder_emplid")
    },
    responsible_pcholder_emplid() {
      return this.getField("responsible_pcholder_emplid")
    },
    groupParams() {
      const { annotation } = this.transaction
      if (annotation && annotation.groups.length) {
        return { id__in: annotation.groups.join(",") }
      } else {
        return null
      }
    },
  },
  mounted() {
    this.params.api.addEventListener("rowSelected", this.stageTransaction)
    this.params.api.addEventListener("toolPanelVisibleChanged", e => {
      if (e.source === "related") this.fetchTransaction()
    })
  },
  methods: {
    stageTransaction(event) {
      // The rowSelected event fires on deselection as well as selection
      if (event.node.selected === false) return
      const { data, ...gridParams } = event
      this.selection = data
      this.gridParams = gridParams
      if (this.params.api.getOpenedToolPanel() === "related") {
        this.fetchTransaction()
      }
    },
    async fetchTransaction() {
      const [error, response] = await this.$api.get(
        `transactions/${this.selection.id}/?related_violations=true`,
      )
      if (error) this.error = error.toString()
      if (response) {
        this.transaction = response.data
      }
    },
    /** Return value from either transaction (preferred) or its annotation. */
    getField(id, transaction = this.transaction) {
      const transaction_value = transaction[id]
      const annotation = this.transaction.annotation
      if (this.isEmpty(transaction_value)) {
        return (annotation && annotation[id]) || ""
      } else {
        return transaction_value
      }
    },
    isEmpty(value) {
      return value === "" || value === null || value === undefined
    },
    /** Collapse/expand all collapsible cards. */
    collapseAll(v) {
      Object.keys(this.collapse).forEach(k => (this.collapse[k] = v))
    },
  },
}
</script>

<style></style>

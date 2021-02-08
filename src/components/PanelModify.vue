<template>
  <div
    ref="panel"
    class="w-100"
    style="font-size: 1rem; font-family: var(--font-family-sans-serif);"
  >
    <div
      class="card-header sticky-top shadow-sm mb-2 border-right d-flex justify-content-between align-items-center"
    >
      <h4 class="mb-0">
        {{ STATE === STATES.createStandalone ? "Create" : "Modify" }}
      </h4>
      <div>
        <PanelControls
          @collapse="collapseAll(true)"
          @expand="collapseAll(false)"
        >
          <button id="save" class="btn btn-sm btn-primary mr-1" @click="submit">
            <SaveIcon aria-hidden class="feather-sm mr-1"></SaveIcon>
            <strong>Save</strong>
          </button>
        </PanelControls>
      </div>
    </div>

    <div v-if="!transaction" class="text-center my-3">
      Double-click a transaction to modify it.
    </div>

    <form v-else ref="form" class="p-2 position-relative">
      <ErrorAlert
        v-if="error"
        :error="error"
        @close="error = null"
      ></ErrorAlert>

      <div
        v-if="showMissing && requiredFieldsMissing.length"
        class="alert alert-warning alert-dismissible fade show"
        role="alert"
      >
        <h4>Required fields missing:</h4>
        <ul>
          <li v-for="card in requiredFieldsMissing" :key="card.field">
            <strong>{{ card.group }} > </strong>
            {{ card.label }}
          </li>
        </ul>
        <button
          type="button"
          class="close"
          aria-label="Close"
          @click="showMissing = false"
        >
          <span aria-hidden="true">&times;</span>
        </button>
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
            class="form-group d-flex flex-wrap"
          >
            <template v-if="labelledGroup(col)">
              <label class="mb-1" :for="col.field">{{ col.headerName }}:</label>
              <div style="flex-basis: 100%; height: 0;"></div>
            </template>

            <SearchPeopleButton
              v-if="col.__metadata__.edsEndpoint && isEditable(col)"
              class="mr-1"
              :search-for="getField(col.field)"
              :eds-endpoint="col.__metadata__.edsEndpoint"
              :search-field="col.field"
              @error="error = $event"
              @change="sliderState = $event"
            />

            <input
              v-if="col.__metadata__.type === 'string'"
              :id="col.field"
              :readonly="!isEditable(col)"
              :value="getField(col.field)"
              type="text"
              class="form-control"
              :pattern="col.__metadata__.pattern || null"
              :title="col.__metadata__.title || null"
              :aria-describedby="col.field"
              @change="updateField(col, $event)"
            />

            <input
              v-else-if="col.__metadata__.type === 'number'"
              :id="col.field"
              :readonly="!isEditable(col)"
              :value="getField(col.field)"
              type="number"
              class="form-control"
              :aria-describedby="col.field"
              :step="1"
              @change="updateField(col, $event)"
            />

            <input
              v-else-if="col.__metadata__.type === 'dollar'"
              :id="col.field"
              :readonly="!isEditable(col)"
              :value="getField(col.field)"
              type="number"
              class="form-control"
              :aria-describedby="col.field"
              :step="0.01"
              @change="updateField(col, $event)"
            />

            <input
              v-else-if="col.__metadata__.type === 'date'"
              :id="col.field"
              :readonly="!isEditable(col)"
              :value="getDateValue(col.field)"
              type="date"
              class="form-control"
              :aria-describedby="col.field"
              @change="updateField(col, $event)"
            />

            <input
              v-else-if="col.__metadata__.type === 'datetime'"
              :id="col.field"
              :readonly="!isEditable(col)"
              :value="getDateValue(col.field)"
              type="date"
              class="form-control"
              :aria-describedby="col.field"
              @change="updateField(col, $event)"
            />

            <!-- Resources -->
            <CodesSelector
              v-if="
                col.__metadata__.type === 'status_codes' ||
                  col.__metadata__.type === 'type_codes'
              "
              :key="col.__metadata__.type"
              v-model="annotation[col.__metadata__.type]"
              :code-type="col.__metadata__.type"
            />

            <template v-else-if="col.__metadata__.type === 'comments'">
              <PanelModifyComments
                :comments="annotation.comments"
                @submit="createComment"
              ></PanelModifyComments>
            </template>

            <template
              v-else-if="col.__metadata__.type === 'department_communication'"
            >
              <CommunicationSelector
                @change="annotation.department_communication += $event"
              ></CommunicationSelector>
              <textarea
                v-model="annotation.department_communication"
                class="form-control my-2"
                cols="30"
                rows="2"
                placeholder="No department communication."
              ></textarea>
            </template>

            <div v-else-if="col.__metadata__.type === 'sample'">
              <div v-if="!annotation.sample" class="text-center">
                This transaction has not been sampled.
              </div>
              <div
                v-else
                class="d-flex justify-content-between align-items-center"
              >
                <a
                  :href="annotation.sample.screenshot"
                  class="btn btn-primary-light btn-sm"
                  target="_blank"
                  noopener
                  noreferrer
                >
                  #{{ annotation.sample.id }}: {{ annotation.sample.reason }}
                </a>
                <small
                  >{{ annotation.sample.created_by }} &mdash;
                  {{
                    formatters.datetime(annotation.sample.created_date)
                  }}</small
                >
              </div>
            </div>
          </div>
        </template>
      </CollapseCard>
    </form>

    <SearchPeopleSlider
      :slider-state="sliderState"
      @close="sliderState = { data: null, open: false, searchField: null }"
      @input="copyPerson($event)"
    />
  </div>
</template>

<script>
import formatters from "../utils/formatters"
import CollapseCard from "./CollapseCard"
import CodesSelector from "./CodesSelector"
import ErrorAlert from "./ErrorAlert"
import PanelControls from "./PanelControls"
import CommunicationSelector from "./CommunicationSelector"
import SearchPeopleSlider from "./SearchPeopleSlider"
import SearchPeopleButton from "./SearchPeopleButton"
import PanelModifyComments from "./PanelModifyComments"
import SaveIcon from "../assets/save.svg"

export default {
  components: {
    CollapseCard,
    CodesSelector,
    ErrorAlert,
    PanelControls,
    CommunicationSelector,
    SearchPeopleButton,
    SearchPeopleSlider,
    PanelModifyComments,
    SaveIcon,
  },
  data() {
    return {
      formatters,
      STATES: {
        // This component must always be in one of these possible states
        inactive: "inactive",
        createAnnotation: "createAnnotation",
        updateAnnotation: "updateAnnotation",
        createStandalone: "createStandalone",
        updateStandalone: "updateStandalone",
      },
      STATE: "inactive", // Current state of the component
      // Working data
      sliderState: { data: null, open: false, searchField: null },
      transaction: null,
      annotation: {},
      rowParams: null,
      error: null,
      collapse: null,
      showMissing: false,
      // Schema
      columnDefs: null,
    }
  },
  /**
   * Custom validation and alert message for any required fields,
   *
   * returns Array of objects representing each missing field
   * { group, field, label }
   */
  computed: {
    requiredFieldsMissing() {
      const requiredFields = [
        {
          group: "Cardholder",
          field: "pcholder_name",
          label: "Cardholder Last, First",
        },
        { group: "Codes", field: "status_codes", label: "Status" },
        { group: "Codes", field: "type_codes", label: "Type" },
      ]
      return requiredFields.filter(
        f =>
          !this.annotation[f.field].length &&
          !this.transaction[f.field]?.length,
      )
    },
  },
  /**
   * Grab grid columns and listen to grid events for activation.
   *
   * `createStandaloneAnnotation` is a custom event dispatched by the Create button.
   * */
  mounted() {
    this.initAnnotation()
    this.columnDefs = this.params.api.gridOptionsWrapper.gridOptions.columnDefs
    // Object for tracking whether group cards are collapsed
    this.collapse = Object.fromEntries(
      this.columnDefs.map(cd => [cd.headerName, false]),
    )

    this.params.api.addEventListener("rowDoubleClicked", this.setupTransaction)
    this.params.api.addEventListener(
      "createStandaloneAnnotation",
      this.setupStandaloneAnnotation,
    )
    this.params.api.addEventListener("toolPanelVisibleChanged", () => {
      this.sliderState = { data: null, open: false, searchField: null }
    })
  },
  methods: {
    /** Set up for an annotation which is not associated with a transaction. */
    setupStandaloneAnnotation() {
      this.initAnnotation()
      this.transaction = {}
      this.STATE = this.STATES.createStandalone
      this.params.api.openToolPanel("modify")
    },
    /** Set up to annotate a transaction from the grid. */
    setupTransaction({ data, ...rowParams }) {
      this.rowParams = rowParams
      const { annotation, ...transaction } = data
      this.transaction = transaction || {}
      if (annotation) {
        this.annotation = { ...annotation, comments: [] } // Overwrite comment count from transaction list API
      } else {
        this.initAnnotation()
        this.annotation.transaction = transaction ? transaction.id : null
      }
      if (!annotation && transaction) {
        this.STATE = this.STATES.createAnnotation
      } else if (annotation && transaction.edoc_number) {
        this.STATE = this.STATES.updateAnnotation
        this.fetchAnnotation()
      } else if (annotation && !transaction?.edoc_number) {
        this.STATE = this.STATES.updateStandalone
        this.fetchAnnotation()
      }
      this.params.api.openToolPanel("modify")
    },
    updateField(col, event) {
      const key = col.field.replace("annotation.", "") // for annotation-only fields
      this.annotation[key] = event.target.value
    },
    async fetchAnnotation() {
      const [err, res] = await this.$api.get(
        `/transactions/${this.transaction.id}/`,
      )
      if (err) {
        this.error = err
      } else if (res) {
        this.annotation = { ...this.annotation, ...res.data?.annotation }
      }
    },
    /** Collapse/expand all collapsible cards. */
    collapseAll(v) {
      Object.keys(this.collapse).forEach(k => (this.collapse[k] = v))
    },
    /** Return value from either transaction (preferred) or its annotation. */
    getField(id) {
      const key = id.replace("annotation.", "")
      const transaction_value = this.transaction[key]
      const annotation_value = this.annotation[key]
      if (this.isEmpty(transaction_value)) {
        return annotation_value
      } else {
        return transaction_value
      }
    },
    /** Same as getField but handles converting ISO 8601 datetimes. */
    getDateValue(id) {
      const value = this.getField(id)
      if (!value) return
      const time_start = value.indexOf("T")
      if (time_start > -1) {
        return value.slice(0, time_start)
      }
      return value
    },
    /** Return whether a field can be edited. Transaction-defined fields should be immutable. */
    isEditable(col) {
      switch (this.STATE) {
        case this.STATES.createStandalone:
          return col.field !== "edoc_number"
        case this.STATES.updateStandalone:
          return true
        case this.STATES.createAnnotation:
        case this.STATES.updateAnnotation:
        default:
          return (
            col.__metadata__?.editable &&
            this.isEmpty(this.transaction[col.field])
          )
      }
    },
    isEmpty(value) {
      return value === "" || value === null || value === undefined
    },
    labelledGroup(col) {
      return [
        "string",
        "number",
        "dollar",
        "date",
        "datetime",
        "type_codes",
        "status_codes",
      ].includes(col.__metadata__.type)
    },
    submit() {
      if (
        !this.requiredFieldsMissing.length &&
        this.$refs.form.checkValidity()
      ) {
        this.saveAnnotation()
      } else {
        this.showMissing = true
        this.$refs.form.reportValidity()
      }
    },
    /** Clears all annotation fields for create mode */
    initAnnotation() {
      this.annotation = {
        transaction: null,
        status_codes: [],
        type_codes: [],
        groups: [],
        pcholder_name: null,
        pcholder_netid: null,
        pcholder_emplid: null,
        responsible_pcholder_name: null,
        responsible_user_name: null,
        responsible_user_emplid: null,
        department_communication: null,
        sample: null,
        comments: [],
      }
    },
    /** Create or update the annotation. */
    async saveAnnotation() {
      switch (this.STATE) {
        case this.STATES.createStandalone:
        case this.STATES.createAnnotation:
          await this.createAnnotation()
          this.params.api.purgeServerSideCache()
          break
        case this.STATES.updateStandalone:
          if (this.annotation.edoc_number) {
            await this.validateEdoc()
          } else {
            await this.updateAnnotation()
            this.updateGridRow()
          }
          break
        case this.STATES.updateAnnotation:
        default:
          await this.updateAnnotation()
          this.updateGridRow()
          break
      }
    },
    /** Create a new annotation & refresh the grid. */
    async createAnnotation() {
      const path = `/annotations/`
      const [error, response] = await this.$api.post(path, this.annotation)
      if (error) {
        this.error = error
      } else {
        this.annotation = response.data
        if (this.STATE === this.STATES.createStandalone) {
          this.STATE = this.STATES.updateStandalone
        } else {
          this.STATE = this.STATES.updateAnnotation
        }
      }
    },
    /** Update an exisitng annotation and its grid row with the response. */
    async updateAnnotation() {
      const path = `/annotations/${this.annotation.id}/`
      const [error, response] = await this.$api.put(path, this.annotation)
      if (error) {
        this.error = error
        throw new Error(error)
      } else {
        this.annotation = response.data
      }
    },
    /** Update the associated grid row data & flash the row. */
    updateGridRow() {
      this.rowParams.node.setData({
        ...this.transaction,
        annotation: {
          ...this.annotation,
          comments: this.annotation.comments.length,
        },
      })
      this.params.api.flashCells({ rowNodes: [this.rowParams.node] })
    },
    /** Create a new comment, creating an annotation if one doesn't yet exist. */
    async createComment(text) {
      switch (this.STATE) {
        case this.STATES.createStandalone:
        case this.STATES.createAnnotation:
          await this.createAnnotation()
          this.params.api.purgeServerSideCache()
          break
        default:
          break
      }
      const comment = {
        text,
        annotation: this.annotation.id,
      }
      const [error, response] = await this.$api.post("/comments/", comment)
      if (error) {
        this.error = error
      } else if (this.annotation.comments) {
        this.annotation.comments.push(response.data)
      } else {
        this.annotation.comments = [response.data]
      }
    },
    /** Copy new person to fields within "Cardhholder group" */
    copyPerson(person) {
      let fields
      if (person.searchField.includes("responsible_pcholder")) {
        fields = { responsible_pcholder_name: person.cn }
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
      Object.entries(fields).forEach(([key, value]) => {
        this.annotation[key] = value
      })
    },
    async validateEdoc() {
      const [error, response] = await this.$api.get(
        `/transactions/${this.annotation.edoc_number}/edoc/`,
      )
      if (error) {
        this.error = error
        throw new Error(error)
      } else if (response.data.annotation) {
        this.$alert.fire({
          icon: "error",
          title: "Unable to link Transaction",
          text: `Transaction with Edoc number ${this.annotation.edoc_number} is already coded`,
        })
        return
      }
      const confirm = await this.$alert.fire({
        title: "Connect Transaction",
        html: `
          <div class="card">
            <div class="card-header">
              <h4>Transaction details:</h4>
            </div>
            <div class="card-body">
              <div class="d-flex flex-row">
                <strong>Reference (Edoc):</strong> <span class="ml-auto">${response.data.edoc_number}</span>
              </div>
              <div class="d-flex flex-row">
                <strong>Transaction ID:</strong> <span class="ml-auto">${response.data.transaction_id}</span>
              </div>
              <div class="d-flex flex-row">
                <strong>PCARD (Last Four):</strong> <span class="ml-auto">${response.data.pcard}</span>
              </div>
              <div class="d-flex flex-row">
                <strong>Cardholder Last, First:</strong> <span class="ml-auto">${response.data.pcholder_name}</span>
              </div>
              <div class="d-flex flex-row">
                <strong>Cardholder netid:</strong> <span class="ml-auto">${response.data.pcholder_netid}</span>
              </div>
            </div>
          </div>
          <div class="mt-3 alert alert-warning">This action cannot be undone.</div>
          <div class="alert alert-warning">Conflicting fields will be overridden by the transaction.</div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Connect",
      })
      if (!confirm.isConfirmed) return
      this.annotation.transaction = response.data.id
      await this.updateAnnotation()
      this.transaction = response.data
      this.updateGridRow()
    },
  },
}
</script>

<style scoped>
.form-control[readonly] {
  background-color: rgb(245, 245, 248);
}
input.form-control {
  width: initial !important;
  flex-grow: 1;
}
</style>

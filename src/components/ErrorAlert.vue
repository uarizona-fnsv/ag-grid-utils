<template>
  <div
    ref="alert"
    class="alert alert-danger alert-dismissible fade show"
    role="alert"
  >
    <div class="d-flex justify-content-between align-items-start">
      <div style="line-height: 1.5em;">
        <strong v-if="parsed.message">{{ parsed.message }}</strong>

        <pre
          v-if="parsed.pre"
          class="m-0 overflow-auto"
          style="line-height: 1em;"
          v-text="parsed.pre"
        ></pre>
        <div v-if="parsed.detail" v-text="parsed.detail"></div>

        <ul>
          <li v-for="(value, key) in parsed.list" :key="key">
            <span v-if="!Array.isArray(parsed.list)"> {{ key }}: </span>
            <span>{{ toString(value) }}</span>
          </li>
        </ul>
      </div>

      <button
        type="button"
        class="close"
        aria-label="Close"
        @click="$emit('close')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * @type {Error|string}
     */
    error: { type: [Error, String], default: null },
  },
  computed: {
    parsed() {
      const parts = {
        message: "",
        pre: "",
        detail: "",
        list: null,
      }
      if (typeof this.error == "string") {
        parts.message = this.error
        return parts
      }
      parts.message = this.error.message
      if (!this.error.response?.data) return parts
      if (typeof this.error.response.data == "string") {
        if (this.error.response.data.length > 100) {
          parts.pre = this.error.response.data
        } else {
          parts.detail = this.error.response.data
        }
      } else if (this.error.response.data?.detail) {
        parts.detail = this.error.response.data.detail
      } else if (this.error.response.data) {
        parts.list = this.error.response.data
      }
      return parts
    },
  },
  methods: {
    toString(v) {
      if (typeof v == "string") {
        return v
      } else {
        return v.join(", ")
      }
    },
  },
}
</script>

<style scoped>
ul {
  margin: 0;
  padding-left: 1.5em;
}
</style>

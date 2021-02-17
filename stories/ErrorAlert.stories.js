import ErrorAlert from "../src/components/ErrorAlert.vue"

export default {
  title: "Components/ErrorAlert",
  component: ErrorAlert,
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ErrorAlert },
  template: `
    <ErrorAlert v-bind="$props" v-if="showError" @close="toggleError" />
  `,
  data() {
    return {
      showError: true,
    }
  },
  methods: {
    toggleError() {
      this.showError = false
      setTimeout(() => (this.showError = true), 1000)
    },
  },
})

export const string = Template.bind({})
string.args = {
  error: "Error 418: I'm a Teapot",
}

export const GenericError = Template.bind({})
GenericError.args = {
  error: new Error("Error: Operation completed successfully"),
}

export const BadRequest = Template.bind({})
const badRequestError = new Error("Bad Request")
// @ts-ignore
badRequestError.response = {
  data: {
    name: "Sorry, a name is required.",
    age: "Age must be positive number",
  },
}
BadRequest.args = {
  error: badRequestError,
}

export const MissingFields = Template.bind({})
const missingFieldsError = new Error("Missing Fields")
// @ts-ignore
missingFieldsError.response = {
  data: ["maximum", "minimum", "mean"],
}
MissingFields.args = {
  error: missingFieldsError,
}

export const PermissionDenied = Template.bind({})
const permissionError = new Error("Permission Denied")
// @ts-ignore
permissionError.response = {
  data: { detail: "You do not have permission to go here." },
}
PermissionDenied.args = {
  error: permissionError,
}

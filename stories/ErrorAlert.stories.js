import ErrorAlert from "../src/components/ErrorAlert.vue"
import { action } from "@storybook/addon-actions"

export default {
  title: "Support/ErrorAlert",
  component: ErrorAlert,
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ErrorAlert },
  template: `
    <ErrorAlert v-bind="$props" v-if="showError" @close="onClose" />
  `,
  data() {
    return {
      showError: true,
    }
  },
  methods: {
    onClose: action("close"),
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

export const PasswordRequirements = Template.bind({})
const passwordError = new Error("Password Failed Requirements")
// @ts-ignore
passwordError.response = {
  data: [
    "Exactly 31 characters",
    "At least one uppercase Latin letter",
    "At least one lowercase Greek letter",
    "At least one cuneiform glyph",
    "At least one traffic sign emoji",
    "Must contain your first name in Morse code",
    "Must not contain the word “Voldemort”",
    //https://twitter.com/rauschma/status/1362132390232096772?s=20
  ],
}
PasswordRequirements.args = {
  error: passwordError,
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

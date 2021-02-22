import { action } from "@storybook/addon-actions"
import AutoInput from "../src/components/AutoInput.vue"
import * as AutocompleteStories from "./Autocomplete.stories"

export default {
  title: "Support/AutoInput",
  component: AutoInput,
  argTypes: {
    value: {
      table: {
        disable: true,
      },
    },
  },
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes).filter(x => x !== "value"),
  data() {
    return { value: args.many ? [""] : "" }
  },
  components: { AutoInput },
  template: `
  <form className="form-group" @submit.prevent>
    <AutoInput
      v-bind="$props"
      v-model="value"
      @input="onAction('input', $event)"
      @change="onAction('change', $event)"
    />
    <pre
      class="mt-3 p-2 bg-dark text-white rounded"
    ><code id="json">{{ JSON.stringify(value) }}</code></pre>
  </form>`,
  methods: {
    onAction(type, value) {
      action(type)(value)
    },
  },
})

export const string = Template.bind({})
string.args = {
  id: "name",
  type: "string",
  getOptions: AutocompleteStories.Primary.args.getOptions,
  clearable: true,
  pattern: "\\w*",
  delayOptions: false,
}

export const multistring = Template.bind({})
multistring.args = {
  id: "name",
  type: "string",
  getOptions: AutocompleteStories.Primary.args.getOptions,
  pattern: "\\w*",
  clearable: true,
  multi: true,
  delayOptions: false,
}

export const number = Template.bind({})
number.args = {
  id: "answer_to_life_the_universe_and_everything",
  type: "number",
  clearable: true,
  delayOptions: false,
}

export const date = Template.bind({})
date.args = {
  id: "today",
  type: "date",
  clearable: true,
  delayOptions: false,
}

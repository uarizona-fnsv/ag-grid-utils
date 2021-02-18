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
    return { value: "" }
  },
  components: { AutoInput },
  template: `
  <div className="form-group">
    <label>{{title}}</label>
    <AutoInput v-bind="$props" v-model="value" />
  </div>`,
})

export const string = Template.bind({})
string.args = {
  id: "name",
  type: "string",
  getOptions: AutocompleteStories.Primary.args.getOptions,
  title: "Team Members",
}

export const number = Template.bind({})
number.args = {
  id: "answer_to_life_the_universe_and_everything",
  type: "number",
  title: "The Answer To Life The Universe And Everything",
}

export const date = Template.bind({})
date.args = {
  id: "today",
  type: "date",
  title: "Today's Date",
}

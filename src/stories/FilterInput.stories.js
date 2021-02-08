import FilterInput from "../components/FilterInput.vue"
import * as AutocompleteStories from "./Autocomplete.stories"

export default {
  title: "Components/FilterInput",
  component: FilterInput,
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
  components: { FilterInput },
  template: '<FilterInput v-bind="$props" v-model="value" />',
})

export const string = Template.bind({})
string.args = {
  id: "name",
  type: "string",
  getOptions: AutocompleteStories.Primary.args.getOptions,
}

export const number = Template.bind({})
number.args = {
  id: "answer_to_life_the_universe_and_everything",
  type: "number",
  value: "42",
}

export const date = Template.bind({})
date.args = {
  id: "today",
  type: "date",
  value: new Date().toISOString().split("T")[0],
}

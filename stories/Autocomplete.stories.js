import { action } from "@storybook/addon-actions"
import Autocomplete from "../src/components/Autocomplete.vue"

export default {
  title: "Support/Autocomplete",
  component: Autocomplete,
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Autocomplete },
  template: `<div class="form-group">
    <Autocomplete v-bind="$props" id="auto">
      <template #default="{ blankOption, options }">
      <ul class="list-group">
        <li
          v-if="blankOption" 
          class="list-group-item
          list-group-item-action"
          @click="onSelect('(Blanks)')"
          >Blanks</li>
          <li
            v-for="option in options"
            @click="onSelect(option)"
            class="list-group-item list-group-item-action"
          >{{ option }}</li>
        </ul>
      </template>
    </Autocomplete>
  </div>`,
  methods: {
    onSelect: action("selected"),
  },
})

export const Primary = Template.bind({})
Primary.args = {
  async getOptions(value) {
    const all = [
      "Brock",
      "Jason",
      "Dan",
      "Chris",
      "Logan",
      "Adam",
      "Carl",
      "Phillip",
      "Alexa",
      "Judy",
      "Justin",
      "Lane",
      "Mary",
    ]
    if (!value || Array.isArray(value)) return all
    return all.filter(x => x.toLowerCase().includes(value.toLowerCase()))
  },
  id: "auto",
  delayFetch: false,
  blankOption: true,
}
Primary.storyName = "Autocomplete"

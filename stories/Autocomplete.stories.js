import Autocomplete from "../src/components/Autocomplete.vue"

export default {
  title: "Components/Autocomplete",
  component: Autocomplete,
  argTypes: {
    value: {
      table: {
        disable: true,
      },
    },
  },
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes).filter(x => x !== "value" && x !== "focus"),
  components: { Autocomplete },
  template: `<div class="form-group">
    <label>Team Members</label>
    <input list="auto" class="form-control" autocomplete="off" @focus="focus=true" />
    <Autocomplete v-bind="$props" :value="value" id="auto" :focus="focus" />
  </div>`,
  data() {
    return { value: "", focus: false }
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
      "Pillip",
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
  blankOption: false,
}
Primary.storyName = "Autocomplete"

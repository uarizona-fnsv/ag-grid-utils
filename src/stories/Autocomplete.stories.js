import Autocomplete from "../components/Autocomplete.vue"

export default {
  title: "Components/Autocomplete",
  component: Autocomplete,
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Autocomplete },
  template: `<Autocomplete v-bind="$props"  />`,
})

export const Primary = Template.bind({})
Primary.args = {
  getOptions(value) {
    const all = ["Brock", "Jason", "Dan", "Chris", "Logan", "Adam"]
    if (!value || Array.isArray(value)) return all
    return all.filter(x => x.toLowerCase().includes(value.toLowerCase()))
  },
  id: "name-list",
  field: "name",
  blankOption: true,
}

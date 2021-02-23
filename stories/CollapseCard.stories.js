import { action } from "@storybook/addon-actions"
import CollapseCard from "../src/components/CollapseCard.vue"

export default {
  title: "Support/CollapseCard",
  component: CollapseCard,
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CollapseCard },
  template: `
    <CollapseCard v-bind="$props" id="auto" @click="onClick">
      <template>
        <p>Plutonium is a radioactive chemical element with the symbol Pu
        and atomic number 94. It is an actinide metal of silvery-gray appearance
        that tarnishes when exposed to air, and forms a dull coating when oxidized.
        The element normally exhibits six allotropes and four oxidation states.
        It reacts with carbon, halogens, nitrogen, silicon, and hydrogen.
        When exposed to moist air, it forms oxides and hydrides that can expand
        the sample up to 70% in volume, which in turn flake off as a powder that
        is pyrophoric. It is radioactive and can accumulate in bones, which makes
        the handling of plutonium dangerous. </p>
      </template>
    </CollapseCard>
  `,
  data() {
    return {
      collpase: false,
    }
  },
  methods: {
    onClick(event) {
      this.collapse = !this.collapse
      action("click")(event)
    },
  },
})

export const Primary = Template.bind({})
Primary.args = {
  title: "Plutonium",
}
Primary.storyName = "CollapseCard"

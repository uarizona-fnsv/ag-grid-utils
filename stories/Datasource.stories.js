import Datasource from "../src/Datasource"

export default {
  title: "Components/Form Validators",
  component: Datasource,
  parameters: {
    previewTabs: { canvas: { hidden: true } },
    docsOnly: true,
  },
}

export const Primary = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: "<div>Test</div>",
})

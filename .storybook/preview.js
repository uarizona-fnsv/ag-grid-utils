import "@fso/bootstrap/dist/bootstrap.css"
import Vue from "vue"

Vue.prototype.$api = {
  get(path, options) {
    if (path.includes("autocomplete/")) {
      return [null, ["Bork Mackleboi", "JSON Leone", "Cats"]]
    } else {
      return [{ response: { data: "Not found" }, statusCode: 404 }, null]
    }
  },
}

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

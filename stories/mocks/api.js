import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import data from "./olympicWinners.json"

const mock = new MockAdapter(axios)
mock.onGet(/\/olympic\/.*/).reply(config => {
  const { limit, offset, ...filterParams } = config.params
  const filters = Object.entries(filterParams)
  if (filters.length) console.log("Request filters:", filterParams)
  const filterFn = row => {
    return filters
      .map(([key, value]) => {
        const [field, lookup] = key.split("__")
        let target = row[field]
        if (typeof target === "string") {
          target = target.toLowerCase()
          value = value.toLowerCase()
        }
        if (lookup === "icontains") {
          return target.includes(value)
        } else if (!lookup) {
          return target == value
        }
      })
      .every(x => x)
  }
  let results = data.filter(filterFn).slice(offset, offset + limit)
  return [200, { results, count: results.length }]
})

mock.onGet(/\/autocomplete\/.*/).reply(config => {
  const { limit = 10, field, value } = config.params
  let results = data
    .map(row => row[field])
    .filter(onlyUnique)
    .filter(item => item.toLowerCase().includes(value.toLowerCase()))
    .slice(0, limit)
  return [200, results]
})

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

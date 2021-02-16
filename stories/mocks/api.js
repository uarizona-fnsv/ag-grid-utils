import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { data } from "./olympicWinners.json"

const mock = new MockAdapter(axios)

const filterFns = {
  icontains: (target, values) => {
    return values
      .map(v => target.toLowerCase().includes(v.toLowerCase()))
      .every(x => x)
  },
  in: (target, values) => {
    return !values.map(v => target === v).every(x => !x)
  },
  isnull: (target, values) => {
    return values
      .map(v => target === null || target === undefined)
      .every(x => x)
  },
  iexact: (target, values) => {
    return values.map(v => target === v).every(x => x)
  },
}

mock.onGet(/\/olympic\/.*/).reply(config => {
  const { limit, offset, ...filterParams } = config.params
  const filters = Object.entries(filterParams)
  if (filters.length) console.log("Request filters:", filterParams)
  const filterFn = row => {
    return filters
      .map(([key, val]) => {
        const [field, lookup] = key.split("__")
        const value = val.split(",")
        const target = String(row[field])
        const filter = filterFns[lookup] || filterFns.iexact
        return filter(target, value)
      })
      .every(x => x)
  }
  let results = data.filter(filterFn).slice(offset, offset + limit)
  return [200, { results, count: results.length }]
})

mock.onGet(/\/autocomplete\/.*/).reply(config => {
  const { limit, field, value } = config.params
  let results = data
    .map(row => String(row[field]))
    .filter(onlyUnique)
    .filter(item => item.toLowerCase().includes(value.toLowerCase()))
    .slice(0, limit)
    .sort((a, b) => a.localeCompare(b))
  return [200, results]
})

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

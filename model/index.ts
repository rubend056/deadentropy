import { mapValues } from "lodash"
import { access } from "./access"
import schemas from "./schema"
import validators, { create } from "./validate"

const va = mapValues({ client: false, default: true }, (is_client, vname) => {
  create(vname)
  const validator = validators[vname]

  const s = { access, ...schemas(is_client) }
  validator.addSchema(Object.values(s))

  return mapValues(s, (v, k) => validator.compile(v))
})

export default va

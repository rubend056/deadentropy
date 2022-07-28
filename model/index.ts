import { AnyValidateFunction } from "ajv/dist/core"
import { filter, mapValues } from "lodash"
import { access } from "./access"
import schemas from "./schema"
import validators, { create } from "./validate"

/**  Plain Javscript way */
// ['default','client'].forEach(v=>{create(v);validators[v].addSchema(schemas(v))})

/**  Typescript way */
const va = mapValues({ default: false, client: true }, (is_client, name) => {
  const validator = create(name)
  const s = schemas(name)
	// Object.fromEntries(Object.entries (schemas(name)).filter(([k,v])=>Boolean(v))) as Record<keyof ReturnType<typeof schemas>, any>
	
  // console.log("Adding schemas for ", name)
  validator.addSchema(Object.values(s))
  // console.log("Compiling schemas for ", name)

  return mapValues(s, (v, k) => {
		const n = `/schemas/${name}/${k}`;
    const l = validator.getSchema(n)
    if (!l) throw `Validator undefined getting '${n}'`
    return l
  })
})

export default va

import Ajv from "ajv"
import addFormats from "ajv-formats"
import addKeywords from "ajv-keywords"
import { addFormatsAccess } from "./access"

/**
 * Ajv validation object
 *
 * va.
 **/



const validators:Record<string,Ajv> = {}

export const create = (v: string) => {
  if (!validators[v])
    validators[v] = [
      (v) => addKeywords(v),
      (v) => addFormats(v, { mode: "full" }),
      addFormatsAccess,
    ].reduce((a, f) => f(a), new Ajv()) as Ajv
}

create("default")

export default validators

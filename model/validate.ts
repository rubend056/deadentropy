import Ajv from "ajv"
import addFormats from "ajv-formats"
import addKeywords from "ajv-keywords"
import { addFormatsAccess } from "./access"

/**
 * Ajv validation object
 *
 * va.
 **/
const validate = [
  (v) => addKeywords(v),
  (v) => addFormats(v, { mode: "full" }),
  addFormatsAccess,
].reduce((a, f) => f(a), new Ajv()) as Ajv

export default validate

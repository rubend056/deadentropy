import Ajv from "ajv"
import addFormats from "ajv-formats"
import addKeywords from "ajv-keywords"

/**
 * Ajv validation object
 *
 * va.
 **/
const va = [
  (v) => addKeywords(v),
  (v) => addFormats(v, { mode: "full" }),
].reduce((a, f) => f(a), new Ajv())

export default va

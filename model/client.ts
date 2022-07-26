import { access } from "./access"
import { JSONSchema7 } from "json-schema"
import { mapValues } from "lodash"

let schemas_client= {
  note: {
		
	}as JSONSchema7
} as const

schemas_client = mapValues(schemas_client, (v,k) => {v.$id ??= k;return v;})

export default schemas_client
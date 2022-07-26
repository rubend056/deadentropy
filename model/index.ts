import { mapValues } from "lodash"
import schemas_client from "./client"
import schemas_db from "./db"
import validate from "./validate"

const schemas = Object.assign({}, schemas_db, schemas_client)
validate.addSchema(Object.values(schemas))

export const vad = mapValues(schemas_db, (v, k) => validate.compile(v))
export const vac = mapValues(schemas_client, (v, k) => validate.compile(v))


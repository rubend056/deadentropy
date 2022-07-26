/**
 * These files describe model defitions in our App.
 *
 * Reference: https://json-schema.org/
 */

import { access } from "./access"
import { JSONSchema7 } from "json-schema"
import { mapValues } from "lodash"

let schemas_db= {
  note: {
    title: "Note",
    description: "Describes a note",
    type: "object",
    properties: {
      value: { type: "string", description: "The note's content" },
      access,
    },
  } as JSONSchema7,
  user: {
    title: "User",
    description: "Describes a user that can use our app",
    type: "object",
    properties: {
      user: { type: "string", format: "user", description: "Username" },
      pass: { type: "string", description: "Hashed user's password" },
      salt: {
        type: "string",
        description: "A salt value secures the pass against attacks on the DB",
      },
      enabled: { type: "boolean" },
      name: { type: "string" },
      photo: { type: "string" },
    },
  } as JSONSchema7,
} as const

schemas_db = mapValues(schemas_db, (v,k) => {v.$id ??= `db:${k}`;return v;})

export default schemas_db

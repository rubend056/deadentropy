/**
 * These files describe model defitions in our App.
 *
 * Reference: https://json-schema.org/
 */

import { JSONSchema7 } from "json-schema"
import { mapValues } from "lodash"

const schemas = (client?: boolean) => {
  // Only defined in the DB schema
  const db = (v) => (!client ? v : undefined)
  // Only defined in the Client schema
  const c = (v) => (client ? v : undefined)
  let s = {
    note: {
      title: "Note",
      description: "Describes a note",
      type: "object",
      properties: {
        value: { type: "string", description: "The note's content" },
        access: db({ $ref: "access" }),
      },
    } as JSONSchema7,
    user: {
      title: "User",
      description: "Describes a user that can use our app",
      type: "object",
      properties: {
        ...db({
          user: {
            title: "Username",
            type: "string",
            format: "user",
          },
          pass: {
            title: "Password",
            description: "Hashed user's password",
            type: "string",
            contentEncoding: "base64",
          },
          salt: {
            type: "string",
            contentEncoding: "base64",
            description:
              "A salt value secures the password against attacks on the DB",
          },
          enabled: {
            description: "Is this user allowed to log-in",
            type: "boolean",
            defaut: true
          },
        }),
        name: { type: "string" },
        photo: {
          type: "string",
          contentEncoding: "base64",
          contentMediaType: "image",
        },
      },
    } as JSONSchema7,
  } as const
  s = mapValues(s, (v, k) => {
    v.$id ??= `db:${k}`
    return v
  })
  return s
}

export default schemas

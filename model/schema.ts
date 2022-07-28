/**
 * These files describe model defitions in our App.
 *
 * Reference: https://json-schema.org/
 */

import { JSONSchema22 } from "@root/types/json-schema"
import { cloneDeep, filter, mapValues } from "lodash"
import { access } from "./access"

const schemas = (name: string) => {
  // Only defined in the DB schema
  const only_default = (v, o: any = false) => (name === "default" ? v : o)
  // Only defined in the Client schema
  const only_client = (v, o: any = false) => (name === "client" ? v : o)
  // const access
  let s = {
    access: only_default(access),
    note: {
      title: "Note",
      description: "Describes a note",
      type: "object",
      properties: {
        value: { type: "string", description: "The note's content" },
        access: only_default({ $ref: "access#" }),
      },
			additionalProperties:false,
    } as JSONSchema22,
    user: {
      title: "User",
      description: "Describes a user that can use our app",
      type: "object",
      properties: {
        ...only_default({
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
            title: "Salt",
            type: "string",
            contentEncoding: "base64",
            description:
              "A salt value secures the password against attacks on the DB",
          },
          enabled: {
            title: "Enabled",
            description: "Is this user allowed to log-in?",
            type: "boolean",
            default: false,
          },
        }),
        name: {
          title: "Name",
          description: "First M Last",
          type: "string",
        },
        photo: {
          title: "Photo",
          description: "User's Photo",
          type: "string",
          contentEncoding: "base64",
          contentMediaType: "image",
        },
      },
    } as JSONSchema22,
  } as const
  s = cloneDeep(s)
  s = mapValues(s, (v, k) => {
		if(typeof v !== 'object')return v;
    v.$id ??= `/schemas/${name}/${k}`
    return v
  })
	// Remove any false keys
	s =  Object.fromEntries(Object.entries (s).filter(([k,v]) => Boolean(v))) as any
  return s
}

export default schemas

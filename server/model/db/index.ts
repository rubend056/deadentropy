/**
 * These files describe model defitions in our DB.
 *
 * Reference: https://json-schema.org/
 */

const many_to_many = () => {}
const one_to_many = () => {}
// const one_to_one = () => {}

const note = {
  title: "Note",
  description: "Describes a note",
  type: "object",
  properties: {
    value: { type: "string", description: "The note's content" },
  },
} as const

const user = {
  title: "User",
  description: "Describes a user that can use our app",
  type: "object",
  properties: {
    user: { type: "string", description: "Username" },
    pass: { type: "string", description: "Hashed user's password" },
    salt: {
      type: "string",
      description: "A salt value secures the pass against attacks on the DB",
    },
    enabled: { type: "boolean" },
    name: { type: "string" },
    photo: { type: "string" },
  },
} as const


const all = { note, user }
const schema = {
  type: "object",
  properties: all,
  definitions: all,
}
export default schema

/**
 * Model note_access
 *
 */
export type NoteAccess = {
  id: string
  id_base: string
  id_user: string | null
  access_level: number | null
}

/**
 * Model profile
 *
 */
export type Profile = {
  id: string
  name: string | null
  photo: Buffer | null
}

/**
 * Model type
 *
 */
export type Type = {
  id: number
  name: string | null
  type_of: string | null
}

/**
 * Model user
 *
 */
export type User = {
  id: string
  user: string
  pass: Buffer | null
  enabled: boolean | null
  profile_id: string | null
  salt: Buffer | null
}

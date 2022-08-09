import db_init, {DBScope} from "@root/db/couchdb"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"
import schema_string from "./schema.gql"

// Construct a schema, using GraphQL schema language
export var schema = buildSchema(schema_string)

// The rootValue provides a resolver function for each API endpoint
export var rootValue = (db:DBScope) => {
  return {
  notes: async () => {
    return [{id:5, value: 'Joking'}]
  },
  note: async ({id}) => {
    return {id, value: 'Just echoing'}
  },
  user: async () => {
    return {name:"RubenD", photo: ""}
  },
  
  noteCreate: async ({value}) => {
		console.log("Creating")
    return {id:"RandomNewID", value}
  },
  noteDelete: async ({id}) => {
		console.log("Deleting")
    return id
  },
  noteModify: async ({note}) => {
		if(!note.id)throw "no id provied"
		console.log("Modifying")
    return note;
  },
  log: async ({action}) => {
		console.log("Logging ", action)
    return true
  }
}}

const plugin = (db:DBScope) =>
  graphqlHTTP({
    schema,
    rootValue: rootValue(db),
    graphiql: true,
  })
export { plugin as graphql }

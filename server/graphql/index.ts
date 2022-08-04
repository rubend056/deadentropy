import db_init, {DBScope} from "@root/db/couch"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"
import schema_string from "./schema.gql"

// Construct a schema, using GraphQL schema language
export var schema = buildSchema(schema_string)

// The rootValue provides a resolver function for each API endpoint
export var rootValue = (db:DBScope) => {
  return {
  notes: async () => {
    
  },
  note: async ({id}) => {
    // db.search('note', )
  },
  user: async () => {
    
  },
  
  noteCreate: async ({value}) => {
    
  },
  noteDelete: async ({id}) => {
    
  },
  noteModify: async ({note}) => {
    
  },
  log: async ({action}) => {
    
  }
}}

const plugin = (db:DBScope) =>
  graphqlHTTP({
    schema,
    rootValue: rootValue(db),
    graphiql: true,
  })
export { plugin as graphql }

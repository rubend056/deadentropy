// var { graphql, buildSchema } = require('graphql');
import { graphql, buildSchema } from 'graphql'
import {graphqlHTTP} from 'express-graphql'
// import graph_schema from './index.graphql'

// Construct a schema, using GraphQL schema language
export var schema = buildSchema(
	`
type Query {
	hello: String
}
`
// graph_schema
);

// The rootValue provides a resolver function for each API endpoint
export var rootValue = {
  hello: () => {
    return 'Hello world!';
  },
};

const plugin = () => graphqlHTTP({
  schema,
  rootValue,
  graphiql: true,
})
export {plugin as graphql}
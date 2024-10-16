const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type User {
  _id: ID!
  email: String!
  password: String
  role: String!
  favorites: [MenuItem!]!
}

type MenuItem {
  _id: ID!
  name: String!
  description: String
}

input UserInput {
  email: String!
  password: String!
  role: String
}

input UserCredentials {
  email: String!
  password: String!
}

input MenuItemInput {
  name: String!
  description: String
}

type RootQuery {
    users: [User!]!
    userFavorites(userId: ID!): [MenuItem!]! 
}

type RootMutation {
    createUser(userInput: UserInput): User
    loginUser(userInput: UserCredentials): User
    addFavorite(userId: ID!, menuItemInput: MenuItemInput): User 
    removeFavorite(userId: ID!, menuItemName: String!): User 
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);

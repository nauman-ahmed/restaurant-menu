const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type Ratings {
  _id: ID!
  name: String!
  rating: Int!
}

type MenuItem {
  _id: ID!
  name: String!
  description: String
}

type User {
  _id: ID!
  email: String!
  password: String
  role: String!
  favorites: [MenuItem!]!
  ratings: [Ratings!]!  # Field for rating
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

input RateMenuItemInput {
  userId: ID!  
  menuItemName: String!  
  rating: Int!  
}

type RootQuery {
    users: [User!]!
    userFavorites(userId: ID!): [MenuItem!]! 
    userRatings(userId: ID!): [Ratings!]! 
}

type RootMutation {
    createUser(userInput: UserInput): User
    loginUser(userInput: UserCredentials): User
    addFavorite(userId: ID!, menuItemInput: MenuItemInput): User 
    removeFavorite(userId: ID!, menuItemName: String!): User 
    rateFavoriteMenuItem(rateMenuItemInput: RateMenuItemInput): User 
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);

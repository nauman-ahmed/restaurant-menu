const authResolver = require('./auth'); 
const favouriteResolver = require("./favourites")

const rootResolver = {
  ...authResolver,
  ...favouriteResolver
};

module.exports = rootResolver;

const authResolver = require('./auth'); 
const favouriteResolver = require("./favourites")
const rateFavoriteMenuItem = require("./ratings")

const rootResolver = {
  ...authResolver,
  ...favouriteResolver,
  ...rateFavoriteMenuItem
};

module.exports = rootResolver;

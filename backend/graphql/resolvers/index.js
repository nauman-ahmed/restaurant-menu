const authResolver = require('./auth'); 
const favouriteResolver = require("./favourites")
const rateFavoriteMenuItem = require("./ratings")
const subscriptionResolver = require("./subscription")

const rootResolver = {
  ...authResolver,
  ...favouriteResolver,
  ...rateFavoriteMenuItem,
  ...subscriptionResolver
};

module.exports = rootResolver;

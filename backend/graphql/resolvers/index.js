const authResolver = require('./auth'); 
const favouriteResolver = require("./favourites")
const rateFavoriteMenuItem = require("./ratings")
const subscriptionResolver = require("./subscription")
const bannerResolver = require("./banner")

const rootResolver = {
  ...authResolver,
  ...favouriteResolver,
  ...rateFavoriteMenuItem,
  ...subscriptionResolver,
  ...bannerResolver
};

module.exports = rootResolver;

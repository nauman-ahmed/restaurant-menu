export const getFoodNames = (favorites) => favorites.map(favorite => favorite.name)

export const getRatingsObj = (ratings) => {
    let arr = {}; 

    ratings.map(rating => {
        arr = {...arr, [rating.name]: rating.rating}
    })
    return arr
}
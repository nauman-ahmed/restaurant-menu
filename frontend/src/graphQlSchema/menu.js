export const getMenuRequestBody = () => {

    return {
        query: `
        query{
            getAllMenus{
              _id,
              day,
              date,
              data{
                meal,
                foods
              }
            }
          }
        `
    }
  }
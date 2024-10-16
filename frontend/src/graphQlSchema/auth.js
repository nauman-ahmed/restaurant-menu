
export const createUserRequestBody = (email, password) => {
    return {
        query: `
        mutation {
            createUser(userInput: {email: "${email}", password: "${password}", role: "Admin"}) {
                _id,
                email
            }
        }
        `
    }
}

export const loginUserRequestBody = (email, password) => {
    return {
        query: `
        mutation {
            loginUser(userInput: {email: "${email}", password: "${password}"}) {
                _id,
                email,
                role
            }
        }
        `
    }
}
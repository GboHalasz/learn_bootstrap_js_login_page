
export const userData = () => {
    const user = {
        name: ""
    }

    const setNameFromSessionStorage = () => {
        user.name = JSON.parse(sessionStorage.getItem("user")) ? JSON.parse(sessionStorage.getItem("user")).name : "";
    }

    return { setUserNameFromSessionStorage: setNameFromSessionStorage, user }
}
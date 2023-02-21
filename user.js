
export const user = {
    name: "",

    setNameFromSessionStorage: function () {
        this.name = JSON.parse(sessionStorage.getItem("user")) ? JSON.parse(sessionStorage.getItem("user")).name : "";
    }
}
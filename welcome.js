// TODO: make a logout button
export const myWelcome = {

    show: function (welcomeText, welcomePlace, userName) {
        if (userName) {
            let textNode = document.createTextNode(`${welcomeText}${userName}`)

            if (welcomePlace.firstChild) {
                welcomePlace.removeChild(welcomePlace.firstChild)
            }

            welcomePlace.appendChild(textNode);
            welcomePlace.classList.remove("d-none");
            welcomePlace.classList.add("d-block");
        }
    }
}
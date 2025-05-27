import { regValidation } from "./modules/myValidation.js";
import { storeData } from "./modules/storeData.js";
import { userData } from "./modules/user.js";
import { myWelcome } from "./modules/welcome.js"
import "./main.css"

document.addEventListener('DOMContentLoaded', function () {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
});

const myRegForm = regValidation();
const { storeInStorage } = storeData(sessionStorage);
const { user } = userData(sessionStorage);

myWelcome.show("Welcome, ", welcomePlace, user.name);

myRegForm.startValidation("blur", () => {
    storeInStorage("user", myRegForm.dataToJson());
    myWelcome.show("Welcome, ", welcomePlace, user.name);
});
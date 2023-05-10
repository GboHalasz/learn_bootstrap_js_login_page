import { regValidation } from "./myValidation.js";
import { storeData } from "./storeData.js";
import { userData } from "./user.js";
import { myWelcome } from "./welcome.js"

const { startVal, validData } = regValidation();
const { storeInStorage } = storeData(sessionStorage);
const { user } = userData(sessionStorage);

myWelcome.show("Welcome, ", welcomePlace, user.name);

startVal("blur", () => {
    storeInStorage("user", validData());     
    myWelcome.show("Welcome, ", welcomePlace, user.name);
});
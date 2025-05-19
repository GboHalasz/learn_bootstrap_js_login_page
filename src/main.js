import { regValidation } from "./modules/myValidation.js";
import { storeData } from "./modules/storeData.js";
import { userData } from "./modules/user.js";
import { myWelcome } from "./modules/welcome.js"

const { startVal, validData } = regValidation();
const { storeInStorage } = storeData(sessionStorage);
const { user } = userData(sessionStorage);

myWelcome.show("Welcome, ", welcomePlace, user.name);

startVal("blur", () => {
    storeInStorage("user", validData());     
    myWelcome.show("Welcome, ", welcomePlace, user.name);
});
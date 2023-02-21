import { regValidation } from "./myValidation.js";
import { storeData } from "./storeData.js";
import { userData } from "./user.js";
import { myWelcome } from "./welcome.js"

const { startVal, validData } = regValidation();
const { storeInSessionStr } = storeData();
const { user, setUserNameFromSessionStorage } = userData();

setUserNameFromSessionStorage()
myWelcome.show("Welcome, ", welcomePlace, user.name);

startVal("blur", () => {
    storeInSessionStr("user", validData());
    setUserNameFromSessionStorage();
    myWelcome.show("Welcome, ", welcomePlace, user.name);
});
import { myRegForm } from "./myValidation.js";
import { user } from "./user.js";
import { myWelcome } from "./welcome.js"

user.setNameFromSessionStorage()
myWelcome.show("Welcome, ", welcomePlace, user.name);

myRegForm.startValidation(() => {
    user.setNameFromSessionStorage();
    myWelcome.show("Welcome, ", welcomePlace, user.name);
});
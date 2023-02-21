import { myRegForm } from "./myValidation.js";
import { user } from "./user.js";
import { myWelcome } from "./welcome.js"

user.setNameFromSessionStorage()
myWelcome.show("Welcome, ", welcomePlace, user.name);

myRegForm.addListenerToFields("focusout");  //(better with "input")

myRegForm.addListenerToRegBtn(() => {
    user.setNameFromSessionStorage();
    myWelcome.show("Welcome, ", welcomePlace, user.name);
});
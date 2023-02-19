/* Login - Registration page validation JS */

//the browser extracts the input element by id!!

class MyFormError extends Error {
    constructor(...params) {
        super(...params);
        this.name = "MyFormError";
    }
}

const myRegForm = {
    inpFields: {
        regUName: {  //this must be equal with the id of input element!!!
            value: "",                          //assigned on focusout                       
            isValid: function (val) {
                return val && (val.length >= 3)  //trim value before checking
            }
        },
        regEmail: {
            value: "",
            isValid: function (val) {
                // return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(val)) //from w3resource
                //regex from masteringjs.io
                return (/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i.test(val))
            }
        },
        regPass1: {
            value: "",
            isValid: function (val) {
                regPass2.value = "";                     //these are for the case when  
                myRegForm.inpFields.regPass2.value = ""  //confirm password was given first
                return val && (val.length >= 6);
            }
        },
        regPass2: {
            value: "",
            isValid: function (val) {
                return (val === regPass1.value)
            }
        }
    },

    enableRegBtn: function () {
        regBtn.classList.remove("disabled");
    },

    disableRegBtn: function () {
        regBtn.classList.add("disabled");
    },

    setValueFromInp: function (inp) {
        this.inpFields[inp.id].value = this.checkField(inp);
        console.log(this.inpFields[inp.id].value)
    },

    checkField: function (inp) {
        try {
            inp.classList.remove("is-invalid")
            const val = inp.value.trim()
            if (!inp.value.trim()) {
                throw new MyFormError("The field is empty! Mandatory field!")
            }
            if (this.inpFields[inp.id].isValid && !this.inpFields[inp.id].isValid(val)) {
                throw new MyFormError("The given value is ivalid!")
            }
            return val;
        } catch (err) {
            if (err.name === "MyFormError") {
                inp.classList.add("is-invalid")
            }
            console.error(`${err.name}: ${err.message}`);
            return "";
        }
    },

    valuesAreReady: function () {
        try {
            for (const key in this.inpFields) {
                if (!this.inpFields[key].value) {
                    return false
                }
            }
            return true
        } catch (err) {
            console.error(`${err.name}: ${err.message}`);
        }

    },

    attachListener: function (ev) {
        try {
            if (this.inpFields.length != 0) {
                for (const field in this.inpFields) {
                    window[field].addEventListener(ev, function () {
                        myRegForm.setValueFromInp(this);
                        myRegForm.valuesAreReady() ? myRegForm.enableRegBtn() : myRegForm.disableRegBtn();
                    })
                }
            }

        } catch (err) {
            console.error(`${err.name}: ${err.message}`);
        }
    }
}

myRegForm.attachListener("focusout");  //(better with "input")



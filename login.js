/* Login - Registration page validation JS */

class MyFormError extends Error {
    constructor(...params) {
        super(...params);
        this.name = "MyFormError";
    }
}

const myRegForm = {
    inpFields: {
        regUName: {  //this must be equal with the id of input element!!!
            elem: document.getElementById("regUName"),
            value: "",                          //assigned on focusout                       
            isValid: function (val) {
                return val && (val.length >= 3)  //trim value before checking
            }
        },
        regEmail: {
            elem: document.getElementById("regEmail"),
            value: "",
            isValid: function (val) {
               return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val))
            }
        },
        regPass1: {
            elem: document.getElementById("regPass1"),
            value: "",
            isValid: function (val) {
               return val && (val.length >= 6)
            }
        },
        regPass2: {
            elem: document.getElementById("regPass2"),
            value: "",
            isValid: function (val) {
                return (val === regPass1.value)
            }
        }
    },

    regBtn: document.getElementById("regBtn"),

    setValue: function (inp) {
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
            console.log(this.inpFields[inp.id].isValid)

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
    }
}

myRegForm.inpFields.regUName.elem.addEventListener("focusout", function () {
    myRegForm.setValue(this);
})

myRegForm.inpFields.regEmail.elem.addEventListener("focusout", function () {
    myRegForm.setValue(this);
})

myRegForm.inpFields.regPass1.elem.addEventListener("focusout", function () {
    myRegForm.setValue(this);
})

myRegForm.inpFields.regPass2.elem.addEventListener("focusout", function () {
    myRegForm.setValue(this);
})



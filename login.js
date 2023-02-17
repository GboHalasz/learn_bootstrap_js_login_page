/* Login - Registration page validation JS */

class MyFormError extends Error {
    constructor(...params) {
        super(...params);
        this.name = "MyFormError";
    }
}

const myRegForm = {
    inpFields: {
        regUName: {
            elem: document.getElementById("regUName"),
            value: "",                          //assigned on focusout                       
            isValid: function (val) {
                return val && (val.length >= 3)  //trim value before checking
            }
        },
        regEmail: {
            elem: document.getElementById("regEmail"),
            value: "",
            condition: (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.value))
        },
        regPass1: {
            elem: document.getElementById("regEmail"),
            value: "",
            condition: this.value && (this.value.length >= 6)
        },
        regPass2: {
            elem: document.getElementById("regEmail"),
            value: "",
            condition: (this.value === regPass1.value)
        }
    },

    regBtn: document.getElementById("regBtn"),

    checkField: function (inp) {
        try {
            inp.classList.remove("is-invalid")
            this.inpFields[inp.id].value = "" // outsource to function 
            const val = inp.value.trim()
            if (!inp.value.trim()) {
                throw new MyFormError("The field is empty! Mandatory field!")
            }
            console.log(this.inpFields[inp.id].isValid)

            if (this.inpFields[inp.id].isValid && !this.inpFields[inp.id].isValid(val)) {
                throw new MyFormError("The given value is ivalid!")
            }
            this.inpFields[inp.id].value = val; // outsource to function
        } catch (err) {
            if (err.name === "MyFormError") {
                inp.classList.add("is-invalid")
                console.error(`${err.name}: ${err.message}`);
                return null;
            }
            console.error(`${err.name}: ${err.message}`);
        }
    }


}

myRegForm.inpFields.regUName.elem.addEventListener("focusout", function () {
    myRegForm.setValue(myRegForm.checkField(this));
})



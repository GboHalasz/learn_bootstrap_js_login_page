/* Login - Registration page validation JS */

const myRegForm = {
    inpFields: {
        regUName: {
            elem: document.getElementById("regUName"),
            value: "",                          //assigned on focusout                       
            condition: this.value && (this.value.length >= 3)  //trim value before checking
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

    checkFields: function (inp) {
        console.log(this.inpFields[inp.id].condition)
        try {            
            if (!inp.value.trim() /* condition */) {
                throw new MyFormError("The given value is ivalid!")
            }
            this.inpFields[inp.id].value = inp.value.trim()
        } catch (err) {
            if (err.name === "MyFormError") {
                inp.classList.add("is-invalid")
            }
            console.error(`${err.name}: ${err.message}`);
        }
    }


}

myRegForm.inpFields.regUName.elem.addEventListener("focusout", function () {
    myRegForm.checkFields(this)
})



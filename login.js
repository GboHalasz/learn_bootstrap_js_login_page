/* Login - Registration page validation JS */

const myRegForm = {
    inputFields: {
        regUname: {
            elem: document.getElementById("regUName"),
            value: "",                          //assigned on focusout                       
            condition: (this.value.length >= 3)  //trim value before checking
        },
        regEmail: {
            elem: document.getElementById("regEmail"),
            value: "",
            condition: (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.value))
        },
        regPass1: {
            elem: document.getElementById("regEmail"),
            value: "",
            condition: (this.value.length >= 6)
        },
        regPass2: {
            elem: document.getElementById("regEmail"),
            value: "",
            condition: (this.value === regPass1.value)
        }
    },

    regBtn: document.getElementById("regBtn"),

    



}




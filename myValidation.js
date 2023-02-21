/* Login - Registration page validation JS */

//the browser extracts the input element by id!!
class MyFormError extends Error {
    constructor(...params) {
        super(...params);
        this.name = "MyFormError";
    }
}

export const myRegForm = {
    inpFieldsById: {
        regUName: {  //this must be equal with the id of input element!!!
            storageName: "name",  //do not add name if you don't want to store the data (pl. for confirmed password)
            value: "",                          //assigned on focusout                       
            isValid: function (val) {
                return val && (val.length >= 3)  //trim value before checking
            }
        },
        regEmail: {
            storageName: "email",
            value: "",
            isValid: function (val) {
                // return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(val)) //from w3resource
                //regex from masteringjs.io
                return (/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i.test(val))
            }
        },
        regPass1: {
            storageName: "password",
            value: "",
            isValid: function (val) {
                regPass2.value = "";                     //these are for the case when  
                myRegForm.inpFieldsById.regPass2.value = ""  //confirm password was given first
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

    sha512: async function (str) {
        return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
            return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
        });
    },

    setValueFromInp: async function (inp) {
        if (inp.type == "password") {
            await this.sha512(this.checkField(inp)).then(x => { this.inpFieldsById[inp.id].value = x });
            return
        }
        this.inpFieldsById[inp.id].value = this.checkField(inp);
    },

    checkField: function (inp) {
        try {
            inp.classList.remove("is-invalid")
            const val = inp.value.trim()
            if (!inp.value.trim()) {
                throw new MyFormError("The field is empty! Mandatory field!")
            }
            if (this.inpFieldsById[inp.id].isValid && !this.inpFieldsById[inp.id].isValid(val)) {
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
            for (const key in this.inpFieldsById) {
                if (!this.inpFieldsById[key].value) {
                    return false
                }
            }
            return true
        } catch (err) {
            console.error(`${err.name}: ${err.message}`);
        }

    },

    resetFields: function () {
        try {
            for (const field in this.inpFieldsById) {
                window[field].value = ""
            }
            this.disableRegBtn()
        } catch (err) {
            console.error(`${err.name}: ${err.message}`);
        }
    },

    dataToJson: function () {
        let user = {};
        try {
            for (const field in this.inpFieldsById) {
                if (this.inpFieldsById[field].storageName) {
                    user = { ...user, [this.inpFieldsById[field].storageName]: this.inpFieldsById[field].value }
                }
            }
            return JSON.stringify(user);
        } catch (err) {
            console.error(`${err.name}: ${err.message}`);
        }
    },

    storageData: function () {
        console.log(this.dataToJson());
        sessionStorage.setItem("user", this.dataToJson());
    },

    addListenerToFields: function (ev) {
        try {
            if (this.inpFieldsById.length != 0) {
                for (const field in this.inpFieldsById) {
                    window[field].addEventListener(ev, async function () {
                        await myRegForm.setValueFromInp(this);
                        myRegForm.valuesAreReady() ? myRegForm.enableRegBtn() : myRegForm.disableRegBtn();
                    })
                }
            }

        } catch (err) {
            console.error(`${err.name}: ${err.message}`);
        }
    },

    addListenerToRegBtn: function (cfn) {
        regBtn.addEventListener("click", function () {
            myRegForm.storageData();
            myRegForm.resetFields();
            cfn()
        })
        return cfn;
    },

    startValidation: function (cfn) {
        this.addListenerToFields();
        this.addListenerToRegBtn(cfn);
    }
}

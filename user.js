
export const userData = (storageArea) => {
    const user = {
        
        setUserName: function (){
            this.name = JSON.parse(storageArea.getItem("user")) ? JSON.parse(storageArea.getItem("user")).name : "";
        }
    };

    user.setUserName();
        
    window.addEventListener("storeData", function () {
        user.setUserName();        
    });
    
    return { user };
}
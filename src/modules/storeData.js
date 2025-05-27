export const storeData = (storageArea) => {
const event = new Event("storeData")

    const storeInStorage = (key, jSonData) => {        
        storageArea.setItem(key, jSonData);
        window.dispatchEvent(event);
    }

    const removeFromStorage = (key) => {
        storageArea.removeItem(key);
        window.dispatchEvent(event);
    }

    return {storeInStorage, removeFromStorage}
}

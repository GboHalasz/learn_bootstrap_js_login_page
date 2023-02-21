export const storeData = () => {

    const storeInSessionStorage = (key, jSonData) => {        
        sessionStorage.setItem(key, jSonData);
    }

    return {storeInSessionStr: storeInSessionStorage}
}

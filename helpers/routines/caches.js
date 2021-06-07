const fs = require('fs');
const Keyv = require('keyv');
const path = require("path");
const categoriesCache = new Keyv({ namespace: "categoriesCache" });
const commandTimeoutCache = new Keyv({namespace: "ctCache"});


//MAIN FUNCTIONS -------------------------------------------------------------------------------------------------------


//create new caches from db/data files
async function setupCaches() {
    try{
        const catListJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/pa_categories.json")));
        for (let cat in catListJSON) {
            await categoriesCache.set(cat, catListJSON[cat]);
        }
    } catch(e) {
        console.log(`Creating categoriesCache has failed with error \n: ${e}`);
    }
    console.log("SETUP - caches")
}


module.exports = {
    setupCaches,
    categoriesCache,
    commandTimeoutCache

}
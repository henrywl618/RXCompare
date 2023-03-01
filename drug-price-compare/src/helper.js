
/** Imports all svg files
 * 
 */

function importAll(r) {
    return r.keys().map( key => r(key))
}

const backendURL = "https://rxcompare-be-production.up.railway.app/drugs";

export { importAll, backendURL };
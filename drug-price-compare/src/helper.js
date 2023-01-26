
/** Imports all svg files
 * 
 */

function importAll(r) {
    return r.keys().map( key => r(key))
}

export { importAll };
const db = require("./db");
const axios = require("axios")
const {NotFoundError, BadRequestError} = require("./expressErrors");
const DrugScrapeWebAPIURL = "http://localhost:5000/drugs";


/**Related functions for drugs */

class Drugs {

    /**Add a drugname to db 
     * 
     * Will add to the db if it does not exist.
     * 
     * Returns the added/existing drugname
    */
    static async addDrugName(drugName){

        // Add code for duplication check
        // Check for duplicate entry, if it exists, return it
        const duplicateCheck = await db.query(
            `SELECT name
                FROM drugnames
                WHERE name=UPPER($1)`, [drugName]
        )
        if(duplicateCheck.rows[0]) return duplicateCheck.rows[0];

        const result =  await db.query(
            `INSERT INTO drugnames (name)
                VALUES ($1)
                RETURNING name`,
            [drugName]
        )

        const name = result.rows[0];
        return name
    }

    /**Add a drugform to db 
     * 
     * Will add to the db if it does not exist.
     * 
     * Returns the added/existing drugform
    */
    static async addDrugForm(drugForm){

        // Check for duplicate entry, if it exists, return it
        const duplicateCheck = await db.query(
            `SELECT form
             FROM drugforms
             WHERE form=$1`, [drugForm]
        )
        if(duplicateCheck.rows[0]) return duplicateCheck.rows[0];
        
        //Add to the table if it doesnt exist
        const result =  await db.query(
            `INSERT INTO drugforms (form)
                VALUES ($1)
                RETURNING form`,
            [drugForm]
        )

        const form = result.rows[0];
        return form
    }

    /**Add a drug (drugname+drugform) to db 
     * 
     * Data should be {drugname, drugform}
     * 
     * Returns drug : {drugname, drugform}
    */
    static async addDrug({name, form}) {

        // Add code for duplication check

        const result = await db.query(
            `INSERT INTO drugs (name, form)
                VALUES ($1, $2)
                RETURNING name, form`,
            [name, form]
        )

        const drug = result.rows[0];
        return drug
    }

    /** Add a drug dose to the db
     * 
     * Will add to db if it does not exist
     * 
     * Returns added/existing drug dose
     */
    static async addDose (dose) {

        // Check for duplicate entry, if it exists, return it
        const duplicateCheck = await db.query(
            `SELECT dose
                FROM doses
                WHERE dose=$1`, [dose]
        )
        if(duplicateCheck.rows[0]) return duplicateCheck.rows[0];

        const result = await db.query(
            `INSERT INTO doses (dose)
                VALUES ($1)
                RETURNING dose`,
            [dose]
        )
        const drugDose = result.rows[0];
        return drugDose
    }

    /** Add a drug qty to the db
     * 
     * Will add to db if it does not exist
     * 
     * Returns added/existing drug qty
     */
    static async addQty (qty) {

        // Check for duplicate entry, if it exists, return it
        const duplicateCheck = await db.query(
            `SELECT qty
                FROM quantities
                WHERE qty=$1`, [qty]
        )
        if(duplicateCheck.rows[0]) return duplicateCheck.rows[0];

        const result = await db.query(
            `INSERT INTO quantities (qty)
                VALUES ($1)
                RETURNING qty`,
            [qty]
        )
        const drugQty = result.rows[0];
        return drugQty
    }

    /** Add a drug(name, form)/dose relationship to the db
     * 
     */
    static async addDrugDose ({name, form}, dose) {

        // Check for duplicate entry, if it exists, return it
        const duplicateCheck = await db.query(
            `SELECT dose
                FROM drug_dose
                WHERE name=UPPER($1) AND form=$2 AND dose=$3`, [name, form, dose]
        )
        if(duplicateCheck.rows[0]) return duplicateCheck.rows[0];

        const result = await db.query(
            `INSERT INTO drug_dose (name, form, dose)
                VALUES ($1, $2, $3)
                RETURNING name, form, dose`,
                [name, form, dose]
        )
        const drugdose = result.rows[0];
        return drugdose
    }

    /** Add a drug(name, form)/qty relationship to the db
     * 
     */

    static async addDrugQty ({name, form}, qty) {

        // Check for duplicate entry, if it exists, return it
        const duplicateCheck = await db.query(
            `SELECT qty
                FROM drug_qty
                WHERE name=UPPER($1) AND form=$2 AND qty=$3`, [name, form, qty]
        )
        if(duplicateCheck.rows[0]) return duplicateCheck.rows[0];

        const result = await db.query(
            `INSERT INTO drug_qty (name, form, qty)
                VALUES ($1, $2, $3)
                RETURNING name, form, qty`,
                [name, form, qty]
        )
        const drugqty = result.rows[0];
        return drugqty
    }

    static async getDrugName (searchTerm) {
        try {
            const results = await db.query(
                `SELECT name from drugnames
                    WHERE name LIKE UPPER('${searchTerm}'||'%')`
            )
            if(results.rows.length===0) return {message: `No result for ${searchTerm}`, status:404}
            const names = results.rows.map(row => row.name)
            return {names}
        } catch(err) {
            throw new BadRequestError(err)
        }
    }

    static async getDrugForms (name) {
        try {
            // Get drug forms ordered by insertion order
            const results = await db.query(
                `SELECT form, ctid as id FROM drugs
                    WHERE name=UPPER($1) ORDER BY id ASC`,
                    [name]
            )
            //If data does not exist in DB, attempt to scrape data from the web and add to db and return added data
            if(results.rows.length === 0) {
                return await Drugs.scrapeDrugForms(name);
            }
            const forms = results.rows.map(row => row.form);
            return forms
        } catch (err) {
            throw new BadRequestError(err);
        }

    }

    static async getDrugDosesQtys ({name, form}) {
        try {
            const doseResults = await db.query(
                `SELECT dose FROM drug_dose
                    WHERE name=UPPER($1) AND form=$2
                    ORDER BY LENGTH(dose) ASC`,
                    [name, form]
            )
            const qtyResults = await db.query(
                `SELECT qty FROM drug_qty
                    WHERE name=UPPER($1) and form=$2
                    ORDER BY LENGTH(qty) ASC`,
                    [name, form]
            )
            console.log(qtyResults.rows.length)
            console.log(doseResults.rows.length)
            //If data does not exist in DB, attempt to scrape data from the web and add to db and return added data
            if(qtyResults.rows.length === 0 || doseResults.rows.length === 0) {
                console.log('inside')
                return await Drugs.scrapeDrugQtyDoses(name, form);
            }
            const doses = doseResults.rows.map(row => row.dose);
            const qtys = qtyResults.rows.map(row => row.qty);
            console.log(doses)
            console.log(qtys)
            return { doses, qtys }
        } catch(err) {
            throw new BadRequestError(err);
        }
    }

    static async getDrugQtys ({name, form}) {
        const results = await db.query(
            `SELECT qty FROM drug_qty
                WHERE name=UPPER($1) AND form=$2`,
                [name, form]
        )
        const qtys = results.rows.map(row => row.qty);
        return qtys
    }

    /** Gets list of drug names matching the searchTerm from webscraper
     * 
     */
    static async scrapeDrugName (searchTerm) {
        const response = await axios.get(`${DrugScrapeWebAPIURL}/names/${searchTerm}`);
        //Handles error responses from the scraper api
        if(response.data.status === 404) return response.data;
        const names = response.data.names;
        return {names}
    }

    /** Gets list of drug forms for a given drug name from webscraper
     * 
     *  Adds drug forms returned from the webscraper to the DB
     */
    static async scrapeDrugForms (name) {
        try{
            const response = await axios.post(`${DrugScrapeWebAPIURL}/forms`, { name });
            //Handles error responses from the scraper api
            if(response.data.message) throw new BadRequestError(response.data.message);
            //Adds drug name and forms to DB if it doesnt exist
            const forms = response.data.forms;
            await Drugs.addDrugName(name);
            for(const form of forms){
                await Drugs.addDrugForm(form);
                await Drugs.addDrug({name, form});
            }
            return forms
        } catch (err) {
            throw new BadRequestError(err.message)
        }
    }

    static async scrapeDrugQtyDoses ( name, form ) {
        try {
            const response = await axios.post(`${DrugScrapeWebAPIURL}/doseqty`, { name, form })
            //Handles error responses from the scraper api
            if(response.data.message) throw new BadRequestError(response.data.message);
            //Adds qtys and doses to the db
            const qtys = response.data.qty;
            const doses = response.data.dosage;
            for(const qty of qtys){
                await Drugs.addQty(qty);
                await Drugs.addDrugQty( { name, form }, qty)
            }
            for(const dose of doses){
                await Drugs.addDose(dose);
                await Drugs.addDrugDose({ name, form }, dose)
            }
            return {qtys, doses}
        } catch(err) {
            throw new BadRequestError(err.message)
        }
    }

    static async scrapeDrugPrices ( {name, form, zip, dose, qty}) {
        try {
            const response = await axios.post(`${DrugScrapeWebAPIURL}/prices`, { name, form, zip, dose, qty })
            if(response.data.message) throw new BadRequestError(response.data.message);
            const sortedData = Drugs.organizePrices(response.data)
            return sortedData
        } catch(err) {
            throw new BadRequestError(err.message)
        }
    }

    /** Sorts the scraped drug price data by prices, ascending and returns the lowest 10 prices for each discount card */
    static async organizePrices( { WellRx, DiscountDrugNetwork } ){
        WellRx.sort( (a, b) => {
            const priceA = Number(a.price.slice(1));
            const priceB = Number(b.price.slice(1));
            return priceA - priceB
        });
        DiscountDrugNetwork.sort( (a, b) => {
            const priceA = Number(a.price.slice(1));
            const priceB = Number(b.price.slice(1));
            return priceA - priceB
        });

        return { WellRx: WellRx.slice(0,10), DiscountDrugNetwork: DiscountDrugNetwork.slice(0,10)}
    };
}

module.exports = Drugs;
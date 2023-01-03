const express = require("express");
const Drugs = require("../drugs");
const router = new express.Router();
const axios = require("axios");
const {NotFoundError, BadRequestError} = require("../expressErrors")
const DrugScrapeWebAPIURL = "http://localhost:5000/drugs";

/**GET / name => names:[]
 * 
 * Searches for matching names and returns an array of names
 */
router.get("/names/:name", async (req, res, next) => {
    try {
        const name = req.params.name;
        const names = await axios.get(`${DrugScrapeWebAPIURL}/names/${name}`);
        return res.json(names.data)
    } catch (err) {
        return next(err)
    }
})

/** POST { name, form } => { forms:[] }
 * 
 * Attempt to find information in DB. If not present in DB, an attempt will be made to scrape the data and add it to the DB
*/
router.post("/forms", async (req, res, next) => {
    try {
        const { name } = req.body;
        console.log(name)
        const forms = await Drugs.getDrugForms(name);
        if (forms.length === 0) {
            const response = await axios.post(`${DrugScrapeWebAPIURL}/forms`, { name });
            if (response.data.message) throw new BadRequestError(response.data.message);
            await Drugs.addDrugName(name);
            const forms = response.data.forms;
            for (const form of forms){
                await Drugs.addDrugForm(form);
                await Drugs.addDrug({name, form});
            }
            return res.json({forms})
        }
        return res.json({forms})
    } catch (err) {
        next(err)
    }
})

/** POST
 * 
 * 
 */
router.post("/doseqty", async (req, res, next) => {
    try {

    } catch (err) {
        
    }
})


/**
 * POST
 */
router.post("/price", async (req, res, next) => {
    try {

    } catch (err) {
        
    }
})

module.exports = router;
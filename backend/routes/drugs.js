const express = require("express");
const Drugs = require("../drugs");
const router = new express.Router();
const axios = require("axios");
const {NotFoundError, BadRequestError} = require("../expressErrors")

/**GET / name => names:[]
 * 
 * Searches for matching names and returns an array of names
 */
router.get("/names/:name", async (req, res, next) => {
    try {
        const name = req.params.name;
        const names = await Drugs.scrapeDrugName(name);
        return res.json({names})
    } catch (err) {
        return next(err)
    }
})

/** POST { name, form } => { forms:[] }
 * 
 * Attempt to find information in DB. If not present in DB, an attempt will be made to scrape the data and add it to the DB
 * 
*/
router.post("/forms", async (req, res, next) => {
    try {
        const { name } = req.body;
        const forms = await Drugs.getDrugForms(name);
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
        const { name, form } = req.body;
        const { doses, qtys } = await Drugs.getDrugDosesQtys({ name, form });
        return res.json({doses, qtys})
    } catch (err) {
        next (err)
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
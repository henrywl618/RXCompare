from flask import Flask, jsonify, request
from scraper import DDNSearch, WellRxSearch
from concurrent.futures import ThreadPoolExecutor, as_completed
from concurrent.futures._base import TimeoutError
from selenium.common import NoSuchElementException, TimeoutException
from error import FlaskError
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
DDNSearch = DDNSearch()
WellRxSearch = WellRxSearch()

@app.errorhandler(NoSuchElementException)
def drug_not_found(error):
    return {"message":'Drug data cannot be found with given information', "status":404}

@app.errorhandler(TimeoutException)
def timeout(error):
    return {"message":'Search process timed out', "status":500}

@app.errorhandler(TimeoutError)
def timeout(error):
    return {"message":'Search process timed out (30s)', "status":500}

@app.errorhandler(FlaskError)
def handle_error(error):
    return {"message": error.message, "status": error.status_code}

@app.route("/drugs/names/<search_term>")
def get_drug_names(search_term):
    results = DDNSearch.get_drugnames(search_term)
    names = {"names":results}
    return jsonify(names)

@app.route("/drugs/forms", methods=['POST'])
def get_drug_forms():
    drug_name = request.json.get("name")
    zip_code = request.json.get("zip")
    results = DDNSearch.get_drugforms(drug_name)
    forms = {"forms":results}
    return jsonify(forms)

@app.route("/drugs/doseqty", methods=['POST'])
def get_doseandqty():
    drug_name = request.json.get("name")
    zip_code = request.json.get("zip")
    form = request.json.get("form")
    results = DDNSearch.get_doseandqty(drug_name, zip_code, form)
    return jsonify(results)

@app.route("/drugs/prices", methods=['POST'])
async def get_prices():
        drug_name = request.json.get("name")
        zip_code = request.json.get("zip")
        form = request.json.get("form")
        dose = request.json.get("dosage")
        qty = request.json.get("qty")
        output = {}
        with ThreadPoolExecutor() as executor:
            future1 = executor.submit( DDNSearch.get_prices, drug_name, zip_code, form, dose, qty )
            future2 = executor.submit( WellRxSearch.get_prices, drug_name, zip_code, form, dose, qty )
            for future in as_completed([future1, future2],timeout=30):
                output = {**output, **future.result()}
        # results = DDNSearch.get_prices(drug_name, zip_code, form, dose, qty)
        # results2 = WellRxSearch.get_prices(drug_name, zip_code, form, dose, qty)
        # results = await asyncio.gather( DDNSearch.get_prices(drug_name, zip_code, form, dose, qty), WellRxSearch.get_prices(drug_name, zip_code, form, dose, qty) )
        # prices = {"DiscountDrugNetwork":await results, "WellRXSearch": await results2}
        # prices = {"WellRXSearch": results}
        return jsonify(output)

# @app.route("/drugs/prices")
# async def get_prices():
#         drug_name = request.json.get("name")
#         zip_code = request.json.get("zip")
#         form = request.json.get("form")
#         dose = request.json.get("dosage")
#         qty = request.json.get("qty")
#         results = DDNSearch.get_prices(drug_name, zip_code, form, dose, qty)
#         results2 = WellRxSearch.get_prices(drug_name, zip_code, form, dose, qty)
#         # results = await asyncio.gather( DDNSearch.get_prices(drug_name, zip_code, form, dose, qty), WellRxSearch.get_prices(drug_name, zip_code, form, dose, qty) )
#         prices = {"DiscountDrugNetwork": results, "WellRXSearch": results2}
#         # prices = {"WellRXSearch": results}
#         return jsonify(prices)
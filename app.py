from flask import Flask, jsonify, request
from scraper import DDNSearch, WellRxSearch
from concurrent.futures import ThreadPoolExecutor, as_completed
from concurrent.futures._base import TimeoutError
from selenium.common import NoSuchElementException, TimeoutException
from error import FlaskError
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.errorhandler(NoSuchElementException)
def drug_not_found(error):
    print(error)
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
    DDNSearch1 = DDNSearch()
    results = DDNSearch1.get_drugnames(search_term)
    names = {"names":results}
    DDNSearch1.close()
    return jsonify(names)

@app.route("/drugs/forms", methods=['POST'])
def get_drug_forms():
    DDNSearch1 = DDNSearch()
    drug_name = request.json.get("name")
    results = DDNSearch1.get_drugforms(drug_name)
    forms = {"forms":results}
    DDNSearch1.close()
    return jsonify(forms)

@app.route("/drugs/doseqty", methods=['POST'])
def get_doseandqty():
    DDNSearch1 = DDNSearch()
    drug_name = request.json.get("name")
    form = request.json.get("form")
    results = DDNSearch1.get_doseandqty(drug_name, form)
    DDNSearch1.close()
    return jsonify(results)

@app.route("/drugs/prices", methods=['POST'])
async def get_prices():
        drug_name = request.json.get("name")
        zip_code = request.json.get("zip")
        form = request.json.get("form")
        dose = request.json.get("dose")
        qty = request.json.get("qty")
        output = {}
        with ThreadPoolExecutor() as executor:
            DDNSearch1 = DDNSearch()
            WellRxSearch1 = WellRxSearch()
            try:
                future1 = executor.submit( DDNSearch1.get_prices, drug_name, zip_code, form, dose, qty )
                future2 = executor.submit( WellRxSearch1.get_prices, drug_name, zip_code, form, dose, qty )
                for future in as_completed([future1, future2],timeout=30):
                    output = {**output, **future.result()}
                DDNSearch1.close()
                WellRxSearch1.close()
            except Exception as e:
                DDNSearch1.close()
                WellRxSearch1.close()
                raise e

        return jsonify(output)

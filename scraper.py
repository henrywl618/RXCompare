from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import ElementNotInteractableException, TimeoutException
from error import FlaskError
import re
import urllib.parse
import csv
import math
alphabets = list('abcdefghijklmnopqrstuvwxyz')

class DDNSearch:

    def __init__(self):
        self.base_url = "https://www.discountdrugnetwork.com"
        self.service = Service(executable_path="/usr/lib/chromium-browser/chromedriver")
        self.options = webdriver.ChromeOptions()
        self.options.add_argument('--ignore-certificate-errors')
        self.options.add_argument('--incognito')
        self.options.add_argument('--headless')
        self.driver = webdriver.Chrome(service=self.service, options=self.options)
        self.driver.set_window_position(0, 0)
        self.driver.set_window_size(1024, 768)
        self.actions = ActionChains(self.driver)
    
    def close(self):
        self.driver.quit()

    def get_drugnames(self, input):
        self.driver.get(self.base_url)
        drugname_input = WebDriverWait(self.driver, timeout=5).until(lambda d: d.find_element(by=By.CSS_SELECTOR, value='.c-search-input__drug').find_element(By.TAG_NAME, "input"))
        drugname_input.send_keys(input)
        try:      
            drugname_results = WebDriverWait(self.driver, timeout=5).until(lambda d: d.find_elements(by=By.CLASS_NAME, value='c-search-input__drugname'))
            results = [drug.text for drug in drugname_results]
            return results
        except TimeoutException:
            raise FlaskError(message = f"No results for {input}", status_code=404)


    def get_drugforms(self, drugname):
        updated_url = f'{self.base_url}/get-discount?drugName={drugname}&zip=11106'
        self.driver.get(updated_url)
        page = WebDriverWait(self.driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'c-results__item')))
        drugform_filter = self.driver.find_element(By.XPATH, '//div[text()="FORM"]//parent::div').find_element(By.XPATH, '//span[@class="ant-select-selection-item"]')
        # drugform_filter = driver.find_element(By.XPATH, '//div[@class="g-select " and .//div[text()="FORM"]]')
        drugform_filter.click()
        formList = self.driver.find_element(By.CLASS_NAME, 'rc-virtual-list-holder-inner')
        items = formList.find_elements(By.CLASS_NAME, 'ant-select-item')
        forms = [item.get_attribute("title") for item in items]
        return forms

    def get_doseandqty(self, drugname, form):
        updated_url = f'{self.base_url}/get-discount?drugName={drugname}&zip=11106'
        self.driver.get(updated_url)
        page = WebDriverWait(self.driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'c-results__item')))
        filters = self.driver.find_elements(By.CLASS_NAME, 'ant-select-selection-item')
        filters[0].click()
        form_selection = self.driver.find_element(By.XPATH , f'//div[@class="ant-select-item-option-content" and text()="{form}"]')
        WebDriverWait(self.driver, timeout=5).until(EC.visibility_of(form_selection))
        form_selection.click()
        page = WebDriverWait(self.driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'c-results__item')))
        for menu in filters:
            menu.click()
        lists = self.driver.find_elements(By.CLASS_NAME, 'rc-virtual-list-holder-inner')
        entries = []
        for i in range(1,3):
            items = lists[i].find_elements(By.CLASS_NAME, 'ant-select-item')
            entries.append([item.get_attribute("title") for item in items])
        output = {'dosage':entries[0], 'qty':entries[1]}
        return output

    def get_prices(self, drugname, zip, form, dose, qty):
        #Load the page
        updated_url = f'{self.base_url}/get-discount?drugName={drugname}&zip={zip}'
        print(updated_url)
        self.driver.get(updated_url)
        #Wait for the page to load
        page = WebDriverWait(self.driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'c-results__item')))
        #Find the drug FORM selector and click
        filters = self.driver.find_elements(By.CLASS_NAME, 'ant-select-selection-item')
        filters[0].click()
        #Select the drug form from the dropdown list and wait for it to load
        WebDriverWait(self.driver, timeout=10).until(EC.element_to_be_clickable((By.XPATH , f'//div[@class="ant-select-item-option-content" and text()="{form}"]')))
        form_selection = self.driver.find_element(By.XPATH , f'//div[@class="ant-select-item-option-content" and text()="{form}"]')
        form_selection.click()
        page = WebDriverWait(self.driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'c-results__item')))
        #Click on each dropdown menu to update the dropdown list
        for menu in filters:
            menu.click()
            menu.click()
        lists = self.driver.find_elements(By.CLASS_NAME, 'rc-virtual-list-holder-inner')
        #Click on the drug dose selector and select the provided dose
        filters[1].click()
        dose_selection = lists[1].find_element(By.XPATH , f'.//div[@class="ant-select-item-option-content" and text()="{dose}"]')
        WebDriverWait(self.driver, timeout=10).until(EC.visibility_of(dose_selection))
        dose_selection.click()
        WebDriverWait(self.driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'c-results__item')))
        #Click on the qty select and select the provided qty
        filters[2].click()
        qty_selection = lists[2].find_element(By.XPATH , f'.//div[@class="ant-select-item-option-content" and text()="{qty}"]')
        WebDriverWait(self.driver, timeout=10).until(EC.visibility_of(qty_selection))
        self.driver.save_screenshot("ddnpage.png")
        qty_selection.click()       
        #Find the drug price results once they are loaded
        results = WebDriverWait(self.driver, timeout=10).until(lambda d: d.find_elements(by=By.CSS_SELECTOR, value='.c-results__item'))
        output = []
        for result in results:
            pharmacy_name_el = result.find_element(By.XPATH, './/div[@class="c-results__pharmacyname"]')
            price_el = result.find_elements(By.XPATH, './/div[@class="c-results__price"]//p')[0]
            address = result.find_element(By.XPATH, './/div[contains(normalize-space(@class),"c-results__locations")]').get_attribute("innerText")
            output.append({"name":pharmacy_name_el.text, "price":price_el.text, "address":address})
        return {"DiscountDrugNetwork": output}

class WellRxSearch:

    def __init__(self):
        self.base_url = "https://www.wellrx.com/prescriptions"
        self.service = Service(executable_path="/usr/lib/chromium-browser/chromedriver")
        self.options = webdriver.ChromeOptions()
        self.options.add_argument('--ignore-certificate-errors')
        self.options.add_argument('--incognito')
        self.options.add_argument('--headless')
        self.driver = webdriver.Chrome(service=self.service, options=self.options)
        self.driver.set_window_position(0, 0)
        self.driver.set_window_size(1024, 768)
        self.actions = ActionChains(self.driver)
        
    def close(self):
        self.driver.quit()

    def get_drugnames(self, input):
        self.driver.get(self.base_url)
        drugname_input = WebDriverWait(self.driver, timeout=3).until(lambda d: d.find_element(by=By.XPATH, value='//input[@id="drugSearchInput"]'))
        drugname_input.send_keys(input)
        drugname_results = WebDriverWait(self.driver, timeout=3).until(lambda d: d.find_elements(by=By.CLASS_NAME, value='ui-menu-item-wrapper'))
            
        return [drug.text for drug in drugname_results]


    def get_drugforms(self, drugname, zip):
        updated_url = f'{self.base_url}/prescriptions/{drugname}/{zip}'
        self.driver.get(updated_url)
        page = WebDriverWait(self.driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'filter-group-menu')))
        forms_list = self.driver.find_element(by=By.XPATH, value='//ul[@id="form"]').find_elements(by=By.TAG_NAME, value='li')
        
        # need to use get_attribute to pull the innerText as ELEMENT.text attribute was returning an empty string
        forms = [ form.get_attribute("innerText") for form in forms_list] 
        return forms    

    def get_doseandqty(self, drugname, zip, form):
        updated_url = f'{self.base_url}/prescriptions/{drugname}/{zip}'
        self.driver.get(updated_url)
        page = WebDriverWait(self.driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'filter-group-menu')))
        #Find the drug form selection filter and click on it and select the form provided in the argument
        forms_selection = self.driver.find_element(By.XPATH, '//button[@for="form"]')

        #This webpage scrolls down and hides the filter options under the navbar after the page loads. We need to scroll to the top of the page so we can click the drug form filter, and then click on the desired drug form. Using send keys(Ctrl+Home) or other scrolling methods were too slow and forms_selection.click() was trying to click before filter was visible
        WebDriverWait(self.driver, timeout=5).until(EC.visibility_of(forms_selection))
        drug_image = self.driver.find_element(By.CLASS_NAME, "drug-image")
        # self.driver.execute_script("arguments[0].scrollIntoView();", drug_image)
        self.actions.scroll_to_element(drug_image)
        self.actions.click(forms_selection)
        self.actions.perform()
        form_selection = self.driver.find_element(By.XPATH , f'//ul[@id="form"]/li[text()="{form}"]')
        WebDriverWait(self.driver, timeout=5).until(EC.element_to_be_clickable(form_selection))
        form_selection.click()

        #Wait for the page to load the new doses and qty of the drug form we clicked on. Tracked by waiting until a previous element goes stale, and waiting until we find the newly loaded element
        WebDriverWait(self.driver, timeout=5).until(EC.staleness_of(form_selection))
        WebDriverWait(self.driver, timeout=5).until(EC.presence_of_element_located((By.XPATH, '//button[@for="form"]')))

        #Find all the dosage and quantity li elements and scrape the innerText and return the results
        dosage_list = self.driver.find_elements(By.XPATH, "//ul[@id='dosage']/li")
        qty_list = self.driver.find_elements(By.XPATH, "//ul[@id='quantity']/li")
        dosages = [li.get_attribute("innerText").strip() for li in dosage_list]
        qtys = [li.get_attribute("innerText").strip() for li in qty_list if li.get_attribute("innerText").strip() != "Custom Qty"]
        output = {"dosages": dosages, "quantities": qtys}
        return output

    def get_prices(self, drugname, zip, form, dose, qty):
        updated_url = f'{self.base_url}/prescriptions/{drugname}/{zip}/?freshSearch=true'
        print(updated_url)
        self.driver.get(updated_url)
        page = WebDriverWait(self.driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'filter-group-menu')))
        #Skip if there is only one form
        form_list = self.driver.find_elements(By.XPATH, f'//ul[@id="form"]/li')
        if len(form_list) > 1:
            #Find the drug form selection filter and click on it and select the form provided in the argument
            forms_selection = self.driver.find_element(By.XPATH, '//button[@for="form"]')
            #This webpage scrolls down and hides the filter options under the navbar after the page loads. We need to scroll to the top of the page so we can click the drug form filter, and then click on the desired drug form. Using send keys(Ctrl+Home) or other scrolling methods were too slow and forms_selection.click() was trying to click before filter was visible
            WebDriverWait(self.driver, timeout=10).until(EC.visibility_of(forms_selection))
            drug_image = self.driver.find_element(By.CLASS_NAME, "drug-image")
            self.driver.execute_script("arguments[0].scrollIntoView();", drug_image)
            forms_selection.click()
            form_selection = self.driver.find_element(By.XPATH , f'//ul[@id="form"]/li[text()="{form}"]')
            WebDriverWait(self.driver, timeout=10).until(EC.element_to_be_clickable(form_selection))
            form_selection.click()
            #Wait for the page to load the new doses and qty of the drug form we clicked on. Tracked by waiting until a previous element goes stale, and waiting until we find the newly loaded element
            WebDriverWait(self.driver, timeout=10).until(EC.staleness_of(form_selection))
            WebDriverWait(self.driver, timeout=10).until(EC.presence_of_element_located((By.XPATH, '//button[@for="dosages"]')))
        #Select the dose
        dosage_filter = self.driver.find_element(By.XPATH, '//button[@for="dosages"]')
        drug_image = self.driver.find_element(By.CLASS_NAME, "drug-image")
        ## Scroll up so we can click on the filter
        self.actions.scroll_to_element(drug_image)
        self.actions.click(dosage_filter)
        self.actions.perform()
        # self.driver.execute_script("arguments[0].scrollIntoView();", drug_image)
        # dosage_filter.click()
        dosage_selection = self.driver.find_element(By.XPATH , f'//ul[@id="dosage"]/li[text()="{dose}"]')
        # If there is only one dose, it will be non-interactable, we can just pass and move to selecting the qty
        try:
            dosage_selection.click()
            # Wait for new page reload
            WebDriverWait(self.driver, timeout=10).until(EC.staleness_of(dosage_filter))
            WebDriverWait(self.driver, timeout=10).until(EC.presence_of_element_located((By.XPATH, '//button[@for="dosages"]')))
        except ElementNotInteractableException:
            pass

        #Select the qty
        qty_filter = self.driver.find_element(By.XPATH, '//button[@for="quantity"]')
        drug_image = self.driver.find_element(By.CLASS_NAME, "drug-image")
        ## Scroll up so we can click on the filter
        self.driver.execute_script("arguments[0].scrollIntoView();", drug_image)
        qty_filter.click()
        self.driver.save_screenshot("wellrx.png")
        qty_selection = self.driver.find_element(By.XPATH , f'.//ul[@id="quantity"]/li[contains(text(),"{qty} ")]')
        qty_selection.click()
        # Wait for new page reload
        WebDriverWait(self.driver, timeout=10).until(EC.staleness_of(qty_filter))
        WebDriverWait(self.driver, timeout=10).until(EC.presence_of_element_located((By.XPATH, '//button[@for="dosages"]')))
        
        #Scrape and return pharmacy/price data
        pharmacy_elements = self.driver.find_elements(By.CLASS_NAME, "pharmCard")
        results = []
        for element in pharmacy_elements:
            name = element.find_element(By.XPATH, ".//*[@id='multipharm-loc-key' or @id='singlepharm-name']").get_attribute("innerText")
            # # address = element.find_element(By.ID, "singlepharm-address").get_attribute("innerText")
            price = element.find_element(By.CLASS_NAME, "price").get_attribute("innerText")
            try:
                address_el = element.find_element(By.XPATH, ".//span[@id='singlepharm-address']")
                address = address_el.get_attribute("innerText")
                #Remove line breaks from the string
                address = re.sub('\n', ' ', address)
            except:
                address = ""
            results.append( { "name": name, "price": price, "address": address} )
        return {"WellRx": results}

class DrugNameScraper:

    def __init__(self):
        self.base_url = "https://www.wellrx.com/drug-savings-list"
        self.ddn_url = "https://www.discountdrugnetwork.com/get-discount"
        self.service = Service(executable_path="/usr/lib/chromium-browser/chromedriver")
        self.options = webdriver.ChromeOptions()
        self.options.add_argument('--ignore-certificate-errors')
        self.options.add_argument('--incognito')
        self.options.add_argument('--headless')
        self.driver = webdriver.Chrome(service=self.service, options=self.options)
        self.driver.set_window_position(0, 0)
        self.driver.set_window_size(1024, 768)
        self.actions = ActionChains(self.driver)

    def get_drugnames(self):
        with open('medication_names.csv', 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["name"])
            for letter in alphabets:
                self.driver.get(f'{self.base_url}/{letter}')
                WebDriverWait(self.driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'drug-details-list')))
                drug_info = self.driver.find_element(By.ID, 'drug_info').text
                total_entries = drug_info.split(" ")[5]
                pages = math.ceil(int(total_entries)/20)
                for page in range(pages):
                    self.driver.get(f'{self.base_url}/{letter}/?currpage={page}')
                    WebDriverWait(self.driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'drug-details-list')))
                    self.driver.save_screenshot("page.png")
                    rows = self.driver.find_elements(By.XPATH, ".//tbody/tr")
                    print(rows)
                    for row in rows:
                        description = row.find_element(By.XPATH, './/div[@id="drug-name-info2"]').get_attribute("innerText").strip()
                        print(description)
                        if description != "There is no additional information on this drug.":
                            name = row.find_element(By.XPATH, './/div[@id="drug-name-info1"]').text
                            writer.writerow([name])
        print("done")

    def get_forms_dose_qty(self):
        names = []
        count = 0
        with open('medication_names.csv', 'r') as m:
            reader = csv.reader(m)
            for row in reader:
                names.append(row[0])
        names = names[5073:]
        with open('medication_forms.csv', 'a') as form_file, open('medication_doses.csv', 'a') as dose_file , open('medication_qtys.csv', 'a') as qty_file, open('medication_name_form.csv', 'a') as name_form_file, open('medication_form_dose.csv', 'a') as medication_dose_file, open('medication_form_qty.csv', 'a') as medication_qty_file:
            writer1 = csv.writer(form_file)
            writer2 = csv.writer(dose_file) 
            writer3 = csv.writer(qty_file) 
            writer4 = csv.writer(name_form_file) 
            writer5 = csv.writer(medication_dose_file) 
            writer6 = csv.writer(medication_qty_file) 
            
            # #Write headers
            # writer1.writerow(['form'])
            # writer2.writerow(['dose'])
            # writer3.writerow(['qty'])
            # writer4.writerow(['name','form'])
            # writer5.writerow(['name','form', 'dose'])
            # writer6.writerow(['name','form', 'qty'])
            
            #For each drug name, scrape (drug,form) combination, (drug, form, dose) and (drug,form, qty)
            for name in names:
                if "." not in name:
                    if count >= 40:
                        self.driver.quit()
                        self.driver = webdriver.Chrome(service=self.service, options=self.options)
                        self.driver.set_window_position(0, 0)
                        self.driver.set_window_size(1024, 768)
                        self.actions = ActionChains(self.driver)
                        count = 0
                    count = count + 1
                    encoded_name = urllib.parse.quote(name)
                    url = f'https://www.wellrx.com/prescriptions/{encoded_name}/10001/?freshSearch=true'
                    print(url)
                    self.driver.get(url)
                    try:
                        WebDriverWait(self.driver, timeout=60).until(EC.presence_of_element_located((By.CLASS_NAME,'filter-group-menu')))
                        self.driver.save_screenshot("page.png")
                        forms_list = self.driver.find_element(by=By.XPATH, value='//ul[@id="form"]').find_elements(by=By.TAG_NAME, value='li')
                        # need to use get_attribute to pull the innerText as ELEMENT.text attribute was returning an empty string
                        forms = [ form.get_attribute("innerText") for form in forms_list] 
                        # Add name/form combo to csv and get doses and qtys
                        for form in forms:
                            try:
                                if len(forms) > 1 :
                                    #Find the drug form selection filter and click on it and select the form provided in the argument
                                    forms_selection = self.driver.find_element(By.XPATH, '//button[@for="form"]')
                                    #This webpage scrolls down and hides the filter options under the navbar after the page loads. We need to scroll to the top of the page so we can click the drug form filter, and then click on the desired drug form. Using send keys(Ctrl+Home) or other scrolling methods were too slow and forms_selection.click() was trying to click before filter was visible
                                    WebDriverWait(self.driver, timeout=60).until(EC.visibility_of(forms_selection))
                                    drug_image = self.driver.find_element(By.CLASS_NAME, "drug-image")
                                    self.driver.execute_script("arguments[0].scrollIntoView();", drug_image)

                                    forms_selection.click()
                                    form_selection = self.driver.find_element(By.XPATH , f'//ul[@id="form"]/li[text()="{form}"]')
                                    self.driver.save_screenshot("page.png")
                                    WebDriverWait(self.driver, timeout=60).until(EC.element_to_be_clickable(form_selection))
                                    form_selection.click()

                                    #Wait for the page to load the new doses and qty of the drug form we clicked on. Tracked by waiting until a previous element goes stale, and waiting until we find the newly loaded element
                                    WebDriverWait(self.driver, timeout=60).until(EC.staleness_of(form_selection))
                                    WebDriverWait(self.driver, timeout=60).until(EC.presence_of_element_located((By.XPATH, '//button[@for="form"]')))

                                #Find all the dosage and quantity li elements and scrape the innerText and return the results
                                dosage_list = self.driver.find_elements(By.XPATH, "//ul[@id='dosage']/li")
                                qty_list = self.driver.find_elements(By.XPATH, "//ul[@id='quantity']/li")
                                dosages = [li.get_attribute("innerText").strip() for li in dosage_list]
                                qtys = [li.get_attribute("innerText").strip() for li in qty_list if li.get_attribute("innerText").strip() != "Custom Qty"]
                                writer1.writerow([form])
                                writer4.writerow([name,form])
                                print(name, form, dosages, qtys)
                                for dosage in dosages:
                                    writer2.writerow([dosage])
                                    writer5.writerow([name,form,dosage])
                                for qty in qtys:
                                    writer3.writerow([qty])
                                    writer6.writerow([name,form,qty])
                            except NoSuchElementException as e:
                                print(e)
                                break

                    except Exception as e:
                        self.driver.save_screenshot("page.png")
                        print(e)
                        raise e



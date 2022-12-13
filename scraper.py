from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import ElementNotInteractableException


service = Service(executable_path="/usr/lib/chromium-browser/chromedriver")
options = webdriver.ChromeOptions()
options.add_argument('--ignore-certificate-errors')
options.add_argument('--incognito')
options.add_argument('--headless')
driver = webdriver.Chrome(service=service, options=options)
driver.set_window_position(0, 0)
driver.set_window_size(1024, 768)
actions = ActionChains(driver)

# driver.get("https://www.discountdrugnetwork.com/get-discount?drugName=Amoxicillin&zip=11416")
# results = WebDriverWait(driver, timeout=10).until(lambda d: d.find_elements(by=By.CLASS_NAME, value='c-results__item'))
# for e in results:
#     print(e.text)

class DDNSearch:

    def __init__(self):
        self.base_url = "https://www.discountdrugnetwork.com"

    def get_drugnames(self, url, input):
        driver.get(self.base_url)
        drugname_input = WebDriverWait(driver, timeout=3).until(lambda d: d.find_element(by=By.CSS_SELECTOR, value='.c-search-input__drug').find_element(By.TAG_NAME, "input"))
        drugname_input.send_keys(input)
        drugname_results = WebDriverWait(driver, timeout=3).until(lambda d: d.find_elements(by=By.CLASS_NAME, value='c-search-input__drugname'))
            
        return [drug.text for drug in drugname_results]


    def get_drugforms(self, drugname, zip):
        updated_url = f'{self.base_url}/get-discount?drugName={drugname}&zip={zip}'
        driver.get(updated_url)
        page = WebDriverWait(driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'c-results__item')))
        drugform_filter = driver.find_element(By.XPATH, '//div[text()="FORM"]//parent::div').find_element(By.XPATH, '//span[@class="ant-select-selection-item"]')
        # drugform_filter = driver.find_element(By.XPATH, '//div[@class="g-select " and .//div[text()="FORM"]]')
        drugform_filter.click()
        formList = driver.find_element(By.CLASS_NAME, 'rc-virtual-list-holder-inner')
        items = formList.find_elements(By.CLASS_NAME, 'ant-select-item')
        forms = [item.get_attribute("title") for item in items]
        print(forms)
        return forms

    def get_doseandqty(self, drugname, zip, form):
        updated_url = f'{self.base_url}/get-discount?drugName={drugname}&zip={zip}'
        driver.get(updated_url)
        page = WebDriverWait(driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'c-results__item')))
        filters = driver.find_elements(By.CLASS_NAME, 'ant-select-selection-item')
        filters[0].click()
        form_selection = driver.find_element(By.XPATH , f'//div[@class="ant-select-item-option-content" and text()="{form}"]')
        WebDriverWait(driver, timeout=5).until(EC.visibility_of(form_selection))
        form_selection.click()
        page = WebDriverWait(driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'c-results__item')))
        for menu in filters:
            menu.click()
        lists = driver.find_elements(By.CLASS_NAME, 'rc-virtual-list-holder-inner')
        entries = []
        for i in range(1,3):
            items = lists[i].find_elements(By.CLASS_NAME, 'ant-select-item')
            entries.append([item.get_attribute("title") for item in items])
        output = {'dosage':entries[0], 'qty':entries[1]}
        print(output)
        return output

    def get_prices(self, drugname, zip, form, dose, qty):
        #Load the page
        updated_url = f'{self.base_url}/get-discount?drugName={drugname}&zip={zip}'
        driver.get(updated_url)
        #Wait for the page to load
        page = WebDriverWait(driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'c-results__item')))
        #Find the drug FORM selector and click
        filters = driver.find_elements(By.CLASS_NAME, 'ant-select-selection-item')
        filters[0].click()
        #Select the drug form from the dropdown list and wait for it to load
        form_selection = driver.find_element(By.XPATH , f'//div[@class="ant-select-item-option-content" and text()="{form}"]')
        WebDriverWait(driver, timeout=10).until(EC.visibility_of(form_selection))
        form_selection.click()
        page = WebDriverWait(driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'c-results__item')))
        #Click on each dropdown menu to update the dropdown list
        for menu in filters:
            menu.click()
            menu.click()
        lists = driver.find_elements(By.CLASS_NAME, 'rc-virtual-list-holder-inner')
        #Click on the drug dose selector and select the provided dose
        filters[1].click()
        dose_selection = lists[1].find_element(By.XPATH , f'.//div[@class="ant-select-item-option-content" and text()="{dose}"]')
        WebDriverWait(driver, timeout=10).until(EC.visibility_of(dose_selection))
        dose_selection.click()
        #Click on the qty select and select the provided qty
        filters[2].click()
        qty_selection = lists[2].find_element(By.XPATH , f'.//div[@class="ant-select-item-option-content" and text()="{qty}"]')
        WebDriverWait(driver, timeout=10).until(EC.visibility_of(qty_selection))
        qty_selection.click() 
        #Find the drug price results once they are loaded
        results = WebDriverWait(driver, timeout=10).until(lambda d: d.find_elements(by=By.CSS_SELECTOR, value='.c-results__item'))
        output = []
        for result in results:
            pharmacy_name_el = result.find_element(By.XPATH, './/div[@class="c-results__pharmacyname"]')
            price_el = result.find_elements(By.XPATH, './/div[@class="c-results__price"]//p')[1]
            output.append((pharmacy_name_el.text, price_el.text))
        print(output)

class WellRxSearch:

    def __init__(self):
        self.base_url = "https://www.wellrx.com/prescriptions/"

    def get_drugnames(self, input):
        driver.get(self.base_url)
        drugname_input = WebDriverWait(driver, timeout=3).until(lambda d: d.find_element(by=By.XPATH, value='//input[@id="drugSearchInput"]'))
        drugname_input.send_keys(input)
        drugname_results = WebDriverWait(driver, timeout=3).until(lambda d: d.find_elements(by=By.CLASS_NAME, value='ui-menu-item-wrapper'))

        for drug in drugname_results:
            print(drug.text)
            
        return [drug.text for drug in drugname_results]


    def get_drugforms(self, drugname, zip):
        updated_url = f'{self.base_url}/prescriptions/{drugname}/{zip}'
        driver.get(updated_url)
        page = WebDriverWait(driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'filter-group-menu')))
        driver.save_screenshot("page.png")
        forms_list = driver.find_element(by=By.XPATH, value='//ul[@id="form"]').find_elements(by=By.TAG_NAME, value='li')
        
        # need to use get_attribute to pull the innerText as ELEMENT.text attribute was returning an empty string
        forms = [ form.get_attribute("innerText") for form in forms_list] 

        print(forms)
        return forms    

    def get_doseandqty(self, drugname, zip, form):
        updated_url = f'{self.base_url}/prescriptions/{drugname}/{zip}'
        driver.get(updated_url)
        page = WebDriverWait(driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'filter-group-menu')))
        #Find the drug form selection filter and click on it and select the form provided in the argument
        forms_selection = driver.find_element(By.XPATH, '//button[@for="form"]')

        #This webpage scrolls down and hides the filter options under the navbar after the page loads. We need to scroll to the top of the page so we can click the drug form filter, and then click on the desired drug form. Using send keys(Ctrl+Home) or other scrolling methods were too slow and forms_selection.click() was trying to click before filter was visible
        WebDriverWait(driver, timeout=5).until(EC.visibility_of(forms_selection))
        drug_image = driver.find_element(By.CLASS_NAME, "drug-image")
        driver.execute_script("arguments[0].scrollIntoView();", drug_image)
        forms_selection.click()
        form_selection = driver.find_element(By.XPATH , f'//ul[@id="form"]/li[text()="{form}"]')
        WebDriverWait(driver, timeout=5).until(EC.element_to_be_clickable(form_selection))
        form_selection.click()

        #Wait for the page to load the new doses and qty of the drug form we clicked on. Tracked by waiting until a previous element goes stale, and waiting until we find the newly loaded element
        WebDriverWait(driver, timeout=5).until(EC.staleness_of(form_selection))
        WebDriverWait(driver, timeout=5).until(EC.presence_of_element_located((By.XPATH, '//button[@for="form"]')))

        #Find all the dosage and quantity li elements and scrape the innerText and return the results
        dosage_list = driver.find_elements(By.XPATH, "//ul[@id='dosage']/li")
        qty_list = driver.find_elements(By.XPATH, "//ul[@id='quantity']/li")
        dosages = [li.get_attribute("innerText").strip() for li in dosage_list]
        qtys = [li.get_attribute("innerText").strip() for li in qty_list if li.get_attribute("innerText").strip() != "Custom Qty"]
        output = {"dosages": dosages, "quantities": qtys}
        print(output)
        return output

    def get_prices(self, drugname, zip, form, dose, qty):
        updated_url = f'{self.base_url}/prescriptions/{drugname}/{zip}'
        driver.get(updated_url)
        page = WebDriverWait(driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'filter-group-menu')))
        #Find the drug form selection filter and click on it and select the form provided in the argument
        forms_selection = driver.find_element(By.XPATH, '//button[@for="form"]')

        #This webpage scrolls down and hides the filter options under the navbar after the page loads. We need to scroll to the top of the page so we can click the drug form filter, and then click on the desired drug form. Using send keys(Ctrl+Home) or other scrolling methods were too slow and forms_selection.click() was trying to click before filter was visible
        WebDriverWait(driver, timeout=5).until(EC.visibility_of(forms_selection))
        drug_image = driver.find_element(By.CLASS_NAME, "drug-image")
        driver.execute_script("arguments[0].scrollIntoView();", drug_image)
        forms_selection.click()
        form_selection = driver.find_element(By.XPATH , f'//ul[@id="form"]/li[text()="{form}"]')
        WebDriverWait(driver, timeout=5).until(EC.element_to_be_clickable(form_selection))
        form_selection.click()

        #Wait for the page to load the new doses and qty of the drug form we clicked on. Tracked by waiting until a previous element goes stale, and waiting until we find the newly loaded element
        WebDriverWait(driver, timeout=5).until(EC.staleness_of(form_selection))
        WebDriverWait(driver, timeout=5).until(EC.presence_of_element_located((By.XPATH, '//button[@for="dosages"]')))

        #Select the dose
        dosage_filter = driver.find_element(By.XPATH, '//button[@for="dosages"]')
        drug_image = driver.find_element(By.CLASS_NAME, "drug-image")
        ## Scroll up so we can click on the filter
        driver.execute_script("arguments[0].scrollIntoView();", drug_image)
        dosage_filter.click()
        dosage_selection = driver.find_element(By.XPATH , f'//ul[@id="dosage"]/li[text()="{dose}"]')
        # If there is only one dose, it will be non-interactable, we can just pass and move to selecting the qty
        try:
            dosage_selection.click()
        except ElementNotInteractableException:
            pass
        # Wait for new page reload
        WebDriverWait(driver, timeout=5).until(EC.staleness_of(form_selection))
        WebDriverWait(driver, timeout=5).until(EC.presence_of_element_located((By.XPATH, '//button[@for="dosages"]')))

        #Select the qty
        qty_filter = driver.find_element(By.XPATH, '//button[@for="quantity"]')
        drug_image = driver.find_element(By.CLASS_NAME, "drug-image")
        ## Scroll up so we can click on the filter
        driver.execute_script("arguments[0].scrollIntoView();", drug_image)
        qty_filter.click()
        qty_selection = driver.find_element(By.XPATH , f'//ul[@id="quantity"]/li[text()="{qty}"]')
        qty_selection.click()
        # Wait for new page reload
        WebDriverWait(driver, timeout=5).until(EC.staleness_of(qty_filter))
        WebDriverWait(driver, timeout=5).until(EC.presence_of_element_located((By.XPATH, '//button[@for="dosages"]')))
        
        #Scrape and return pharmacy/price data
        pharmacy_elements = driver.find_elements(By.CLASS_NAME, "pharmCard")
        results = []
        for element in pharmacy_elements:
            name = element.find_element(By.XPATH, ".//*[@id='multipharm-loc-key' or @id='singlepharm-name']").get_attribute("innerText")
            # # address = element.find_element(By.ID, "singlepharm-address").get_attribute("innerText")
            price = element.find_element(By.CLASS_NAME, "price").get_attribute("innerText")
            results.append( { "pharmacy_name": name, "price": price} )
        print(results)
        return(results)



# get_drugnames("https://www.discountdrugnetwork.com", "flutica")
# get_drugforms("https://www.discountdrugnetwork.com", "FLUTICASONE PROPIONATE", 11416)
# get_doseandqty("https://www.discountdrugnetwork.com", "FLUTICASONE PROPIONATE", 11416, 'Ointment')
# get_doseandqty("https://www.discountdrugnetwork.com", "FLUTICASONE PROPIONATE", 11416, 'Lotion')
# get_doseandqty("https://www.discountdrugnetwork.com", "FLUTICASONE PROPIONATE", 11416, 'Cream (g)')
# get_doseandqty("https://www.discountdrugnetwork.com", "FLUTICASONE PROPIONATE", 11416, 'SPRAY SUSP')

# DDNSearch = DDNSearch()
# DDNSearch.get_prices("https://www.discountdrugnetwork.com", "FLUTICASONE PROPIONATE", 11416, 'SPRAY SUSP', '50 MCG', '16')

# WellRxSearch = WellRxSearch()
# WellRxSearch.get_drugnames("https://www.wellrx.com/prescriptions/", "AMLODIP")
# WellRxSearch.get_drugforms("https://www.wellrx.com/prescriptions/", "FLUTICASONE PROPIONATE", 11416)
# WellRxSearch.get_doseandqty("https://www.wellrx.com/prescriptions/","FLUTICASONE PROPIONATE", 11416, 'Ointment')
# WellRxSearch.get_prices("https://www.wellrx.com/prescriptions/","FLUTICASONE PROPIONATE", 11416, 'Ointment', '0.005 %', '60 grams')
driver.quit()
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

service = Service(executable_path="/usr/lib/chromium-browser/chromedriver")
options = webdriver.ChromeOptions()
options.add_argument('--ignore-certificate-errors')
options.add_argument('--incognito')
options.add_argument('--headless')
driver = webdriver.Chrome(service=service, options=options)
driver.set_window_position(0, 0)
driver.set_window_size(1024, 768)

# driver.get("https://www.discountdrugnetwork.com/get-discount?drugName=Amoxicillin&zip=11416")
# results = WebDriverWait(driver, timeout=10).until(lambda d: d.find_elements(by=By.CLASS_NAME, value='c-results__item'))
# for e in results:
#     print(e.text)

def get_drugnames(url, input):
    driver.get(url)
    drugname_input = WebDriverWait(driver, timeout=3).until(lambda d: d.find_element(by=By.CSS_SELECTOR, value='.c-search-input__drug').find_element(By.TAG_NAME, "input"))
    drugname_input.send_keys(input)
    drugname_results = WebDriverWait(driver, timeout=3).until(lambda d: d.find_elements(by=By.CLASS_NAME, value='c-search-input__drugname'))

    for drug in drugname_results:
        print(drug.text)
        
    return [drug.text for drug in drugname_results]


def get_drugforms(url, drugname, zip):
    updated_url = f'{url}/get-discount?drugName={drugname}&zip={zip}'
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

def get_doseandqty(url, drugname, zip, form):
    updated_url = f'{url}/get-discount?drugName={drugname}&zip={zip}'
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

def get_prices(url, drugname, zip, form, dose, qty):
    #Load the page
    updated_url = f'{url}/get-discount?drugName={drugname}&zip={zip}'
    driver.get(updated_url)
    #Wait for the page to load
    page = WebDriverWait(driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'c-results__item')))
    #Find the drug FORM selector and click
    filters = driver.find_elements(By.CLASS_NAME, 'ant-select-selection-item')
    filters[0].click()
    #Select the drug form from the dropdown list and wait for it to load
    form_selection = driver.find_element(By.XPATH , f'//div[@class="ant-select-item-option-content" and text()="{form}"]')
    WebDriverWait(driver, timeout=10).until(EC.visibility_of(form_selection))
    driver.save_screenshot('4.png')
    form_selection.click()
    page = WebDriverWait(driver, timeout=10).until(EC.presence_of_element_located((By.CLASS_NAME,'c-results__item')))
    #Click on each dropdown menu to update the dropdown list
    for menu in filters:
        menu.click()
    lists = driver.find_elements(By.CLASS_NAME, 'rc-virtual-list-holder-inner')
    #Click on the drug dose selector and select the provided dose
    driver.save_screenshot('1.png')
    filters[1].click()
    dose_selection = lists[1].find_element(By.XPATH , f'//div[@class="ant-select-item-option-content" and text()="{dose}"]')
    WebDriverWait(driver, timeout=10).until(EC.visibility_of(dose_selection))
    driver.save_screenshot('2.png')
    dose_selection.click()
    #Click on the qty select and select the provided qty
    filters[2].click()
    qty_selection = lists[1].find_element(By.XPATH , f'//div[@class="ant-select-item-option-content" and text()="{qty}"]')
    WebDriverWait(driver, timeout=10).until(EC.visibility_of(qty_selection))
    driver.save_screenshot('3.png')
    qty_selection.click() 
    #Find the drug price results once they are loaded
    results = WebDriverWait(driver, timeout=10).until(lambda d: d.find_elements(by=By.CSS_SELECTOR, value='.c-results__item'))
    output = [result.text for result in results]
    print(output)

# get_drugnames("https://www.discountdrugnetwork.com", "flutica")
# get_drugforms("https://www.discountdrugnetwork.com", "FLUTICASONE PROPIONATE", 11416)
# get_doseandqty("https://www.discountdrugnetwork.com", "FLUTICASONE PROPIONATE", 11416, 'Ointment')
# get_doseandqty("https://www.discountdrugnetwork.com", "FLUTICASONE PROPIONATE", 11416, 'Lotion')
# get_doseandqty("https://www.discountdrugnetwork.com", "FLUTICASONE PROPIONATE", 11416, 'Cream (g)')
# get_doseandqty("https://www.discountdrugnetwork.com", "FLUTICASONE PROPIONATE", 11416, 'SPRAY SUSP')
get_prices("https://www.discountdrugnetwork.com", "FLUTICASONE PROPIONATE", 11416, 'SPRAY SUSP', '50 MCG', '16')
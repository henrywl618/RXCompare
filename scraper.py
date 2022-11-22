from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait

service = Service(executable_path="/usr/lib/chromium-browser/chromedriver")
options = webdriver.ChromeOptions()
options.add_argument('--ignore-certificate-errors')
options.add_argument('--incognito')
options.add_argument('--headless')
driver = webdriver.Chrome(service=service, options=options)

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

def get_dropdowninfo(url, drugname, zip):
    updated_url = f'{url}/get-discount?drugName={drugname}&zip={zip}'
    driver.get(updated_url)
    results = WebDriverWait(driver, timeout=10).until(lambda d: d.find_elements(by=By.CLASS_NAME, value='c-results__item'))
    for e in results:
        print(e.text)


# get_drugnames("https://www.discountdrugnetwork.com", "fluticasone")
get_dropdowninfo("https://www.discountdrugnetwork.com", "FLUTICASONE-SALMETEROL", 11416)
from scraper import Scraper


def perform_webadvisor_search():
    """
    Uses the Firefox Selenium WebDriver to navigate to WebAdvisor
    and perform a search for all courses in the W21 semester.
    The HTML of the results table is then written to a new file 'data.html'.

    This method assumes Firefox is already installed, and uses the
    Geckodriver executables from the repo's geckodriver/ folder.
    """
    scraper = Scraper()
    scraper.goto("https://webadvisor.uoguelph.ca")
    scraper.wait_for_element("@Students")
    scraper.click("@Students")
    scraper.wait_for_element("@Search for Sections")
    scraper.click("@Search for Sections")
    select = scraper.wait_for_element("#VAR1")
    scraper.select_by_value(select, "W21")
    select = scraper.wait_for_element("#VAR6")
    scraper.select_by_value(select, "G")
    scraper.click('//input[@name="SUBMIT2"]')

    # Wait for the entire table to load
    # There should be exactly 2614 <tr> once the table is fully loaded
    tr = scraper.find_elements("//tr")
    while len(tr) < 2550:  # Add some wiggle room
        import time
        print(f"Waiting for table to populate - {len(tr)} table rows found...")
        time.sleep(4)
        tr = scraper.find_elements("//tr")

    with open('data.html', 'w') as fd:
        fd.write(scraper.get_source())
    scraper.driver.quit()


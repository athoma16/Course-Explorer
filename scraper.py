import os
import platform
from selenium import webdriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.firefox.options import Options


class Scraper(object):

	driver: WebDriver = None

	def __init__(self):
		options = Options()
		options.headless = True
		self.driver = webdriver.Firefox(options=options, executable_path=self.get_path())
		self._strategies = {
			'id': self._find_by_id,
			'xpath': self._find_by_xpath,
			'link': self._find_by_link_text,
		}

	def __enter__(self):
		# python context manager
		return self

	def __exit__(self, *args):
		self.driver.quit()

	def get_source(self):
		"""
		Returns the entire HTML source of the current page or frame.
		"""
		return self.driver.page_source

	def goto(self, url):
		"""
		Navigates the active browser instance to the provided url.
		Will append default prefix to the url if it's missing

		:param url: str
		:return: NoReturn
		"""
		if not url.startswith(('http://', 'https://')):
			url = 'https://' + url
		self.driver.get(url)

	def is_os_64bit(self):
		"""
		Checks to see if the currently running OS is 64-bit
		and returns true or false.
		"""
		return platform.machine().endswith('64')

	def get_os_type(self):
		"""
		Determines the currently running OS type and returns
		it in string form.
		"""
		osType = platform.system()
		if osType == "Linux" and self.is_os_64bit():
			return "linux64"
		elif osType == "Linux" and not self.is_os_64bit():
			return "linux32"
		elif osType == "Darwin":
			return "macos"
		elif osType == "Windows" and self.is_os_64bit():
			return "win64"
		elif osType == "Windows" and not self.is_os_64bit():
			return "win32"
		else:
			return None

	def get_path(self):
		"""
		Determines the path to the correct Geckodriver executable file in the repository
		based on OS type and modifies the permissions if necessary.

		:return: String
		"""
		cwd = os.getcwd()
		PATH = os.path.join(cwd, "geckodriver", "geckodriver-v0.29.0-" + self.get_os_type(), "geckodriver")
		if self.get_os_type() == ("win64" or "win32"):
			PATH = PATH + ".exe"
		elif self.get_os_type() == ("linux64" or "linux32"):
			os.chmod(PATH, 755)
		return PATH

	def click(self, locator):
		"""
		Click element identified by locator.

		:param locator: WebElement or str
		:return: NoReturn
		"""
		self.find_element(locator).click()

	def select_by_value(self, locator, value):
		"""
		Pick a field from a `select` element based on it's `value`

		:param locator: WebElement or str
		:param value: str
		:return: NoReturn
		"""
		Select(self.find_element(locator)).select_by_value(value)

	def wait_for_element(self, locator, timeout=30, parent=None):
		"""
		Wait for `element` and return it if found or raise timeoutException

		:param locator: WebElement or str
		:param timeout: int - explicit wait timeout in seconds
		:param parent: WebElement or Driver by default
		:return: WebElement or TimeoutException
		"""
		func = lambda _: self.find_element(locator, parent=parent)
		message = ('Failed to wait for element `{}` before the '
		           'timeout [{} second(s)].'.format(locator, timeout))
		try:
			result = WebDriverWait(self.driver, timeout=timeout).until(func)
			return result
		except TimeoutException as excp:
			excp.msg = f"Failed to wait for element `{locator}` before the " \
			           f"timeout [{timeout} second(s)]."
			raise

	def find_element(self, locator, parent=None, first_only=True) -> WebElement:
		"""
		Main method used to find elements. Will call the right method
		based on the locator provided

		Locators can be ID based: eg '#myid' will select <tag id='myid'>
		Locators can be Link text based: eg '@Home' will select <a>Home</a>
		Locators can be XPath based: eg '//div' will select <div>Content</div>

		:param locator: str or WebElement
		:param parent: WebElement - the driver or parent element
		:param first_only: bool - return all elements or only the first
		:return WebElement:
		"""
		if isinstance(locator, WebElement):
			return locator
		strategy, query = self._dissect(locator)
		strategy_method = self._strategies[strategy]
		elements = strategy_method(query, parent=parent or self.driver)
		if first_only:  # Return a list of results or just one element?
			if not elements:
				# return None if no elements are found
				return None
			return elements[0]
		return elements

	def find_elements(self, locator, parent=None):
		"""
		Function will return a list of matching WebElements instead of a
		single WebElement as `find_element` does.

		See `find_element` for ``locator`` usage and function details.

		:param locator: List[WebElement] or str
		:param parent: WebElement - the driver or parent element
		:return: List[WebElement]
		"""
		if isinstance(locator, WebElement):
			return [locator]
		return self.find_element(locator, parent, False)

	# PRIVATE METHODS

	def _dissect(self, locator):
		"""
		Dissect the locator to see what strategy to use.
		"""
		if locator.startswith(('/', '(', '.')):
			return 'xpath', locator
		if locator.startswith('#'):
			return 'id', locator[1:]
		if locator.startswith('@'):
			return 'link', locator[1:]
		raise ValueError(f"Was not able to identify strategy in query: '{locator}'.")

	def _find_by_id(self, query, parent):
		return parent.find_elements_by_id(query)

	def _find_by_xpath(self, query, parent):
		return parent.find_elements_by_xpath(query)

	def _find_by_link_text(self, query, parent):
		return parent.find_elements_by_link_text(query)
import pickle, os
import codecs
from course import Course
from commands import Commands
from textparser import parse
from navigate import perform_webadvisor_search
from htmlparser import HTML_Data_Parser

try:
	with open(os.path.join((os.path.dirname(os.path.realpath(__file__))), 'data.bin'), 'rb') as fd:
		data = pickle.load( fd )

except FileNotFoundError:
	# Parse data
	print(f"Parsing 'data.txt'...\n")
	data = parse(os.path.join((os.path.dirname(os.path.realpath(__file__))), 'data.txt'))

	# Open supplied HTML file for reading
	try:
		file = codecs.open(
			os.path.join((os.path.dirname(os.path.realpath(__file__))), "data.html"),
			'r', encoding='utf-8', errors='ignore')
		html_data = file.read()
		file.close()
		# Parse the HTML file to add availability and capacity to main data
		print("Parsing HTML file...\n")
		parsed_html = []
		parser = HTML_Data_Parser()
		parser.feed(html_data)
		courses = parser.handle_text(data)
		print("HTML parsing complete.")
		print(" ")

	except OSError:
		print ("Error, failed to open 'data.html'.")
		#sys.exit()

	with open(os.path.join((os.path.dirname(os.path.realpath(__file__))), 'data.bin'), 'wb') as fd:
		pickle.dump(data, fd)

# Use for testing/debugging
# for course in data:
#     print("Course code = " + course.code)
#     print("Title = " + course.title)
#     print("Description = " + course.description)
#     print("Prerequisites = ")
#     print(course.prerequisites)
#     print("Credit = " + str(course.credit))
#     print("Semesters = ")
#     print(course.semesters)
#     print("Department = " + course.department)
#     print("DE = " + str(course.de))
#     print("Availibiliy = ", course.availability)
#     print("Capacity = ", course.capacity)
#     print(" ")

if __name__ == "__main__":
	# Display usage message to user
	print("""
	W21 CIS4250 Team 10 - UofG Course Catalog
	Use one the following commands to search/sort the data:


		> search [parameter] [keywords]

		> export [paramater] [keywords]

		> json [parameter] [keywords]

		> sort [parameter]

		> scrape

		> help / quit


	Where:

		[parameter] is the course parameter you want to query.
			'department', 'prerequisites', 'DE', 'description', 'credit',
			'semester', 'title' or 'code'.

		[keywords] is the keyword to use in the search.

	Type 'help' for a detailed description of the allowed parameters and examples.

	Type 'exit' to quit the program.
	""")

	# Get input from user
	while True:
		# eg: ' > search title computer'
		user_input = input(" > ").split(' ')  # user_input = ['search', 'title', 'computer']
		try:
			if user_input[0].lower() not in ['sort', 'search', 'export', 'json']:
				raise RuntimeError
			func = getattr(Commands(), user_input.pop(1).lower())  # func = Commands.title
			func(data, *user_input)  # calls Commands.title(data, 'search', 'computer')

		except (IndexError, RuntimeError):  # pop(1) failed or invalid command
			if user_input[0].lower() == 'help':
				Commands().help()
			elif user_input[0].lower() == 'export':
				Commands().export_data(data)
			elif user_input[0].lower() == 'scrape':
				Commands().scrape(data)
			elif user_input[0].lower() == 'json':
				Commands().json(data)
			elif user_input[0].lower() == 'exit' or user_input[0].lower() == 'quit':
				exit(1)
			else:
				print("No such command.")

		except AttributeError:  # parameter not found in Commands()
			print("No such parameter.")


def get_data():
	return data

def get_json():
	return Commands().json(data, data)

def process_query(method, parameter, keywords):
	"""
	:param method: search, sort
	:param parameter: title, description, ...
	:param keywords: '_' delimited keywords to filter by
	:return:
	"""
	if method.lower() not in ['search', 'json']:
		return []
	try:
		func = getattr(Commands(), parameter.lower()) #  eg Commands.title
		return func(data, method, *keywords.split('_'))  # calls Commands.title(data, 'search', 'computer')
	except:
		return []

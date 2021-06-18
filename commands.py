from course import Course
from navigate import perform_webadvisor_search
import csv, re
import codecs
import sys
from htmlparser import HTML_Data_Parser
import json


class Commands(object):
	"""
	List of methods called upon user inputs.
	The method name is the 'parameter' the user selected.

	Example; if the user calls:

		> search department math and stats
		calls " self.department(data, 'search', ['math', 'and', 'stats']) "

		or

		> sort DE
		calls " self.de(data, 'sort', []) "
	"""

	def department(self, data, method, *keywords):
		"""
		Search/sort by department.
		:param data: List(Course): The list of all courses
		:param method: 'export', 'search' or 'sort'
		:param keywords: List(string)
		"""
		print(f"Called 'department'. Method: {method}, Keywords: {keywords}.")
		print()

		if method == 'search' or method == 'export' or method == 'json':

			result = []
			#Return all courses with keywords in their descriptions
			for course in data:
				flag = True
				for word in keywords:
					if word.lower() not in course.department.lower():
						flag = False
				if flag == True:
					result.append(course)
					print("Course Code = " + course.code)
					print("Title = " + course.title)
					print("Description = " + course.description)
					print("Prerequisites = ")
					print(course.prerequisites)
					print("Credit = " + str(course.credit))
					print("Semesters = ")
					print(course.semesters)
					print("Department = " + course.department)
					print("DE = " + str(course.de))
					print("Availability = ", course.availability)
					print("Capacity = ", course.capacity)
					print()
			print()
			if method == 'export':
				self.export_data(result)
			if method == 'json':
				return self.json(result, data)
			return result

		if method == 'sort':
			all_departments = []

			#Grab all unique departments from data
			for course in data:
				if course.department not in all_departments:
					all_departments.append(course.department)

			#Sort the list of all departments
			all_departments.sort()

			#Return sorted list
			for d in all_departments:
				print(d)
			print()

	def prerequisites(self, data, method, *keywords):
		"""
		Search/sort by prerequisites.
		:param data: List(Course): The list of all courses
		:param method: 'export', 'search' or 'sort'
		:param keywords: List(string)
		"""
		print(f"Called 'prerequisites'. Method: {method}, Keywords: {keywords}.")

		if method == 'search' or method == 'export' or method == 'json':

			result = []
			#Find the selected course
			for course in data:
				if (keywords[0]).lower() == (course.code).lower():

					result.append(course)
					#Return all prerequisites for the course
					print("Search prerequisites...")
					print("Results: ")

					for prereq in course.prerequisites:
						print(prereq)
			print()
			if method == 'export':
				self.export_data(result)
			if method == 'json':
				return self.json(result,data)
			return result

	def de(self, data, method, *keywords):
		"""
		Search/sort by distant education.
		:param data: List(Course): The list of all courses
		:param method: 'export', 'search' or 'sort'
		:param keywords: List(string)
		"""
		print(f"Called 'de'. Method: {method}, Keywords: {keywords}.")

		if method == 'search' or method == 'export' or method == 'json':

			result = []
			if (keywords[0]).lower() == 'true':

				#Return all courses where DE = True
				for course in data:
					if course.de == True:
						result.append(course)
						print("Course Code = " + course.code)
						print("Title = " + course.title)
						print("Description = " + course.description)
						print("Prerequisites = ")
						print(course.prerequisites)
						print("Credit = " + str(course.credit))
						print("Semesters = ")
						print(course.semesters)
						print("Department = " + course.department)
						print("DE = " + str(course.de))
						print("Availability = ", course.availability)
						print("Capacity = ", course.capacity)
						print()


			elif (keywords[0]).lower() == 'false':

				#Return all courses where DE = True
				for course in data:
					if course.de == False:
						result.append(course)
						print("Course Code = " + course.code)
						print("Title = " + course.title)
						print("Description = " + course.description)
						print("Prerequisites = ")
						print(course.prerequisites)
						print("Credit = " + str(course.credit))
						print("Semesters = ")
						print(course.semesters)
						print("Department = " + course.department)
						print("DE = " + str(course.de))
						print()

			else:
					print("No results available.")

			print()
			if method == 'export':
				self.export_data(result)
			if method == 'json':
				return self.json(result,data)
			return result


		if method == 'sort':

			all_de_courses = []

			#Grab all unique unique DE courses
			for course in data:
				if (course.code not in all_de_courses) and (course.de == True):
					all_de_courses.append(course.code)

			#Sort the list of all DE courses
			all_de_courses.sort()

			#Return sorted list
			for de in all_de_courses:
				print(de)

			print()

	def description(self, data, method, *keywords):
		"""
		Search/sort by description.
		:param data: List(Course): The list of all courses
		:param method: 'export', 'search' or 'sort'
		:param keywords: List(string)
		"""

		if method == 'search' or method == 'export' or method == 'json':

			result = []
			#Return all courses with each keyword in their descriptions
			for course in data:
				flag = 0
				for word in keywords:
					if word.lower() in course.description.lower():
						flag = 1
					else :
						flag = 0
						break
				if flag == 1:
					result.append(course)
					print("Course Code = " + course.code)
					print("Title = " + course.title)
					print("Description = " + course.description)
					print("Prerequisites = ")
					print(course.prerequisites)
					print("Credit = " + str(course.credit))
					print("Semesters = ")
					print(course.semesters)
					print("Department = " + course.department)
					print("DE = " + str(course.de))
					print("Availability = ", course.availability)
					print("Capacity = ", course.capacity)
					print()
			if flag == 0:
				print("sorry invalid description inputted please try again")
			if method == 'export':
				self.export_data(result)
			if method == 'json':
				return self.json(result,data)
			return result

		if method == 'sort':
			def sortDesc(e):
				return len(e.description)
			data.sort(key=sortDesc)
			for course in data:
				print("Course Code = " + course.code)
				print("Title = " + course.title)
				print("Description = " + course.description)
				print("Prerequisites = ")
				print(course.prerequisites)
				print("Credit = " + str(course.credit))
				print("Semesters = ")
				print(course.semesters)
				print("Department = " + course.department)
				print("DE = " + str(course.de))
				print("Availability = ", course.availability)
				print("Capacity = ", course.capacity)
				print()

	def credit(self, data, method, *keywords):
		"""
		Search/sort by course credit weight.
		:param data: List(Course): The list of all courses
		:param method: 'export', 'search' or 'sort'
		:param keywords: List(string)
		"""

		if method == 'search' or method == 'export' or method == 'json':
			flag = 0
			results = []
			for course in data:
				result = str(course.credit)
				result.replace(" ", "")
				if result == keywords[0]:
					results.append(course)
					print(f"This course is a {keywords[0]} weight course: " + str(course.code))
					print("Course Title = " + course.title)
					print("")
					flag = 1
			if flag == 0:
				print("sorry invalid credit inputted please try again")
			if method == 'export':
				self.export_data(results)
			if method == 'json':
				return self.json(results,data)
			return results



		if method == "sort":
			for course in data:
				result = str(course.credit)
				print(f"This course is a {result} weighted course: " + str(course.code))
				print("Course Title = " + course.title)
				print("")

		print(f"Called 'credit'. Method: {method}, Keywords: {keywords}.")

	def semester(self, data, method, *keywords):
		"""
		Search/sort by semester.
		:param data: List(Course): The list of all courses
		:param method: 'export', 'search' or 'sort'
		:param keywords: List(string)
		"""

		if method == 'search' or method == 'export' or method == 'json':

			result = []
			#Return all courses that match the semesters in keywords
			for course in data:
				flag = 0
				for sem in course.semesters:
					for word in keywords:
						if word.lower() == sem.lower():
							flag = 1
				if flag == 1:
						result.append(course)
						print("Course Code = " + course.code)
						print("Title = " + course.title)
						print("Description = " + course.description)
						print("Prerequisites = ")
						print(course.prerequisites)
						print("Credit = " + str(course.credit))
						print("Semesters = ")
						print(course.semesters)
						print("Department = " + course.department)
						print("DE = " + str(course.de))
						print("Availability = ", course.availability)
						print("Capacity = ", course.capacity)
						print()
			if flag == 0:
				print("sorry invalid semester inputted please try again")
			if method == 'export':
				self.export_data(result)
			if method == 'json':
				return self.json(result,data)
			return result

		if method == 'sort':
			def sortSemester(e):
				return e.semesters[0]
			data.sort(key=sortSemester)
			for course in data:
				print("Course Code = " + course.code)
				print("Title = " + course.title)
				print("Description = " + course.description)
				print("Prerequisites = ")
				print(course.prerequisites)
				print("Credit = " + str(course.credit))
				print("Semesters = ")
				print(course.semesters)
				print("Department = " + course.department)
				print("DE = " + str(course.de))
				print("Availability = ", course.availability)
				print("Capacity = ", course.capacity)
				print()


	def title(self, data, method, *keywords):
		"""
		Search/sort by course title.
		:param data: List(Course): The list of all courses
		:param method: 'export', 'search' or 'sort'
		:param keywords: List(string)
		"""
		if method == 'search' or method == 'export' or method == 'json':

			matches = []

			result= ''
			flag = 0
			for element in keywords:
				result += str(element)
				result += " "

			result = result.strip()
			for course in data:
				title = course.title.strip()
				if result.lower() in title.lower():
					matches.append(course)
					print("")
					print("Found a matching Course title: " + course.title)
					print("Course code = " + course.code)
					print("Course Description: ")
					print(course.description)
					print("")
					flag = 1

			if (flag == 0):
				for course_title in data:
					print(course_title.title)
				print("")
				print("The course title you entered cannot be found in the system, please try again!!")
				print("Listed above are all the course titles, please select the parameter sort to sort the titles alphabetically")
				print("----------------------------------------------------------------------------")

			if method == 'export':
				self.export_data(matches)
			if method == 'json':
				return self.json(matches,data)
			return matches


		if method == 'sort':
			all_titles = []
			for course in data:
				if course.title not in all_titles:
					all_titles.append(course.title)

			all_titles.sort()
			for data in all_titles:
				print(data)
		print()

		print(f"Called 'title'. Method: {method}, Keywords: {keywords}.")

	def code(self, data, method, *keywords):
		"""
		Search/sort by course code.
		:param data: List(Course): The list of all courses
		:param method: 'export', 'search' or 'sort'
		:param keywords: List(string)
		"""
		if method == 'search' or method == 'export' or method == 'json':
			result = []
			flag = 0
			for course in data:
				for word in keywords:
					if word.lower() in course.code.lower():
						flag = 1
						result.append(course)
						print("")
						print("Course Code = " + course.code)
						print("Title = " + course.title)
						print("Description = " + course.description)
						print("Prerequisites = ")
						print(course.prerequisites)
						print("Credit = " + str(course.credit))
						print("Semesters = ")
						print(course.semesters)
						print("Department = " + course.department)
						print("DE = " + str(course.de))
						print("Availability = ", course.availability)
						print("Capacity = ", course.capacity)
						print()
			if (flag == 0):
				print("")
				print("The course code you entered cannot be found in the system, please try again!!")
				print("----------------------------------------------------------------------------")
			if method == 'export':
				self.export_data(result)
			if method == 'json':
				return self.json(result, data)
			return result

		if method == 'sort':
			all_departments = []
			for course in data:
				print("Course code = " + course.code)
				print("Title = " + course.title)
				print("")

		print(f"Called 'code'. Method: {method}, Keywords: {keywords}.")

	def export_data(self, data):
		"""
		Export all courses from list of courses (`data`) into Gephi friendly
		csv files. (`data.csv`).

		A `data.html` with course 'availability and capacity' information is
		required for the method to run. Run `scrape` in order to generate or
		update the HTML file.

		:param data: List(Course)
		:return: NoReturn
		"""
		if not self._export_allowed():
			print("In order to export data, you must first scrape webadvisor. "
			      "Please run 'scrape'.")
			return

		print("Exporting data as csv...")

		id = 0

		extra_nodes = []
		for id, course in enumerate(data):
			course.id = id # assign a unique ID to each course

		node_num = id

		with open('nodes.csv', 'w', newline='') as nodes_fd, \
				open('edges.csv', 'w', newline='') as edges_fd:

			# setup nodes file
			nodes_columns = ['id', 'label', 'course', 'department', 'capacity',
							'availability', '%full']
			nodes = csv.DictWriter(nodes_fd, fieldnames=nodes_columns)
			nodes.writeheader()

			# setup edges file
			edges_columns = ['source', 'target', 'type', 'weight', 'category']
			edges = csv.DictWriter(edges_fd, fieldnames=edges_columns)
			edges.writeheader()
			#loop through all the data
			for course in data:
				node = {}
				edge = {'type': 'directed', 'weight': 1.0}
				node = self.create_node(course)
				if(course.capacity != 0):
					node['%full'] = int((course.capacity - course.availability) / course.capacity * 100)
				else:
					node['%full'] = 100
				nodes.writerow(node)
				#loop through all prereqs for each course
				for prereq_code in course.prerequisites:
					#if the prereq has or/of split on or/of
					if re.search("o[r|f]", prereq_code):
						prereq_opts = re.split("o[r|f]", prereq_code)
						#list of prereqs that will have an edge weight of 0.50 to show they are not mandatory
						for option in prereq_opts:
							#This grabs only the course code from the string
							opt_code = re.search("[A-Z]{2,4}\*\d{4}", option)
							if opt_code:
								#This stores the course code option
								o_code = option[opt_code.start():opt_code.end()]
								#Attempts to find the course by its code
								prereq = next(filter(lambda c: c.code == o_code, data), None)

								if prereq: #if the course was found add the edge
									edge = self.create_edge(prereq.id, course, 0.15)
									edges.writerow(edge)
								else: #if the course was not found add in a new node for the course and an edge
									if o_code not in extra_nodes:
										extra_nodes.append(o_code)
									#as all extra nodes are added sequentially can calculate the source id
									source = 1 + node_num + extra_nodes.index(o_code)
									edge = self.create_edge(source, course, 0.15)
						continue
					elif re.search("[0-9]*\.(00|50)", prereq_code): #if the prereq contains "15:00 credits"
						if prereq_code not in extra_nodes: #handle this by adding a 15.00 node
							extra_nodes.append(prereq_code)
						#calculate the id and add the edge
						source = 1 + node_num + extra_nodes.index(prereq_code)
						edge = self.create_edge(source, course, 0.20)
						edges.writerow(edge)
						continue
					#make sure the format of the prereq matches the course code
					code_format = re.search("[A-Z]{2,4}\*\d{4}", prereq_code)
					if code_format:
						#grab only the course code section of the string
						pr_code = prereq_code[code_format.start():code_format.end()]
						#find the existing course
						prereq = next(filter(lambda c: c.code == pr_code, data), None)
						if prereq is None: #if it does not exist add it as a node with the edge
							if re.search("[A-Z]{2,4}\*\d{4}", prereq_code):
								if pr_code not in extra_nodes:
									extra_nodes.append(pr_code)
								source = 1 + node_num + extra_nodes.index(pr_code)
								edge = self.create_edge(source, course, 0.20)
							continue
						else:
							#add correctly formatted course edge
							edge = self.create_edge(prereq.id, course, 0.20)
							edges.writerow(edge)
					# else:
					# 	#Error Statement
					# 	print(f"Prerequisite '{prereq_code}' was not handled in "
					# 	      f"course '{course.code}'.")
			#add all the extra nodes to the nodes.csv
			for x_node in extra_nodes:
				id += 1
				extraNode = {}
				if re.search("[0-9]*\.(00|50)", x_node):
					extraNode = self.create_extra_node(id, x_node, "Credits")
				else:
					#choosing a department for the missing courses based of course code
					departCode = re.search("[A-Z]{2,4}", x_node)
					department = x_node[departCode.start():departCode.end()]
					extraNode = self.create_extra_node(id, x_node, department)
				nodes.writerow(extraNode)

	#Helper function to create proper nodes
	def create_node(self, course):
		node = {}
		node['id'] = course.id
		node['label'] = course.title
		node['course'] = course.code
		node['department'] = course.department
		node['capacity'] = course.capacity
		node['availability'] = course.availability
		return node

	#Function to add nodes for missing courses
	def create_extra_node(self, id, prereq_code, department):
		node = {'capacity': 0, 'availability': 0}
		node['id'] = id
		node['label'] = prereq_code
		node['course'] = prereq_code
		node['department'] = department
		return node

	#Helper function to add edges and their weights
	def create_edge(self, source, course, weight):
		edge = {'type': 'directed', 'weight': weight}
		edge['source'] = source
		edge['target'] = course.id
		edge['category'] = course.id % 5
		return edge

	def json(self, data, all_data):
		if not self._export_allowed():
			print("In order to export data, you must first scrape webadvisor. "
			      "Please run 'scrape'.")
			return

		print("Exporting data as json...")

		id = 0

		extra_nodes = []
		for id, course in enumerate(data):
			course.id = id # assign a unique ID to each course

		node_num = id

		courses = {}
		courses['nodes'] = []
		courses['links'] = []


			#loop through all the data
		for course in data:
			node = {}
			edge = {'type': 'directed', 'weight': 1.0}
			node = self.create_node(course)
			if(course.capacity != 0):
				node['%full'] = int((course.capacity - course.availability) / course.capacity * 100)
			else:
				node['%full'] = 100
			courses['nodes'].append(node)
			#loop through all prereqs for each course
			for prereq_code in course.prerequisites:
				#if the prereq has or/of split on or/of
				if re.search("o[r|f]", prereq_code):
					prereq_opts = re.split("o[r|f]", prereq_code)
					#list of prereqs that will have an edge weight of 0.50 to show they are not mandatory
					for option in prereq_opts:
						#This grabs only the course code from the string
						opt_code = re.search("[A-Z]{2,4}\*\d{4}", option)
						if opt_code:
							#This stores the course code option
							o_code = option[opt_code.start():opt_code.end()]
							#Attempts to find the course by its code
							prereq = next(filter(lambda c: c.code == o_code, data), None)

							if prereq: #if the course was found add the edge
								edge = self.create_edge(prereq.id, course, 0.15)
								courses['links'].append(edge)
							else: #if the course was not found add in a new node for the course and an edge
								if o_code not in extra_nodes:
									extra_nodes.append(o_code)
								#as all extra nodes are added sequentially can calculate the source id
								source = 1 + node_num + extra_nodes.index(o_code)
								edge = self.create_edge(source, course, 0.15)
					continue
				elif re.search("[0-9]*\.(00|50)", prereq_code): #if the prereq contains "15:00 credits"
					if prereq_code not in extra_nodes: #handle this by adding a 15.00 node
						extra_nodes.append(prereq_code)
					#calculate the id and add the edge
					source = 1 + node_num + extra_nodes.index(prereq_code)
					edge = self.create_edge(source, course, 0.20)
					courses['links'].append(edge)
					continue
				#make sure the format of the prereq matches the course code
				code_format = re.search("[A-Z]{2,4}\*\d{4}", prereq_code)
				if code_format:
					#grab only the course code section of the string
					pr_code = prereq_code[code_format.start():code_format.end()]
					#find the existing course
					prereq = next(filter(lambda c: c.code == pr_code, data), None)
					if prereq is None: #if it does not exist add it as a node with the edge
						if re.search("[A-Z]{2,4}\*\d{4}", prereq_code):
							if pr_code not in extra_nodes:
								extra_nodes.append(pr_code)
							source = 1 + node_num + extra_nodes.index(pr_code)
							edge = self.create_edge(source, course, 0.20)
						continue
					else:
						#add correctly formatted course edge
						edge = self.create_edge(prereq.id, course, 0.20)
						courses['links'].append(edge)
				# else:
				# 	#Error Statement
				# 	print(f"Prerequisite '{prereq_code}' was not handled in "
				# 	      f"course '{course.code}'.")
		#add all the extra nodes to courses
		for x_node in extra_nodes:
			id += 1
			extraNode = {}
			if re.search("[0-9]*\.(00|50)", x_node):
				extraNode = self.create_extra_node(id, x_node, "Credits")
			else:
				#choosing a department for the missing courses based of course code
				print(x_node)
				course = next(filter(lambda c: c.code == x_node, all_data), None)
				if course:
					extraNode = self.create_extra_node(id, x_node, course.department)
			courses['nodes'].append(extraNode)

		print(courses['nodes'])
		return courses
		# with open('data.json', 'w') as outfile:
		# 	json.dump(courses, outfile, indent = 4)

	def help(self):

		print("""
		W21 CIS4250 Team 10 - UofG Course Catalog
		Assumptions for the "keywords" to be used when searching each method call:


		DEPARTMENT:
		> search [department] [keywords] where keywords can be a list of words for partial searching.

		  Example: [Music science AGRICULTURE]


		PREREQUISITES:
		> search [prerequisites} [keywords] where keywords is a course code.

		  Example: [CIS*2750]


		DE:
		> search [DE] [keywords] where keywords is True or False.

		  Example: [True], [false]


		DESCRIPTION:
		> search [description] [keywords] where keywords

		  Example: [mobile computing]


		CREDIT:
		> search [credit] [keywords] where keywords is a value for partial searching.

		  Example: [0.5], [0.75]


		SEMESTER:
		> search [semester] [keywords] where keywords

		  Example: [S W F]


		TITLE:
		> search [title] [keywords] where keywords is a value for partial searching.

		  Example: [programming]


		CODE:
		> search [code] [keywords] where keywords can be a list of words for partial searching.

		  Example: [CIS, CIS*1300, ENGL]
		""")

	def _export_allowed(self):
		"""
		Check to see if a 'data.html' file exists before proceeding with exporting
		data.
		:return: bool
		"""
		import os
		try:
			with open(os.path.join((os.path.dirname(os.path.realpath(__file__))), 'data.html'), 'rb') as fd:
				return True
		except FileNotFoundError:
			return False

	def scrape(self, data):

		#Scrape the data off WebAdvisor
		perform_webadvisor_search()

		# Open supplied HTML file for reading
		try:
			file = codecs.open("data.html", 'r')
			html_data = file.read()
			file.close()

		except OSError:
			print ("Error, failed to open file.")
			sys.exit()

		# Parse the HTML file to add availability and capacity to main data
		parsed_html = []
		parser = HTML_Data_Parser()
		parser.feed(html_data)
		courses = parser.handle_text(data)

		print("HTML parsing complete.")
		print(" ")

		# Testing/Debugging
		# for course in courses:
		# 	print("Course code = " + course.code)
		# 	print("Title = " + course.title)
		# 	print("Description = " + course.description)
		# 	print("Prerequisites = ")
		# 	print(course.prerequisites)
		# 	print("Credit = " + str(course.credit))
		# 	print("Semesters = ")
		# 	print(course.semesters)
		# 	print("Department = " + course.department)
		# 	print("DE = " + str(course.de))
		# 	print("Availibiliy = ", course.availability)
		# 	print("Capacity = ", course.capacity)
		# 	print(" ")

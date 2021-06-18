import sys, os
import json
import csv

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def index(request):

	try:
		path = os.path.dirname(
			os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
		sys.path.append(path)
		from main import get_data
	except:
		path = os.path.join(path, "w21_cis4250_team_10/")
		sys.path.append(path)
		from main import get_data

	data = get_data()
	result = []
	for course in data:
		c = {
			'id': course.id,
			'code': course.code,
			'title': course.title,
			'description': course.description,
			'prerequisites': course.prerequisites,
			'credit': course.credit,
			'semesters': course.semesters,
			'department': course.department,
			'equate': course.equate,
			'de': course.de,
			'availability': course.availability,
			'capacity': course.capacity,
		}
		result.append(c)
	response = JsonResponse(result, safe=False)
	return response


@csrf_exempt
def email(request):

	# javascript usage example
	# var xhr = new XMLHttpRequest();
	# xhr.open("POST", 'https://cis4250-10.socs.uoguelph.ca/api/email/');
	# xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	# xhr.send("email=email@none.com&course=cis4250");

	if request.method == 'POST':

		if 'email' not in request.POST or 'course' not in request.POST:
			return JsonResponse({'result': 'incomplete'}, safe=False)

		path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
		path = os.path.join(path, "w21_cis4250_team_10")
		emails_csv_file = os.path.join(path, "emails.csv")

		email = request.POST['email'].split("@")
		if len(email) != 2:
			return JsonResponse({'result': 'invalid'}, safe=False)
		elif email[1] != 'uoguelph.ca':
			return JsonResponse({'result': 'invalid'}, safe=False)

		with open(emails_csv_file, newline='') as csvfile:
			reader = csv.reader(csvfile, delimiter=',')
			for row in reader:
				if len(row) >= 2 and row[0] == request.POST['email']:
					if row[1] == request.POST['course']:
						return JsonResponse({'result': 'duplicate'}, safe=False)

		with open(emails_csv_file, 'a', newline='\n') as emails_fd:

			# setup nodes file
			columns = ['email', 'course', 'availability', 'capacity']
			emails = csv.DictWriter(emails_fd, fieldnames=columns)

			row = {
				'email': request.POST['email'],
				'course': request.POST['course'],
				'availability': 0,
				'capacity': 0
			}
			emails.writerow(row)

		return JsonResponse({'status': 'OK'}, safe=False)


def specific(request):
	try:
		path = os.path.dirname(
			os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
		sys.path.append(path)
		from main import get_json
	except:
		path = os.path.join(path, "w21_cis4250_team_10/")
		sys.path.append(path)
		from main import get_json

	data = get_json()
	response = JsonResponse(json.dumps(data), safe=False)
	return response


def query(request, method, parameter, keywords):

	try:
		path = os.path.dirname(
			os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
		sys.path.append(path)
		from main import process_query
	except:
		path = os.path.join(path, "w21_cis4250_team_10/")
		sys.path.append(path)
		from main import process_query

	data = process_query(method, parameter, keywords)

	if method == 'search':
		result = []
		for course in data:
			c = {
				'id': course.id,
				'code': course.code,
				'title': course.title,
				'description': course.description,
				'prerequisites': course.prerequisites,
				'credit': course.credit,
				'semesters': course.semesters,
				'department': course.department,
				'equate': course.equate,
				'de': course.de,
				'availability': course.availability,
				'capacity': course.capacity,
			}
			result.append(c)
		response = JsonResponse(result, safe=False)
		return response

	elif method == 'json':
		response = JsonResponse(json.dumps(data), safe=False)
		return response
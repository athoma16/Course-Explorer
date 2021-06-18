import re, sys, os
from course import Course

#standard patterns
courseHeaderPattern = "^([A-Z]{2,4}\*\d{4}).*(\[\d\.\d\d\]s*)$"
prereqPattern = "Prerequisite\(s\)\:"
departmentPattern = "Department\(s\)\:"
dePattern = "Distance Education format"
offeringsPattern = "Offering\(s\)\:"
restrictionsPattern = "Restriction\(s\):"
equatesPattern = "Equate\(s\):"
coreqPattern = "Co\-requisite\(s\):"
codePattern = "[A-Z]{2,4}\*\d{4}"
semestersPattern = " (([SFWU](,[SFW]){0,2})|(P\d)) "
creditPattern = "\[\d\.\d\d\]"
hoursPattern = "(\(\d\-\d\))|\(V\-V\)"

#Unique prerequisite patterns
workExp = " or work experience in a related field."
orEquiv = " or equivalent$"
engg6 = "Registration in the BENG program and completion of 6.00 credits of ENGG courses including ENGG*2100"

def parse(filename):
    try:
        file = open(os.path.join((os.path.dirname(os.path.realpath(__file__))), filename), "r", encoding="utf-8")
        lines = file.readlines()
        file.close()
    except OSError:
        print ("Error, failed to open: ", filename)
        sys.exit()

    courses = []

    for i in range(1, len(lines)):
        #search for the first line of a course, which starts with a course code
        #and ends with the number of credits
        #e.g., ACCT*3350 Taxation S,F (3-0) [0.50]
        text = re.search(courseHeaderPattern, lines[i])
        if text:
            course = parseHeading(lines[i])
            course.description = ""
            course.de = False
            courses.append(course)

            #scan through the lines following the course header until a label
            #(such as "Prerequisite(s)") is found, adding each line to the course
            #description
            i = i + 1
            while(includeNextLine(lines[i])):
                course.description = course.description + re.sub("\n", " ", lines[i])
                i = i + 1

            #scan through the lines following the description until another
            #course header is found, adding each line to the appropriate variable
            finished = False
            while (i < len(lines)) and (not finished):
                #check for course header
                #if true, start the next loop
                if (re.search(courseHeaderPattern, lines[i])):
                    finished = True
                    i = i - 1

                #check for Prerequisite(s) label
                elif (re.search(prereqPattern, lines[i])):
                    #remove label
                    prerequisites = re.sub(prereqPattern, "", lines[i]).strip()

                    #continue adding to prerequisites until a new label is found
                    while(includeNextLine(lines[i+1])):
                        i = i + 1
                        prerequisites = prerequisites + " " + lines[i].strip()

                    prerequisites = removeIrrelevant(prerequisites)

                    course.prerequisites = prerequisites.split(", ")

                    for j in range(len(course.prerequisites)):
                        course.prerequisites[j] = course.prerequisites[j].strip()
                        course.prerequisites[j] = formatCredits(course.prerequisites[j])

                    course.prerequisites = formatCreditsWithList(course.prerequisites)

                    i = i + 1
                elif (re.search(departmentPattern, lines[i])):
                    lines[i] = re.sub(departmentPattern, "", lines[i])
                    course.department = lines[i].strip()
                    i = i + 1
                elif (re.search(offeringsPattern, lines[i])):
                    if(re.search(dePattern, lines[i])):
                        course.de = True
                    course.description = course.description + lines[i]
                    i = i + 1
                elif(re.search(equatesPattern, lines[i])):
                    equates = re.sub(equatesPattern, "", lines[i]).strip()
                    course.equate = lines[i].strip()
                    i = i + 1
                else:
                    i = i + 1

            #print("Course code = " + course.code)
            # print("title = " + course.title)
            # print("description = " + course.description)
            # print("prerequisites = ")
            #print(course.prerequisites)
            # print("credit = " + str(course.credit))
            # print("semesters = ")
            # print(course.semesters)
            # print("department = " + course.department)
            # print("de = " + str(course.de))
            # print()


    return courses




def parseHeading(line):

    #print(line)

    course = Course()
    #find the course code, formatted AAA(A)*####
    course.code = re.search(codePattern, line).group().strip()
    #find the semesters offered
    semesters = re.search(semestersPattern, line).group().strip()
    course.semesters = semesters.split(",")
    #get credits
    credit = re.search(creditPattern, line).group().strip()
    #remove square brackets
    credit = re.sub("\[", "", credit)
    credit = re.sub("\]", "", credit)
    course.credit = float(credit)

    #unneeded/used information is removed from the line to make isolating
    #the course title easier
    #remove the course code
    line = re.sub(codePattern, "", line)
    #remove semesters
    line = re.sub(semestersPattern, "", line)
    #remove hours/week
    line = re.sub(hoursPattern, "", line)
    #remove VETM specific notation
    #remove credits
    line = re.sub(creditPattern, "", line)

    #get course title
    course.title = line.strip()
    return course

#checks the given line for any labels, such as "Prerequisite(s)" or "Offering(s)"
#for the purposes of determining if a line should be included in the variable
#the parser is currently looking for
#returns True if there is no label, indicating that the line belongs in the current
#variable, or False if there is a label, indicating that the parser should move on
def includeNextLine(line):

    if re.search(courseHeaderPattern, line): return False
    if re.search(prereqPattern, line): return False
    if re.search(departmentPattern, line): return False
    if re.search(offeringsPattern, line): return False
    if re.search(restrictionsPattern, line): return False
    if re.search(equatesPattern, line): return False
    if re.search(coreqPattern, line): return False

    return True

#formats instances of prerequisites such as "5 credits" or "5.0 credits in business"
#to follow the standard format: "#.## credits [in department]"
def formatCredits(prereq):
    reqCredit = re.search("[0-9]*\.(00|50) credit", prereq)
    if reqCredit:
        reqDepName = ""
        number = prereq[reqCredit.start():5]
        if len(number) == 0:
            number = "0.00"
        reqDep = re.search("[0-9]*\.(00|50) credits in", prereq)
        if reqDep:
            reqDepName = "in " + prereq[reqDep.end():]
        prereq = number.strip() + " credits " + reqDepName.strip()

    elif re.search(engg6, prereq):
        prereq = re.sub(engg6, "['6 credits in ENGG','ENG*2100']", prereq)
    elif re.search("5.0 credits", prereq):
        prereq = re.sub("5.0 credits", " 5.00 credits", prereq)
    elif re.search("4.0 credits", prereq):
        prereq = re.sub("4.0 credits", "4.00 credits", prereq)


    return prereq

#removes prerequisite information deemed irrelevant for this program's purpose
#e.g., recommended courses, high school equivalencies, special circumstances, etc.
def removeIrrelevant(prerequisites):
    prerequisites = re.sub(workExp, "", prerequisites)
    prerequisites = re.sub(orEquiv, "", prerequisites)
    prerequisites = re.sub("including", ", ", prerequisites)

    return prerequisites

#re-formats a list of prerequisites that includes a specified number of credits
#and a list of courses
def formatCreditsWithList(prerequisites):
    new_prereqs = []
    new_p = []
    #For each courses' prerequisites
    for p in prerequisites:

        #If "credits" is referenced split the sentence on spaces
        if "credits" in p:
            new_p = p.split()

            #For each element in the split line, if there is a couse code, append to prereqs
            for element in new_p:
                if re.match(r'^-?\d+(?:\.\d+)$', element) is not None:
                    new_prereqs.append(element)

                #If there is a credit total, append to prereqs
                if re.match(r'[A-Z]{2,4}\*\d{4}', element) is not None:
                    new_prereqs.append(element)

            #Assign re-structured list of prereqs
            prerequisites.clear()
            for i in new_prereqs:
                prerequisites.append(i)

    return prerequisites

import re, sys
import codecs
import csv
from course import Course
from html.parser import HTMLParser

class HTML_Data_Parser(HTMLParser):

    def __init__(self):
        self.d = []
        super().__init__()

    def handle_text(self, textdata):
        for course in textdata:
            
            # Create indicies to hold table data
            indices = []
            for i, elem in enumerate(self.d):
                
                # Add found course code to indices
                if course.code in elem:
                    indices.append(i)
                    
            #goes through multiple sections and adds aailability/capacities together                                                                                                                    
            for i in indices:
                if self.d[i+1].isdigit():
                    course.availability = course.availability + int(self.d[i+1])
                if self.d[i+2].isdigit():
                    course.capacity = course.capacity + int(self.d[i+2])

        # Final list of course objects returned
        return textdata

    def handle_data(self, data):
        
        # If the data contains a course code
        if "*" in data:                                              
            split = data.split(" ")
            
        # Grab current course code
            current_course = split[0]  
            self.d.append(current_course)

        # If the data contains availability and capacity for the course 
        if "/" in data:                                             
            avail_cap = data.split(" ")

            # Split the data and grab availability and capacity 
            if len(avail_cap) == 3:
                self.d.append(avail_cap[0])
                self.d.append(avail_cap[2])

    def return_data(self):
        return self.d





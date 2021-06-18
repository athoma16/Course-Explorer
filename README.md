# W21 CIS42650 Team 10 - Sprint 9

## Project Description

Python Course Explorer

## Requirements

* Python 3.7+  
* Gephi 0.9.2  
* Firefox >= 60
* Selenium 3.141.0
* List of courses (see below for more details)

## Usage

**Web App:**

API:

To fetch all courses: cis4250-10.socs.uoguelph.ca/api/

To fetch specific courses: cis4250-10.socs.uoguelph.ca/api/search/[parameter]/[keywords]/
_ eg: cis4250-10.socs.uoguelph.ca/api/search/title/computer/ _

Index page (react-powered): https://cis4250-10.socs.uoguelph.ca/static/index.html

A wireframe prototype based on current functionality (searching using a single parameter) can be found here: https://xd.adobe.com/view/22f99bef-4c92-4dde-86a0-5cf8a16b9640-77aa/

A wireframe prototype based on future goals of more advanced and user-friendly search functionality can be found here: https://xd.adobe.com/view/75527548-631a-4fd1-8364-dbb83a48e01d-2001/


**Installation:**

From the Frontend_react_UI folder:

```
npm install
npm run dist
```
A Windows, Linux, or Mac OS executable will be placed in the build folder. As of now the app only supports building for the OS you are running because cross-platform building with electron-builder doesn't fully work (Windows can't build for Mac, Linux can't build for Windows).

If building fails, try deleting the node-modules folder, then running npm install and npm run dist again.

**D3 demo**

To view the D3 demo on Observable, go to https://observablehq.com/d/319c11937770c6a7
This demo uses a complete list of courses. To see how it works with a smaller list of courses:
1. run the command line app
2. use the 'json' command with the desired parameter, e.g., 'json code cis'
3. return to the D3 demo, click on the file attachments, and replace data.json with the new file
4. if the graph doesn't update automatically, scroll down to the first cell and click the "run cell" button

**Command Line App:**

    python main.py [datafile.txt]

Once in the interactive section of the program, you may query the dataset using:

    > search [parameter] [query]

Or export the data as two _gephi friendly_ CSV files (**nodes.csv** and **edges.csv**)
using:  
_note: use 'export' to export all courses, or 'export (paramater) (query)' to export specific courses._

    > export [parameter] [query]

Find extra help with:

    > help


### Generating Undergraduate calendar txt file.

Download the official '2020-2021 Undergraduate Calendar' PDF from:
https://www.uoguelph.ca/registrar/calendars/undergraduate/current/c12/index.shtml

The PDF file will need to be converted into a text file. Do not use any of the
online PDF to TEXT converter as they all differ in formatting -- especially how
they format tables.

Use pdftotext available for linux to convert the PDF.

Use pdftotext with the flags `-nopgbrk` and `-raw`. eg:

    pdftotext -nopgbrk -raw data.pdf data.txt

##### To assert that the conversation was successful, you can do a quick visual inspection.
##### For each course, you should see the following format:


_(course code)_ _(course title)_  

_(description)_  

Prerequisite(s):  _(list of courses)_  

Restriction(s):  _(list of courses)_

Department(s): _(department)_

## Visualizations with Gephi



##### Sprint 3 - Capacity & Availability Graph - availability.gephi
This visualization focuses on the contrast between the capacity of each course and it's availability. The size represents the capacity of the course and the colour represents it's availability where red courses are full, and shades of red indicate that some room is available. The lighter the colour, the more room is available.  
To recreate:
- In a new project, import the nodes.csv and edges.csv files
- Navigate to the 'Overview tab'
- Focus the 'Appearance' tab
- Under 'Nodes', select 'Ranking'
- Select 'capacity'
- Select colour or use the default one
- Click 'Apply'

##### Sprint 3 - Capacity & Availability Graph - availability2.gephi
Alternate visualization showing the capacity of a course and how full that course is. The larger a course is, the larger the node will be. Course availability is shown on a green-orange-red gradient, with pure green courses being 0% full, pure orange courses being 50% full, and pure red courses being 100% full.
To recreate:
- In a new project, import the nodes.csv and edges.csv files
- Navigate to the 'Overview' tab
- Select the 'Appearance' tab
- Change the node colour to ranking > %full and adjust the colours used in the gradient
- Change node size to ranking > capacity, set min size to 50 and max size to 300
- The layout was created running the Yifan Hu, Force Atlas, ForceAtlas2, Expand, Contract, and Label Adjust layouts until the desired layout was achieved

##### Sprint 2 - Department Graph - department.gephi
This visualization focuses on the connections between courses, clustering course nodes by department and showing the various prerequisite paths for each course. Each department has a unique colour.
To recreate:
- In a new project, import the nodes.csv and edges.csv files
- Navigate to the 'Overview tab'
- Focus the 'Appearance' tab
- Under 'Nodes', select 'Partition'
- Select 'department'
- Select colour for each department or use the default colour
- Click 'Apply'

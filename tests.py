import pytest, sys
from textparser import parse
from course import Course
from commands import Commands

validFile = "data.txt"


@pytest.fixture
def parse_courses(scope="session"):
    """
    This fixture runs once per test suite, parsing the text file for use in subsequent tests.
    """
    courses = parse(validFile)
    return courses

    
def test_parse(parse_courses):
    """
    Tests the parsing of a text file.
    Assumes the file is properly formatted and contains the course CIS*1500.
    """
    courses = parse_courses
    cis1500 = next((x for x in courses if x.code == "CIS*1500"), None)
    assert cis1500 is not None, "Parsing did not work, course CIS*1500 was not found in the parsed courses."


@pytest.mark.parametrize("search_input, expected", 
[
    ("microcomputers", "Structure and Application of Microcomputers"),
    ("DATA STRUCTURES", "Data Structures"),
    ("interface ", "User Interface Design")
])
def test_search_single_title(search_input, expected, parse_courses):
    """
    Tests searching for a single particular course title.
    """
    courses = parse_courses
    searchresult = Commands().title(courses, "search", search_input)
    assert searchresult[0].title == expected


def test_search_multiple_titles(parse_courses):
    """
    Tests searching for a partial title that returns multiple results.
    """
    courses = parse_courses
    searchresult = Commands().title(courses, "search", "programming")

    assert any (x for x in searchresult if x.title == "Intermediate Programming"), "Did not find course 'Intermediate Programming' in search results."
    assert any (x for x in searchresult if x.title == "Game Programming"), "Did not find course 'Game Programming' in search results."

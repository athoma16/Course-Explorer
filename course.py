from typing import List


class Course(object):
	"""
	Members are purposely left vague -- just a starting point.
	"""
	id: int = None
	code: str = None
	title: str = None
	description: str = None
	prerequisites: List[str] = []
	credit: float = 0.0
	semesters: List[str] = []
	department: str = None
	equate: List[str] = []
	de: bool = None
	availability: int = 0
	capacity: int = 0

	def __repr__(self):
		return f"{self.id}: {self.code} ({self.semesters}) - {self.title}"

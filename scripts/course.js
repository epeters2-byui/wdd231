const courses = [
  { code: "CSE 110", category: "cse", credits: 2, completed: false },
  { code: "CSE 111", category: "cse", credits: 2, completed: true },
  { code: "CSE 210", category: "cse", credits: 3, completed: false },
  { code: "WDD 130", category: "wdd", credits: 2, completed: true },
  { code: "WDD 131", category: "wdd", credits: 2, completed: false },
  { code: "WDD 231", category: "wdd", credits: 3, completed: false }
];

const container = document.getElementById("course-container");
const totalCredits = document.getElementById("total-credits");

function filterCourses(filter) {
  container.innerHTML = ""; // Clear course list
  let filteredCourses = [];

  if (filter === "all") {
    filteredCourses = courses;
  } else {
    filteredCourses = courses.filter(course => course.category === filter);
  }

  let total = 0;

  filteredCourses.forEach(course => {
    const courseDiv = document.createElement("div");
    courseDiv.textContent = `${course.code} - ${course.credits} credits`;
    courseDiv.className = "course";

    if (course.completed) {
      courseDiv.classList.add("completed");
    }

    container.appendChild(courseDiv);
    total += course.credits;
  });

  totalCredits.textContent = total;
}

// Show all courses on first load
filterCourses('all');

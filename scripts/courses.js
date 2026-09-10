// courses.js - Course data and filtering

const courses = [
    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 3,
        completed: true
    },
    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 231,
        title: "Web Frontend Development I",
        credits: 2,
        completed: false
    },
    {
        subject: "CSE",
        number: 110,
        title: "Programming Building Blocks",
        credits: 2,
        completed: false
    },
    {
        subject: "CSE",
        number: 111,
        title: "Programming with Functions",
        credits: 2,
        completed: false
    },
    {
        subject: "CSE",
        number: 210,
        title: "Programming with Classes",
        credits: 2,
        completed: false
    }
];

const courseContainer = document.querySelector("#courseContainer");
const totalCredits = document.querySelector("#totalCredits");

const filterButtons = {
    all: document.querySelector("#allCourses"),
    wdd: document.querySelector("#wddCourses"),
    cse: document.querySelector("#cseCourses")
};

function displayCourses(courseList) {
    if (!courseContainer) return;
    
    courseContainer.innerHTML = "";

    courseList.forEach((course) => {
        const card = document.createElement("article");
        card.classList.add("course-card");

        if (course.completed) {
            card.classList.add("completed");
        }

        card.innerHTML = `
            <div class="course-code">${course.subject} ${course.number}</div>
            <div class="course-name">${course.title}</div>
            <div class="course-credits">${course.credits} Credits</div>
            <div class="course-status">
                ${course.completed ? '✅ Completed' : '⏳ Not Completed'}
            </div>
        `;

        courseContainer.appendChild(card);
    });

    const credits = courseList.reduce(
        (total, course) => total + course.credits,
        0
    );

    if (totalCredits) {
        totalCredits.textContent = credits;
    }
}

function setActiveButton(activeButton) {
    Object.values(filterButtons).forEach((button) => {
        if (button) button.classList.remove("active");
    });

    if (activeButton) {
        activeButton.classList.add("active");
    }
}

// Event Listeners
if (filterButtons.all) {
    filterButtons.all.addEventListener("click", () => {
        displayCourses(courses);
        setActiveButton(filterButtons.all);
    });
}

if (filterButtons.wdd) {
    filterButtons.wdd.addEventListener("click", () => {
        const wddCourses = courses.filter(
            (course) => course.subject === "WDD"
        );
        displayCourses(wddCourses);
        setActiveButton(filterButtons.wdd);
    });
}

if (filterButtons.cse) {
    filterButtons.cse.addEventListener("click", () => {
        const cseCourses = courses.filter(
            (course) => course.subject === "CSE"
        );
        displayCourses(cseCourses);
        setActiveButton(filterButtons.cse);
    });
}

// Display all courses when the page first loads
displayCourses(courses);
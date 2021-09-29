// Variables
let taskList = [
	{
		title: "Bad summary here",
		description: "None",
		completed: false
	}, {
		title: "Short summary here",
		description: "None",
		completed: true
	}, {
		title: "Good summary here",
		description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente voluptates veritatis, commodi maiores tenetur placeat praesentium. Sunt praesentium voluptates corrupti dolorum. Dolorum, corrupti laborum.",
		completed: false
	}, {
		title: "Unique summary",
		description: "You must use unique titles for tasks!",
		completed: false
	}
]

const overlayTitleList = ["Clear completed tasks", "Clear all tasks", "Delete task", "Add task", "Edit task"]
const overlayPromptList = ["Are you sure you want to clear the completed tasks?", "Are you sure you want to clear all the tasks?", "Are you sure you want to delete this task?"]
const overlayActionList = ["Yes", "No", "Add", "Edit", "Cancel"]

let overlayConfirmID = 0 // Value of action of the confirm button

let currentCategory = 0 // Index of the current category
let currentTask = 0 // Index of the current task

let searchedTask = ""


// Functions
// Overlay functions
// Toggle on/off the display of the overlay
const overlayDisplayState = (isOpen) => {
	(isOpen) ? overlayBody.style.display = "block" : overlayBody.style.display = "none"
}

// Function for displaying the following: (Clear completed, Clear all, Delete task)
const overlayPromptState = (id) => {
	// Switch the displays of prompt overlay and task overlay
	overlayPrompt.style.display = "block"
	overlayTask.style.display = "none"

	// Switch the labels of the actions buttons
	buttonOverlayConfirm.textContent = "Yes"
	buttonOverlayCancel.textContent = "No"

	// Switch the labels of each actions (Clear completed, Clear all, Delete task)
	switch (id) {
		case 0:
			overlayTitle.textContent = overlayTitleList[0]
			overlayPrompt.textContent = overlayPromptList[0]
			break
		case 1:
			overlayTitle.textContent = overlayTitleList[1]
			overlayPrompt.textContent = overlayPromptList[1]
			break
		case 2:
			overlayTitle.textContent = overlayTitleList[2]
			overlayPrompt.textContent = overlayPromptList[2]
			break
	}
}

// Function for displaying the following: (Add task, ***Edit task)
const overlayTaskState = (id) => {
	// Switch between the displays of prompt overlay and task overlay
	overlayPrompt.style.display = "none"
	overlayTask.style.display = "flex"

	// Switch the labels of the actions buttons
	buttonOverlayCancel.textContent = "Cancel"

	// Switch the labels of each actions (Add task, ***Edit task)
	switch (id) {
		case 0:
			overlayTitle.textContent = overlayTitleList[3]
			buttonOverlayConfirm.textContent = "Add"
			break
		case 1:
			overlayTitle.textContent = overlayTitleList[4]
			buttonOverlayConfirm.textContent = "Edit"
			break
	}
}

const overlayAlertState = (id) => {
	overlayAlertBody.style.display = "flex"

	switch (id) {
		case 0:
			overlayAlertText.textContent = "Empty field."
			break
		case 1:
			overlayAlertText.textContent = "Task already exists."
	}
}


// Table functions
// Actions for the confirmation button (Add Task, Edit Task, Clear Actions)
const actionConfirm = (id) => {
	switch (id) {
		case 4:
			// Check if the title is empty
			if (!textTitle.value.trim()) {
				overlayAlertState(0)
				return
			}

			// Check if the title already exists
			if (taskList.filter(task => task.title.toLowerCase() == textTitle.value.trim().toLowerCase()).length > 0) {
				overlayAlertState(1)
				return
			}

			// Check if the description is empty
			if (!textDescription.value.trim()) {
				textDescription.value = "None"
			}

			// Initializing the data for the table
			let taskData = { title: `${textTitle.value}`, description: `${textDescription.value}`, completed: false }

			// Add task to list
			taskList.push(taskData)

			// Switch back to the All category after adding a task (except if you're in Active)
			if (currentCategory != 1) currentCategory = 0

			break
		case 5:
			// Check if the title is empty
			if (!textTitle.value.trim()) {
				overlayAlertState(0)
				return
			}

			// Check if the title already exists (Ignore check on own title)
			if (taskList.filter(task => task.title.toLowerCase() == textTitle.value.trim().toLowerCase() && task != taskList[currentTask]).length > 0) {
				overlayAlertState(1)
				return
			}

			// Check if the description is empty
			if (!textDescription.value.trim()) {
				textDescription.value = "None"
			}

			// Edit info of task
			taskList[currentTask].title = textTitle.value
			taskList[currentTask].description = textDescription.value
			break
		default:
			actionClear(id)
	}

	// Clear inputs after confirming
	textTitle.value = ""
	textDescription.value = ""

	// Hiding the overlay alert after confirming
	overlayAlertBody.style.display = "none"

	overlayDisplayState(false)
	updateData()
}

// Actions related to clearing tasks from the table (Clear completed, Clear All, Delete Task)
const actionClear = (id) => {
	switch (id) {
		case 0:
			taskList = taskList.filter(task => !task.completed)
			break
		case 1:
			taskList = []
			break
		case 2:
			taskList.splice(currentTask, 1)
			break
	}
}

// Simple checkbox function :)
const actionCheck = () => {
	(taskList[currentTask].completed == true) ? taskList[currentTask].completed = false : taskList[currentTask].completed = true
	updateData()
}


// Update functions
// Fetch data from the list and update the table
const updateData = () => {
	// Initializing the table
	tableBody.innerHTML = ""

	// Initialize the content of the rows of the table
	let tableRow = ""
	let tableActions = `<td class="task-actions"><button class="btn-edit">📝</button><button class="btn-delete">🗑️</button></td>`

	taskList.forEach((taskKey, index) => {
		// Handling categories
		switch (currentCategory) {
			case 1:
				if (taskKey.completed) return
				break
			case 2:
				if (!taskKey.completed) return
				break
			case 3:
				if (!taskKey.title.toLowerCase().includes(searchedTask)) return
		}

		// Reinitialize the table row
		tableRow = document.createElement("tr")

		// Assigning an ID to the task
		tableRow.setAttribute("task-id", index)

		if (taskKey.completed) {
			tableCheck = `<td class="task-check"><input type="checkbox" checked></td>`
		} else {
			tableCheck = `<td class="task-check"><input type="checkbox"></td>`
		}

		tableRow.innerHTML += tableCheck + `<td class="task-title">${taskKey.title}</td>` + `<td class="task-description">${taskKey.description}</td>` + tableActions

		tableBody.appendChild(tableRow)
	})

	// Empty table (mostly for styling)
	if (!tableBody.hasChildNodes()) {
		tableBody.parentNode.parentNode.classList.add("table-empty")
		console.log("Empty table")
	} else {
		tableBody.parentNode.parentNode.classList.remove("table-empty")
	}

	updateTableEvents()
	updateCategory(currentCategory)
	updateNavBar(currentCategory)
}

const updateTableEvents = () => {
	// Selecting elements and applying click events for the actions
	const buttonTaskEdit = document.querySelectorAll(".btn-edit")
	const buttonTaskDelete = document.querySelectorAll(".btn-delete")
	const checkboxTask = document.querySelectorAll(".task-check > input")

	buttonTaskEdit.forEach(e => {
		e.addEventListener("click", () => {
			currentTask = e.parentNode.parentNode.getAttribute("task-id")
			textTitle.value = taskList[currentTask].title;
			(taskList[currentTask].description == "None") ? textDescription.value = "" : textDescription.value = taskList[currentTask].description

			overlayConfirmID = 5
			overlayDisplayState(true)
			overlayTaskState(1)
		})
	})

	buttonTaskDelete.forEach(e => {
		e.addEventListener("click", () => {
			currentTask = e.parentNode.parentNode.getAttribute("task-id")
			overlayConfirmID = 2
			overlayDisplayState(true)
			overlayPromptState(2)
		})
	})

	checkboxTask.forEach(e => {
		e.addEventListener("click", () => {
			currentTask = e.parentNode.parentNode.getAttribute("task-id");
			actionCheck()
		})
	})
}

const updateCategory = (id) => {
	// Return the total amount of tasks in each categories
	let categoryTaskCount = [0, 0, 0]

	categoryTaskCount[0] = `All (${taskList.length})`
	categoryTaskCount[1] = `Active (${taskList.filter(task => !task.completed).length})`
	categoryTaskCount[2] = `Completed (${taskList.filter(task => task.completed).length})`

	// Update the non-selected categories
	categoryTaskList.textContent = ""

	categoryTaskCount.forEach((category, index) => {
		if (id != index) {
			categoryTaskList.innerHTML += `<li category-id="${index}">${category}</li>`
		}
	})

	// Update the current category display
	switch (id) {
		case 0:
			categoryTaskSelected.textContent = `${categoryTaskCount[0]}`
			break
		case 1:
			categoryTaskSelected.textContent = `${categoryTaskCount[1]}`
			break
		case 2:
			categoryTaskSelected.textContent = `${categoryTaskCount[2]}`
			break
		case 3:
			categoryTaskSelected.textContent = `Search (${taskList.filter(task => task.title.toLowerCase().includes(searchedTask)).length})`
			break
	}

	updateCategoryEvents()
}

const updateCategoryEvents = () => {
	// Get all the items in the drop down menu
	categoryTaskListItems = document.querySelectorAll(".task-category-list > li")

	categoryTaskListItems.forEach(item => {
		item.addEventListener("click", () => {
			// Get the ID of the category clicked in the drop down menu and refresh
			currentCategory = parseInt(item.getAttribute("category-id"))

			updateData()
		})
	})
}

const updateNavBar = (id) => {
	switch (id) {
		case 0:
			buttonClear.style.display = "inline-block"
			buttonClearAll.style.display = "inline-block"
			break
		case 1:
			buttonClear.style.display = "none"
			buttonClearAll.style.display = "inline-block"
			break
		case 2:
			buttonClear.style.display = "inline-block"
			buttonClearAll.style.display = "none"
			break
		case 3:
			buttonClear.style.display = "none"
			buttonClearAll.style.display = "none"
			break
	}
}


// Selecting all the elements
// Navbar elements
const buttonClear = document.querySelector("#btn-clear")
const buttonClearAll = document.querySelector("#btn-clear-all")
const buttonSearch = document.querySelector("#btn-search")
const textSearch = document.querySelector("#txt-search")

// Task category elements
const categoryTaskList = document.querySelector(".task-category-list")
const categoryTaskSelected = document.querySelector(".task-category-selected")

// Table elements
const tableBody = document.querySelector(".task-table-body")

// Task elements
const buttonTaskAdd = document.querySelector("#btn-add")

// Overlay elements
const overlayBody = document.querySelector(".overlay")
const overlayTitle = document.querySelector(".overlay-title")
const overlayPrompt = document.querySelector(".overlay-content-prompt")
const overlayTask = document.querySelector(".overlay-content-task")

// Overlay alert
const overlayAlertBody = document.querySelector(".overlay-alert")
const overlayAlertText = document.querySelector(".overlay-alert-text")
const buttonOverlayAlertClose = document.querySelector(".overlay-alert-close")

// Overlay fields
const textTitle = document.querySelector("#txt-title")
const textDescription = document.querySelector("#txt-description")

// Overlay buttons
const buttonOverlayConfirm = document.querySelector("#btn-overlay-confirm")
const buttonOverlayCancel = document.querySelector("#btn-overlay-cancel")


// Click events on each elements
// Overlay click events
buttonOverlayConfirm.addEventListener("click", () => {
	actionConfirm(overlayConfirmID)
})

buttonOverlayCancel.addEventListener("click", () => {
	overlayDisplayState(false)
	textTitle.value = ""
	textDescription.value = ""
	overlayAlertBody.style.display = "none"
})

buttonOverlayAlertClose.addEventListener("click", () => {
	overlayAlertBody.style.display = "none"
})

// Navbar click events
buttonClear.addEventListener("click", () => {
	overlayDisplayState(true)
	overlayPromptState(0)
	overlayConfirmID = 0
})

buttonClearAll.addEventListener("click", () => {
	overlayDisplayState(true)
	overlayPromptState(1)
	overlayConfirmID = 1
})

buttonSearch.addEventListener("click", () => {
	searchedTask = textSearch.value.toLowerCase()
	currentCategory = 3
	textSearch.value = ""
	updateData()
})

// Task click events
buttonTaskAdd.addEventListener("click", () => {
	overlayDisplayState(true)
	overlayTaskState(0)
	overlayConfirmID = 4
})


// Start up
updateData()
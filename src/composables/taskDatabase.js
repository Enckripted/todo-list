import { ref, watch } from 'vue'

const taskId = ref(0)
const taskStreak = ref(0)
const tasks = ref([])

function pullTasksFromDb() {
  let data = JSON.parse(localStorage.getItem("data"))
  if (data) {
    console.log("parsed save, got:", data.tasks)

    for (let task of data.tasks) {
      taskId.value = Math.max(task.id + 1, taskId.value)
      task.deadline = new Date(task.deadline) //turn our deadlines back into date objects
    }
    taskStreak.value = data.streak
    tasks.value = data.tasks
  }
  checkAllLateTasks()
}

function saveTasksToDb() {
  console.log("saving tasks to db:", tasks.value)
  localStorage.setItem("data", JSON.stringify({
    streak: taskStreak.value,
    tasks: tasks.value
  }))
}

function addTask(taskDescription, taskDone, taskDeadline) {
  let newTask = {
    id: taskId.value++,
    description: taskDescription,
    deadline: taskDeadline,
    done: taskDone,
    late: false,
  }

  console.log("adding task:", newTask)
  tasks.value.push(newTask)
  checkAllLateTasks()
}

function removeTask(id) {
  console.log("removing task with id", id, "with value", tasks.value.find((task) => task.id == id))
  tasks.value = tasks.value.filter((task) => task.id != id)
}

function checkAllLateTasks() {
  console.log("checking late")
  for (let task of tasks.value) {
    if (!task.late && task.deadline - new Date() < 0) {
      taskStreak.value = 0
      task.late = true
    }
  }
}

watch(tasks, () => {
  saveTasksToDb()
}, { deep: true }) //refs are not deeply watched by default, and we can't change tasks to reactive because we use filter for removing tasks

pullTasksFromDb()

export function useTaskDatabase() {
  return { taskStreak, tasks, addTask, removeTask, checkAllLateTasks }
}

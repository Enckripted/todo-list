import { onMounted, ref, watch } from 'vue'

export function useTaskDatabase() {
  const taskId = ref(0)
  const tasks = ref([])

  function pullTasksFromDb() {
    let data = JSON.parse(localStorage.getItem("data"))
    if (data) {
      console.log("parsed save, got:", data.tasks)
      for (let task of data.tasks) {
        task.deadline = new Date(task.deadline) //turn our deadlines back into date objects
      }
      tasks.value = data.tasks
    }
    console.log("couldn't find any database data, starting empty")
  }

  function saveTasksToDb() {
    console.log("saving tasks to db:", tasks.value)
    localStorage.setItem("data", JSON.stringify({
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
  }

  function removeTask(id) {
    console.log("removing task with id", id, "with value", tasks.value.find((task) => task.id == id))
    tasks.value = tasks.value.filter((task) => task.id != id)
  }

  watch(tasks, () => saveTasksToDb)

  onMounted(() => {
    pullTasksFromDb()
  })

  return { tasks, addTask, removeTask }
}

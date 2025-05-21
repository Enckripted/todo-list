<script setup>
import { ref, computed, onMounted } from 'vue';

import ListItem from './components/ListItem.vue'
import TaskModal from './components/TaskModal.vue'

const id = ref(0)
const tasks = ref([])

const incompleteTasks = computed(() => {
  return tasks.value.filter((task) => !task.taskDone).sort((a, b) => a.deadline - b.deadline)
})
const completeTasks = computed(() => {
  return tasks.value.filter((task) => task.taskDone).sort((a, b) => a.deadline - b.deadline)
})

function addTask(taskDescription, taskDone, deadline) {
  let newTask = {
    id: id.value++,
    taskDescription: taskDescription,
    taskDone: taskDone,
    deadline: deadline,
    late: false,
  }
  tasks.value.push(newTask)
  checkAllLateTasks()
}

function removeTask(id) {
  tasks.value = tasks.value.filter((task) => task.id == id)
}

function checkAllLateTasks() {
  console.log("checking late")
  for (let task of tasks.value) {
    if (!task.late && task.deadline - new Date() < 0) {
      task.late = true
    }
  }
}

function getDeadlineText(deadline) {
  let current = new Date()
  let datesInSameMonth = current.getFullYear() == deadline.getFullYear() && current.getMonth() == deadline.getMonth()

  let dateString = deadline.toLocaleString([], { year: "numeric", month: "numeric", day: "numeric" })
  let timeString = deadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  if (datesInSameMonth && current.getDate() == deadline.getDate()) {
    return "Today - " + timeString
  }
  if (datesInSameMonth && current.getDate() + 1 == deadline.getDate()) {
    return "Tomorrow - " + timeString
  }
  return dateString + " - " + timeString
}

onMounted(() => {
  setTimeout(() => {
    checkAllLateTasks()
    setInterval(() => {
      checkAllLateTasks()
    }, 60000)
  }, Date.now() % 60000)
})

</script>

<template>
  <div class="content">
    <h1>Todo List</h1>
    <h3>Task Completion Streak: 0</h3>

    <TaskModal @submit-modal="addTask" />

    <div v-for="task in [...incompleteTasks, ...completeTasks]" :key="task.id" class="items">
      <ListItem v-model="task.done" :id="task.id" :deadline="getDeadlineText(task.deadline)" :late="task.late"
        @delete-item="removeTask">
        {{ task.taskDescription }}
      </ListItem>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

body {
  font-family: "Nunito";
  background-color: #222222;
}

button {
  display: inline-block;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0;
  text-decoration: none;
  background: #ffffff;
  color: #000000;
  font-family: "Nunito", sans-serif;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  text-align: center;
  font-family: "Nunito";
}

h1,
h2,
h3 {
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
  font-family: "Inter";
  color: #00962d;
}

h1 {
  font-size: 48px;
}

h3 {
  color: #d2d2d2;
}
</style>

<style scoped>
.content {
  width: 600px;
  margin: auto;
  margin-top: 20px;
  text-align: center;
}
</style>

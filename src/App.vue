<script setup>
import { computed, onMounted } from 'vue'
import { useTaskDatabase } from './composables/taskDatabase'

import ListItem from './components/ListItem.vue'
import TaskModal from './components/TaskModal.vue'

const { taskStreak, tasks, checkAllLateTasks } = useTaskDatabase()

let alreadyMounted = false //for dev purposes

const incompleteTasks = computed(() => {
  return tasks.value.filter((task) => !task.taskDone).sort((a, b) => a.deadline - b.deadline)
})
const completeTasks = computed(() => {
  return tasks.value.filter((task) => task.taskDone).sort((a, b) => a.deadline - b.deadline)
})

function getDeadlineText(deadline) {
  let current = new Date()
  let datesInSameMonth = current.getFullYear() == deadline.getFullYear() && current.getMonth() == deadline.getMonth()

  let dateString = deadline.toLocaleString([], { year: "numeric", month: "numeric", day: "numeric" })
  let timeString = deadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  if (datesInSameMonth && current.getDate() == deadline.getDate()) {
    return "Today - " + timeString
  } else if (datesInSameMonth && current.getDate() + 1 == deadline.getDate()) {
    return "Tomorrow - " + timeString
  }
  return dateString + " - " + timeString
}

onMounted(() => {
  //run checkAllLateTasks at the end of every minute
  if (alreadyMounted)
    return
  alreadyMounted = true

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
    <h3>Task Completion Streak: {{ taskStreak }}</h3>

    <TaskModal />

    <div v-for="task in [...incompleteTasks, ...completeTasks]" :key="task.id" class="items">
      <ListItem v-model="task.done" :id="task.id" :deadline="getDeadlineText(task.deadline)" :late="task.late">
        {{ task.description }}
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

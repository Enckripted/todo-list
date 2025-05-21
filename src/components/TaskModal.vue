<script setup>
import { ref } from 'vue';
const emit = defineEmits(['submitModal'])

function convertToHtmlInputDate(year, month, day) {
  //note: months in javascript are zero-indexed
  return `${year}-${month < 9 ? "0" : ""}${month + 1}-${day}`
}

const showModal = ref(false)

const taskDescription = ref("")
const taskDate = ref("")
const taskTime = ref("")

function openModal() {
  let currentDate = new Date()
  if (!taskDate.value)
    taskDate.value = convertToHtmlInputDate(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
  if (!taskTime.value)
    taskTime.value = "23:59"

  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function submitModal() {
  //TODO: check if part of this if statement is needed (can date and time values be invalid and cause problems?)
  if (taskDescription.value && taskDate.value && taskTime.value)
    emit('submit-modal', taskDescription.value, false, new Date(`${taskDate.value} ${taskTime.value}`))
  closeModal()
}
</script>

<template>
  <button class='open-modal-btn' @click="openModal">Add Task</button>

  <Teleport to="body">
    <div v-if="showModal" class="modal-bg"></div>
    <div v-if="showModal" class="modal">
      <button class='close-modal-btn' @click="closeModal">X</button>

      <h2>Create Task</h2>

      <input class="task-description" type="text" placeholder="Enter your task here..." v-model="taskDescription" />

      <label>Due by: </label>
      <input type="date" v-model="taskDate">
      <input type="time" v-model="taskTime">

      <button class="submit-btn" @click="submitModal">Add Task</button>
    </div>
  </Teleport>
</template>

<style scoped>
.modal input {
  margin-bottom: 20px;
}

.modal {
  position: absolute;
  left: 50%;
  top: 30%;
  width: 450px;
  margin-left: -225px;
  padding-bottom: 20px;
  z-index: 1000;

  text-align: center;
  background-color: #424242;
  border-radius: 12px;
}

.modal-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;

  background-color: #000000;
  opacity: 0.5;
}

.close-modal-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  padding: 0;
}

.task-description {
  width: 420px;
  height: 50px;
}

.submit-btn,
.open-modal-btn {
  display: block;
  margin: auto;
}
</style>

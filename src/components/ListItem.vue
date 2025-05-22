<script setup>
import { computed, watch } from 'vue'
import { useTaskDatabase } from '@/composables/taskDatabase'

const done = defineModel()
const { id, deadline, late } = defineProps(['id', 'deadline', 'late'])
const { taskStreak, removeTask } = useTaskDatabase()

const isLate = computed(() => {
  return !done.value && late
})

watch(done, () => {
  if (late) //late tasks dont count towards a streak (don't use isLate because that factors in whether the task is done)
    return
  taskStreak.value += done.value ? 1 : -1 //change based on whether toggling on or off
})

</script>

<template>
  <div class='list-item'>
    <div class='list-item-check'>
      <input type="checkbox" v-model="done" />
    </div>
    <div class='list-item-text' :class="{ done: done, late: isLate }">
      <span style="text-align: left;" class="list-item-inner">
        <slot></slot>
      </span>
      <span>{{ deadline }}</span>
    </div>

    <span class="list-item-delete underline" @click="() => { removeTask(id) }">Delete</span>
  </div>
</template>

<style>
.list-item,
.list-item-check {
  display: flex;
  align-items: center;
}

.list-item {
  column-gap: 10px;
  margin-top: 10px;
  color: #ffffff;
}

.list-item-text {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.list-item-delete {
  margin-left: auto;
  margin-right: 0;
  cursor: pointer;
  text-decoration: underline;
}

.done {
  text-decoration: line-through;
}

.late {
  color: red;
}
</style>

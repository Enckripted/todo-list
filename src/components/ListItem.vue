<script setup>
import { computed, onMounted } from 'vue'
const { id, deadline, late } = defineProps(['id', 'deadline', 'late'])
const done = defineModel()
const emit = defineEmits(["delete-item"])

const isLate = computed(() => {
  return !done.value && late
})

function deleteItem() {
  emit("delete-item", id) //figure out why this happens in the first place
}

onMounted(() => console.log(id))
</script>

<template>
  <div class='list-item'>
    <div class='list-item-check'>
      <input type="checkbox" v-model="done" />
    </div>
    <div class='list-item-text' :class = "{ strikethrough: done, late: isLate }">
      <span class = "list-item-inner">
        <slot></slot>
      </span>
      <span>{{ deadline }}</span>
    </div>

    <span class="list-item-delete underline" @click="deleteItem">Delete</span>
  </div>
</template>

<style>
.list-item {
  display: flex;
  align-items: center;
  column-gap: 10px;
  margin-top: 10px;
  color: #ffffff;
}

.list-item-check {
  display: flex;
  align-items: center;
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
}

.list-item-inner {
  text-align: left;
}

.strikethrough {
  text-decoration: line-through;
}

.underline {
  text-decoration: underline;
}

.late {
  color: red;
}
</style>

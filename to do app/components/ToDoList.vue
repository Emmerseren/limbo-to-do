<template>
  <draggable
    class="listGroup"
    item-key="id"
    :list="toDoList"
    name= "!drag ? 'flip-list' : null"
  
    v-bind="dragOptions"
    @start="drag = true"
    @end="handleDragEnd"
    v-auto-animate
  >
    <template #item="{ element }">
      <li :key="element.id" class="listItem" :class="{ done: element.done }">
        <template v-if="currentId === element.id">
          <div class="dropdownContainer">
          <select :value="element.tag" @change="editTodo( element.id, 'tag', $event.target.value)">
            <option value="" disabled>Choose category...</option>
            <option value="work">Work</option>
            <option value="school">School</option>
            <option value="personal">Personal</option>
          </select>
        </div>
          <input v-model="editingText"/>
          <button class="button-confirm" @click="saveTodo(element.id)">
            <i class="fa-solid fa-floppy-disk"></i>
          </button>
          <button class="button-cancel" @click="toggleTodo">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </template>
        <template v-else>
          <div class="emojiContainer">{{ getEmoji(element.tag) }}</div>
          <div>{{ element.text }}</div>
          <button class="button-edit util" @click="toggleTodo(element.id, element.text)">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="button-confirm util" @click="editTodo(element.id, 'done', !element.done)">
            <i v-if="element.done" class="fa-solid fa-rotate-left"></i>
          <i v-else class="fa-solid fa-check"></i>
          </button>
          <button class="button-cancel util" @click="removeToDo(element.id)">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </template>
      </li>
    </template>
  </draggable>
</template>

<script setup>
import draggable from 'vuedraggable';

const props = defineProps({
  toDoList: Array,
});

const emit = defineEmits(['updateList']);
const currentId = ref(null)
const editingText = ref("")

function handleDragEnd() {
  drag.value = false;
  emit('updateList', props.toDoList);
}

const toggleTodo = (id, currentText) => {
  // This handles 3 different scenarios
  // opening a todo
  // canceling a todo
  // saving a todo
  
  if(id || currentText) {
    currentId.value = id
    editingText.value = currentText
  }
  else {
    currentId.value = null
  }

}
const saveTodo = (id) => {
  // saving the new text 
  editTodo(id, 'text', editingText.value)
  // closing the todo
  toggleTodo()
}

const drag = ref(false);


const removeToDo = (id) => {
 const newList  = props.toDoList.filter(todo => todo.id !== id);
 emit('updateList', newList)
};

const editTodo = (id, key, newValue) => {


    const newList = props.toDoList.map(todo => {
      // find the current todo which we are editing
      if (todo.id === id) {
        // making a shallow copy of the todoList array
        // opdating the property of the key we passed from the params with the newValue
        return { ...todo, [key]: newValue};
      }
      return todo;
    });
    
  // emiting the the shallow copy to the parent component 
  // Which the 1 updates the original todoList Array
  // And 2 saves the newly updated properties to localStorage 
    emit('updateList', newList);
};


function getEmoji(tag) {
  const emojis = {
    work: '💼',
    school: '📚',
    personal: '🏠'
  };
  return emojis[tag] || '';
}

const dragOptions = {
  animation: 200,
  disabled: false,
  ghostClass: 'ghost'
};
</script>



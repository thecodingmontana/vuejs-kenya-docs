---
outline: deep
---

# Vue Contact Manager 🚀

A contact management application showcasing CRUD operations and form handling and local storage for data persistence in Vue.js

## Features ✅

- Display a list of contacts
- Add new contacts
- Edit existing contacts
- Delete contacts
- Search and filter contacts
- Categorize contacts
- View contact details
- Save data in Local Storage

## Technical Implementation ⚙️

- Vue 3 Composition API
- Simple local state management (using `ref` and `reactive`)
- Basic form validation
- Local storage for persistence
- Mobile responsive with Tailwind CSS (optional)

## Learning Objectives 🎯

- How to create and manage Vue components
- Handling forms and validation
- Using Vue state for data storage
- Persisting data with Local Storage
- Building a simple search and filter system
- Organizing Vue project structure

## Folder Structure 📁

```
src/
├─ components/
│  ├─ ContactList.vue
│  ├─ ContactForm.vue
│  └─ SearchBar.vue
App.vue
main.js
```

## Components Overview 🧱

### ContactList.vue

Displays the list of contacts.

```vue
<script setup>
defineProps(['contacts', 'onEdit', 'onDelete'])
</script>

<template>
  <ul>
    <li v-for="(c, i) in contacts" :key="i">
      {{ c.name }} - {{ c.phone }}
      <button @click="onEdit(c)">Edit</button>
      <button @click="onDelete(i)">Delete</button>
    </li>
  </ul>
</template>
```

### ContactForm.vue

Handles adding and editing contacts.

```vue
<script setup>
import { reactive } from 'vue'
const props = defineProps(['contact', 'onSubmit'])
const form = reactive({ ...props.contact })

function submit() {
  if (!form.name || !form.phone) return alert('Please fill all fields')
  props.onSubmit(form)
}
</script>

<template>
  <div>
    <input v-model="form.name" placeholder="Name" />
    <input v-model="form.phone" placeholder="Phone" />
    <button @click="submit">Save</button>
  </div>
</template>
```

### SearchBar.vue

Handles simple search.

```vue
<script setup>
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
    placeholder="Search contacts"
  />
</template>
```

## App.vue (Example Usage)

```vue
<script setup>
import { ref, reactive, watch } from 'vue'
import ContactList from './components/ContactList.vue'
import ContactForm from './components/ContactForm.vue'
import SearchBar from './components/SearchBar.vue'

const contacts = ref(JSON.parse(localStorage.getItem('contacts') || '[]'))
const selected = ref(null)
const search = ref('')

watch(contacts, (val) => {
  localStorage.setItem('contacts', JSON.stringify(val))
}, { deep: true })

function saveContact(contact) {
  if (selected.value) {
    const index = contacts.value.findIndex(c => c === selected.value)
    contacts.value[index] = contact
  } else {
    contacts.value.push(contact)
  }
  selected.value = null
}

function deleteContact(index) {
  contacts.value.splice(index, 1)
}

function filteredContacts() {
  return contacts.value.filter(c =>
    c.name.toLowerCase().includes(search.value.toLowerCase())
  )
}
</script>

<template>
  <SearchBar v-model="search" />
  <ContactForm :contact="selected || { name: '', phone: '' }" :onSubmit="saveContact" />
  <ContactList :contacts="filteredContacts()" :onEdit="(c) => selected.value = c" :onDelete="deleteContact" />
</template>
```

## Best Practices 🏅

- Keep components small and focused
- Validate form inputs before saving
- Use Vue reactivity (`ref`, `reactive`, `watch`) for state
- Persist data with local storage
- Use props and emits for component communication

## Optional Improvements 💡

- Use a Vue state management library like Pinia for larger apps
- Implement category filters
- Add contact avatars
- Use Tailwind CSS for better styling

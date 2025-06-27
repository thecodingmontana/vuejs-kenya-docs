---
outline: deep
---

# Vue Todo App Complete Guide

A comprehensive, beginner-friendly guide to building a full-featured todo application using Vue.js. This tutorial will teach you essential Vue.js concepts while creating a practical, real-world application.

## What You'll Build

By the end of this tutorial, you'll have created a modern todo application with:

- ✅ Add, edit, and delete tasks
- 🔍 Filter tasks by status (all, active, completed)
- 📅 Set due dates for tasks
- 🏷️ Organize tasks with categories
- 💾 Automatic saving to browser storage
- 📱 Responsive design that works on all devices

## Prerequisites

Before starting, you should have:

- Basic knowledge of HTML, CSS, and JavaScript
- Familiarity with ES6+ features (arrow functions, destructuring, modules)
- Node.js installed on your computer
- A code editor (VS Code recommended)

## Features Overview

### Core Features

- **Create Tasks**: Add new todo items with titles and descriptions
- **Read Tasks**: View all tasks in an organized list
- **Update Tasks**: Edit existing tasks and mark them as complete
- **Delete Tasks**: Remove tasks you no longer need

### Advanced Features

- **Task Filtering**: Show all tasks, only active tasks, or completed tasks
- **Task Sorting**: Sort by creation date, due date, or alphabetically
- **Local Storage**: Your tasks persist between browser sessions
- **Task Categories**: Organize tasks by work, personal, shopping, etc.
- **Due Dates**: Set deadlines and get visual indicators for overdue tasks
- **Completion Tracking**: Track your progress with completion statistics

## Technical Implementation

### Core Technologies

- **Vue.js 3**: The progressive JavaScript framework
- **Composition API**: Modern Vue.js approach for component logic
- **Pinia**: State management for Vue applications
- **Vue Router**: Navigation between different views
- **Vite**: Fast build tool and development server

### Key Concepts You'll Learn

- **Reactive Data**: How Vue.js automatically updates the UI when data changes
- **Component Architecture**: Breaking your app into reusable pieces
- **Event Handling**: Responding to user clicks, form submissions, etc.
- **Computed Properties**: Automatically calculated values based on other data
- **Watchers**: Responding to data changes with custom logic
- **Lifecycle Hooks**: Running code at specific points in a component's life

## Learning Objectives

By completing this project, you will:

1. **Master Vue.js Fundamentals**
   - Understand component structure and lifecycle
   - Learn reactive data binding and event handling
   - Practice template syntax and directives

2. **Build Real-World Skills**
   - Implement CRUD operations in a web application
   - Handle form validation and user input
   - Manage application state effectively

3. **Learn Best Practices**
   - Organize code with a clear project structure
   - Write reusable and maintainable components
   - Handle errors gracefully

4. **Understand Modern Development**
   - Use modern JavaScript features
   - Implement responsive design principles
   - Work with browser APIs (Local Storage)

## Project Structure

```
vue-todo-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── TodoItem.vue     # Individual todo item
│   │   ├── TodoList.vue     # List of todos
│   │   ├── TodoForm.vue     # Form to add/edit todos
│   │   ├── FilterButtons.vue # Filter controls
│   │   └── CategorySelect.vue # Category selector
│   ├── stores/              # Pinia stores for state management
│   │   └── todoStore.js     # Main todo store
│   ├── utils/               # Helper functions
│   │   ├── localStorage.js  # Local storage utilities
│   │   ├── dateHelpers.js   # Date formatting functions
│   │   └── validators.js    # Form validation helpers
│   ├── assets/              # Static resources
│   │   ├── styles/          # CSS files
│   │   │   ├── main.css     # Global styles
│   │   │   └── components.css # Component-specific styles
│   │   └── images/          # Image files
│   ├── views/               # Page components
│   │   ├── Home.vue         # Main todo view
│   │   ├── Categories.vue   # Category management
│   │   └── Statistics.vue   # Task statistics
│   ├── App.vue              # Root component
│   └── main.js              # Application entry point
├── package.json             # Project dependencies
├── vite.config.js           # Vite configuration
└── README.md                # Project documentation
```

## Getting Started

### 1. Setting Up Your Development Environment

First, create a new Vue.js project using Vite:

```bash
npm create vue@latest vue-todo-app
cd vue-todo-app
npm install
npm run dev
```

### 2. Installing Additional Dependencies

Add the packages we'll need for our todo app:

```bash
npm install pinia @pinia/nuxt
npm install @vueuse/core  # Useful Vue composition utilities
```

## Complete Example Implementation

### Main App Component (App.vue)

```vue
<template>
  <div id="app">
    <header class="app-header">
      <h1>📝 My Todo App</h1>
      <p>Stay organized and get things done!</p>
    </header>
    
    <main class="app-main">
      <TodoForm @add-todo="handleAddTodo" />
      <FilterButtons 
        :current-filter="currentFilter" 
        @filter-change="handleFilterChange" 
      />
      <TodoList 
        :todos="filteredTodos" 
        @toggle-todo="handleToggleTodo"
        @delete-todo="handleDeleteTodo"
        @edit-todo="handleEditTodo"
      />
      <TodoStats :todos="todos" />
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'
import FilterButtons from './components/FilterButtons.vue'
import TodoStats from './components/TodoStats.vue'
import { loadTodos, saveTodos } from './utils/localStorage.js'

export default {
  name: 'App',
  components: {
    TodoForm,
    TodoList,
    FilterButtons,
    TodoStats
  },
  setup() {
    // Reactive data
    const todos = ref([])
    const currentFilter = ref('all')
    
    // Computed properties
    const filteredTodos = computed(() => {
      switch (currentFilter.value) {
        case 'active':
          return todos.value.filter(todo => !todo.completed)
        case 'completed':
          return todos.value.filter(todo => todo.completed)
        default:
          return todos.value
      }
    })
    
    // Methods
    const handleAddTodo = (todoData) => {
      const newTodo = {
        id: Date.now(),
        text: todoData.text,
        completed: false,
        category: todoData.category || 'general',
        dueDate: todoData.dueDate || null,
        createdAt: new Date().toISOString()
      }
      todos.value.push(newTodo)
      saveTodos(todos.value)
    }
    
    const handleToggleTodo = (id) => {
      const todo = todos.value.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
        saveTodos(todos.value)
      }
    }
    
    const handleDeleteTodo = (id) => {
      todos.value = todos.value.filter(t => t.id !== id)
      saveTodos(todos.value)
    }
    
    const handleEditTodo = (id, newText) => {
      const todo = todos.value.find(t => t.id === id)
      if (todo) {
        todo.text = newText
        saveTodos(todos.value)
      }
    }
    
    const handleFilterChange = (filter) => {
      currentFilter.value = filter
    }
    
    // Lifecycle hooks
    onMounted(() => {
      todos.value = loadTodos()
    })
    
    return {
      todos,
      currentFilter,
      filteredTodos,
      handleAddTodo,
      handleToggleTodo,
      handleDeleteTodo,
      handleEditTodo,
      handleFilterChange
    }
  }
}
</script>

<style>
#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app-header {
  text-align: center;
  margin-bottom: 40px;
}

.app-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.app-header p {
  color: #7f8c8d;
  font-size: 18px;
}

.app-main {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
```

### Todo Form Component (components/TodoForm.vue)

```vue
<template>
  <form @submit.prevent="submitTodo" class="todo-form">
    <div class="form-group">
      <input
        v-model="todoText"
        type="text"
        placeholder="What needs to be done?"
        class="todo-input"
        required
      />
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <select v-model="selectedCategory" class="category-select">
          <option value="general">📋 General</option>
          <option value="work">💼 Work</option>
          <option value="personal">🏠 Personal</option>
          <option value="shopping">🛒 Shopping</option>
        </select>
      </div>
      
      <div class="form-group">
        <input
          v-model="dueDate"
          type="date"
          class="date-input"
        />
      </div>
      
      <button type="submit" class="add-button">
        ➕ Add Task
      </button>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'TodoForm',
  emits: ['add-todo'],
  setup(props, { emit }) {
    const todoText = ref('')
    const selectedCategory = ref('general')
    const dueDate = ref('')
    
    const submitTodo = () => {
      if (todoText.value.trim()) {
        emit('add-todo', {
          text: todoText.value.trim(),
          category: selectedCategory.value,
          dueDate: dueDate.value || null
        })
        
        // Reset form
        todoText.value = ''
        selectedCategory.value = 'general'
        dueDate.value = ''
      }
    }
    
    return {
      todoText,
      selectedCategory,
      dueDate,
      submitTodo
    }
  }
}
</script>

<style scoped>
.todo-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 10px;
  align-items: end;
}

.todo-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.todo-input:focus {
  outline: none;
  border-color: #3498db;
}

.category-select,
.date-input {
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.add-button {
  padding: 10px 20px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #229954;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
  
  .form-row .form-group {
    margin-bottom: 10px;
  }
}
</style>
```

### Local Storage Utilities (utils/localStorage.js)

```javascript
const STORAGE_KEY = 'vue-todo-app-tasks'

export function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading todos from localStorage:', error)
    return []
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch (error) {
    console.error('Error saving todos to localStorage:', error)
  }
}

export function clearTodos() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing todos from localStorage:', error)
  }
}
```

## Step-by-Step Tutorial

### Step 1: Create the Basic Structure

Start by setting up your project structure and creating the main App.vue component with basic todo functionality.

### Step 2: Add Todo Form

Create a form component that allows users to add new todos with categories and due dates.

### Step 3: Display Todo List

Build a component to display all todos with the ability to mark them as complete or delete them.

### Step 4: Add Filtering

Implement buttons to filter todos by their completion status.

### Step 5: Add Local Storage

Make your todos persist between browser sessions using localStorage.

### Step 6: Add Advanced Features

Enhance your app with categories, due dates, and statistics.

### Step 7: Style Your App

Add responsive CSS to make your app look professional and work on all devices.

## Best Practices

### Component Organization

- Keep components small and focused on a single responsibility
- Use props to pass data down and events to communicate up
- Create reusable components that can be used in multiple places

### State Management

- Use reactive references for data that changes
- Implement computed properties for derived data
- Keep your state as simple as possible

### Error Handling

- Always handle potential errors, especially with localStorage
- Provide user feedback for actions (success/error messages)
- Validate user input before processing

### Performance

- Use v-for keys when rendering lists
- Avoid unnecessary re-renders with proper key usage
- Consider using v-memo for expensive list items

## Common Challenges and Solutions

### Challenge: State Management

**Problem**: As your app grows, managing state becomes complex.
**Solution**: Use Pinia for centralized state management or keep state in parent components.

### Challenge: Data Persistence

**Problem**: Todos disappear when refreshing the page.
**Solution**: Implement localStorage integration with proper error handling.

### Challenge: Form Validation

**Problem**: Users can submit empty or invalid todos.
**Solution**: Add client-side validation and provide clear error messages.

### Challenge: Mobile Responsiveness

**Problem**: App doesn't work well on mobile devices.
**Solution**: Use responsive CSS techniques and test on various screen sizes.

## Next Steps

After completing this basic todo app, consider adding:

1. **User Authentication**: Allow multiple users with separate todo lists
2. **Backend Integration**: Connect to a REST API or database
3. **Real-time Updates**: Use WebSockets for collaborative editing
4. **Advanced Filtering**: Search, sort by multiple criteria
5. **Drag and Drop**: Reorder todos with drag and drop
6. **Notifications**: Browser notifications for due dates
7. **Themes**: Dark mode and customizable themes
8. **Export/Import**: Backup and restore todo lists

## Resources for Further Learning

- [Vue.js Official Documentation](https://vuejs.org/guide/)
- [Vue.js Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia State Management](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vite Build Tool](https://vitejs.dev/)

## Conclusion

Congratulations! You've built a complete Vue.js todo application that demonstrates essential concepts and best practices. This project serves as a solid foundation for building more complex Vue.js applications.

The skills you've learned - component architecture, state management, event handling, and data persistence - are transferable to any Vue.js project you'll work on in the future.

Remember to keep practicing and experimenting with new features. The Vue.js ecosystem is rich with tools and libraries that can help you build amazing applications!

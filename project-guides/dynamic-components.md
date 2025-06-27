---
outline: deep
---

# Vue Dynamic Components 🎛️

This project shows how to use dynamic components in Vue.js for flexible and interactive content switching.

## Features ✅

- Switch between different components dynamically
- Preserve state using KeepAlive
- Dynamic tab navigation
- Lazy load components when needed
- Cache components for performance
- Add smooth transitions when switching

## Technical Implementation ⚙️

- Use of Vue's `:is` dynamic component attribute
- Wrap with `<KeepAlive>` for state preservation
- Use dynamic `import()` for lazy loading
- Manage component state and transitions

## Learning Objectives 🎯

- Understand how dynamic components work
- Implement simple component switching
- Preserve component state across switches
- Optimize performance with lazy loading and caching
- Handle component lifecycle and transitions

## Example Folder Structure 📁

```
src/
├─ components/
│  ├─ TabOne.vue
│  ├─ TabTwo.vue
│  └─ TabThree.vue
App.vue
main.js
```

## Component Examples 🧱

### TabOne.vue

```vue
<template>
  <div>📄 This is Tab One Content</div>
</template>
```

### TabTwo.vue

```vue
<template>
  <div>📄 This is Tab Two Content</div>
</template>
```

### TabThree.vue

```vue
<template>
  <div>📄 This is Tab Three Content</div>
</template>
```

## App.vue (Dynamic Component Example)

```vue
<script setup>
import { ref } from 'vue'

const currentTab = ref('TabOne')
const tabs = ['TabOne', 'TabTwo', 'TabThree']

function switchTab(tab) {
  currentTab.value = tab
}
</script>

<template>
  <div>
    <div>
      <button v-for="tab in tabs" :key="tab" @click="switchTab(tab)">
        {{ tab }}
      </button>
    </div>

    <Transition name="fade" mode="out-in">
      <KeepAlive>
        <component :is="currentTab" />
      </KeepAlive>
    </Transition>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
```

## Use Cases 💡

- Tab interfaces
- Step-by-step wizard flows
- Modal content switching
- Dynamic form sections
- Content switchers

## Best Practices 🏅

- Keep component names clear and consistent
- Use KeepAlive only when necessary
- Lazy load large components to improve initial load
- Properly clean up component state if needed
- Organize dynamic components in a dedicated folder

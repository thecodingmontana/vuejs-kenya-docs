---
outline: deep
---

# Vue Custom Directives 🛠️

This project demonstrates how to create and use custom directives in Vue.js for better DOM control and interactivity.

## Features ✅

- Create your own Vue directives
- Use different directive lifecycle hooks
- Support for arguments and modifiers
- Pass dynamic values to directives
- Handle DOM events and updates

## Learning Objectives 🎯

- How to create Vue custom directives
- Understand directive lifecycle (`mounted`, `updated`, `unmounted`)
- Handle directive arguments and modifiers
- Perform DOM manipulation
- Properly clean up event listeners

## Directive Examples 🧱

### `v-focus`

Auto-focus input elements.

```vue
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})
```

Usage:

```vue
<input v-focus placeholder="Auto-focused input" />
```

### `v-resize`

Handle window resize.

```vue
app.directive('resize', {
  mounted(el, binding) {
    function onResize() {
      binding.value(window.innerWidth)
    }
    window.addEventListener('resize', onResize)
    onResize()
    el._onResize = onResize
  },
  unmounted(el) {
    window.removeEventListener('resize', el._onResize)
  }
})
```

Usage:

```vue
<div v-resize="(width) => console.log(width)">Resize window</div>
```

### `v-scroll`

Detect scroll events.

```vue
app.directive('scroll', {
  mounted(el, binding) {
    function onScroll() {
      binding.value(window.scrollY)
    }
    window.addEventListener('scroll', onScroll)
    el._onScroll = onScroll
  },
  unmounted(el) {
    window.removeEventListener('scroll', el._onScroll)
  }
})
```

Usage:

```vue
<div v-scroll="(y) => console.log('Scroll position:', y)">Scroll this page</div>
```

## Using Modifiers and Arguments 🎛️

Example with modifiers:

```vue
app.directive('example', {
  mounted(el, binding) {
    console.log('Value:', binding.value)
    console.log('Argument:', binding.arg)
    console.log('Modifiers:', binding.modifiers)
  }
})
```

Usage:

```vue
<div v-example:info.alert.large="someValue"></div>
```

## App.vue (Basic Setup)

```vue
<script setup>
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Register custom directives here
app.directive('focus', { mounted(el) { el.focus() } })

app.mount('#app')
</script>
```

## Implementation Details ⚙️

- Register directives globally or locally
- Use lifecycle hooks: `mounted`, `updated`, `beforeUnmount`, `unmounted`
- Access arguments and modifiers via `binding`
- Always clean up listeners in `unmounted`

## Best Practices 🏅

- Use clear naming for your directives
- Avoid performance-heavy logic inside directives
- Always clean up side effects (like event listeners)
- Handle errors gracefully
- Document your custom directives for future use

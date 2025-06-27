---
outline: deep
---

# Vue Shopping Cart

A shopping cart implementation demonstrating e-commerce functionality using Vue.js with state management and checkout flow.

## Features

- Product listing with images and prices
- Add/remove items from cart
- Quantity adjustments
- Real-time price calculation
- Checkout process
- Order summary and confirmation

## Technical Implementation

The shopping cart uses Vue 3 Composition API with reactive state management, component composition, and local storage for persistence.

### Core Components

- **ProductList** - Displays available products
- **CartItem** - Individual cart item with controls
- **CartSummary** - Shows totals and checkout button
- **CheckoutForm** - Customer information collection
- **OrderConfirmation** - Final order details

## Working Example

Here's a complete shopping cart implementation:

```vue
<template>
  <div class="shopping-app">
    <header class="header">
      <h1>Vue Shopping Cart</h1>
      <div class="cart-icon">
        Cart ({{ cartItemCount }}) - ${{ cartTotal }}
      </div>
    </header>

    <main class="main-content">
      <!-- Product List -->
      <section class="products">
        <h2>Products</h2>
        <div class="product-grid">
          <div 
            v-for="product in products" 
            :key="product.id"
            class="product-card"
          >
            <h3>{{ product.name }}</h3>
            <p class="price">${{ product.price }}</p>
            <button @click="addToCart(product)">
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      <!-- Shopping Cart -->
      <section class="cart">
        <h2>Shopping Cart</h2>
        <div v-if="cart.length === 0" class="empty-cart">
          Your cart is empty
        </div>
        <div v-else>
          <div 
            v-for="item in cart" 
            :key="item.id"
            class="cart-item"
          >
            <span>{{ item.name }}</span>
            <div class="quantity-controls">
              <button @click="updateQuantity(item.id, -1)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="updateQuantity(item.id, 1)">+</button>
            </div>
            <span class="item-total">
              ${{ (item.price * item.quantity).toFixed(2) }}
            </span>
            <button @click="removeFromCart(item.id)">Remove</button>
          </div>
          
          <div class="cart-summary">
            <div class="total">Total: ${{ cartTotal }}</div>
            <button 
              @click="showCheckout = true"
              class="checkout-btn"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </section>

      <!-- Checkout Form -->
      <section v-if="showCheckout" class="checkout">
        <h2>Checkout</h2>
        <form @submit.prevent="processOrder">
          <div class="form-group">
            <label>Name:</label>
            <input v-model="customerInfo.name" required>
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="customerInfo.email" type="email" required>
          </div>
          <div class="form-group">
            <label>Address:</label>
            <textarea v-model="customerInfo.address" required></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="showCheckout = false">
              Back to Cart
            </button>
            <button type="submit">Place Order</button>
          </div>
        </form>
      </section>

      <!-- Order Confirmation -->
      <section v-if="orderPlaced" class="confirmation">
        <h2>Order Confirmed!</h2>
        <p>Thank you, {{ customerInfo.name }}!</p>
        <p>Order Total: ${{ orderTotal }}</p>
        <button @click="resetCart">Start New Order</button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive state
const products = ref([
  { id: 1, name: 'Laptop', price: 999.99 },
  { id: 2, name: 'Phone', price: 699.99 },
  { id: 3, name: 'Headphones', price: 199.99 }
])

const cart = ref([])
const showCheckout = ref(false)
const orderPlaced = ref(false)
const orderTotal = ref(0)

const customerInfo = ref({
  name: '',
  email: '',
  address: ''
})

// Computed properties
const cartItemCount = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.quantity, 0)
})

const cartTotal = computed(() => {
  return cart.value
    .reduce((sum, item) => sum + (item.price * item.quantity), 0)
    .toFixed(2)
})

// Methods
const addToCart = (product) => {
  const existingItem = cart.value.find(item => item.id === product.id)
  
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.value.push({ ...product, quantity: 1 })
  }
  saveCart()
}

const updateQuantity = (id, change) => {
  const item = cart.value.find(item => item.id === id)
  if (item) {
    item.quantity = Math.max(0, item.quantity + change)
    if (item.quantity === 0) {
      removeFromCart(id)
    }
  }
  saveCart()
}

const removeFromCart = (id) => {
  cart.value = cart.value.filter(item => item.id !== id)
  saveCart()
}

const processOrder = () => {
  orderTotal.value = cartTotal.value
  orderPlaced.value = true
  showCheckout.value = false
  cart.value = []
  saveCart()
}

const resetCart = () => {
  orderPlaced.value = false
  customerInfo.value = { name: '', email: '', address: '' }
}

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

const loadCart = () => {
  const saved = localStorage.getItem('cart')
  if (saved) {
    cart.value = JSON.parse(saved)
  }
}

// Load cart on mount
onMounted(() => {
  loadCart()
})
</script>

<style scoped>
.shopping-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.cart-icon {
  font-weight: bold;
  color: #007bff;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.product-card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.price {
  font-size: 1.2em;
  font-weight: bold;
  color: #28a745;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-summary {
  margin-top: 20px;
  text-align: right;
}

.total {
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 15px;
}

.checkout-btn {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.confirmation {
  text-align: center;
  padding: 40px;
  background: #f8f9fa;
  border-radius: 8px;
}

button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #f8f9fa;
}
</style>
```

## Key Implementation Details

### State Management

The cart uses Vue's reactive system with `ref()` and `computed()` for real-time updates. Cart data persists in localStorage for session continuity.

### Component Logic

- **Add to Cart**: Checks for existing items and updates quantity
- **Quantity Control**: Handles increment/decrement with validation  
- **Price Calculation**: Uses computed properties for reactive totals
- **Checkout Flow**: Multi-step process with form validation

### Best Practices

**State Management**: Centralized cart state with computed properties for derived values like totals and item counts.

**Component Composition**: Single-file component structure with clear separation of template, script, and styles.

**Error Handling**: Input validation and quantity bounds checking prevent invalid states.

**User Experience**: Real-time updates, persistent cart data, and clear visual feedback for all actions.

**Responsive Design**: Grid layout adapts to different screen sizes with mobile-friendly controls.

## Learning Objectives

This implementation demonstrates:

- Complex state management in Vue applications
- Shopping cart logic and e-commerce patterns  
- Monetary calculations with proper formatting
- Component lifecycle and data persistence
- Form handling and validation techniques
- User interface design for commerce applications

The code provides a foundation for building more advanced e-commerce features like product variants, discounts, and payment integration.

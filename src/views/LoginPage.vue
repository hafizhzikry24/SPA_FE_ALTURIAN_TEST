<template>
  <div v-if="isLoadingAuth" class="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
    <div class="animate-spin border-t-4 border-blue-500 border-solid w-12 h-12 rounded-full"></div>
  </div>
  <div v-if="!isLoadingAuth" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">Login</h1>
      <p class="text-gray-600 mb-6">Enter your credentials to access your account</p>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Enter your password"
            />
          </div>

          <p class="text-sm text-gray-600 text-center">
            Don't have an account? 
            <RouterLink to="/register" class="text-blue-500 hover:underline">Create account</RouterLink>
          </p>

          <div class="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              @click="$emit('cancel')"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </div>
      </form>

      <p v-if="error" class="mt-4 text-sm text-red-600 text-center">{{ error }}</p>
      <p v-if="success" class="mt-4 text-sm text-green-600 text-center">{{ success }}</p>
    </div>
  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import axios from '../axios'

const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const isLoading = ref(false)
const isLoadingAuth = ref(true)
const router = useRouter()

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await axios.post('/login', {
      email: email.value,
      password: password.value,
    })

    success.value = 'Login successful'
    localStorage.setItem('token', response.data.access_token)

    router.push('/blog')
    
  
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
  } finally {
    isLoading.value = false
  }
  
}
const fetchUserData = async () => {
    try {
        const response = await axios.get('/user');
        // userData.value = response.data.data;
        router.replace('/blog');
        console.log(response.data);
        
    } catch (err) {
        console.error('Failed to fetch user data', err);
    } finally {
      isLoadingAuth.value = false
    }

  
    };

    onMounted(fetchUserData);
</script>

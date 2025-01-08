<template>
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow">
        <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
          <router-link to="/blog" class="text-xl font-semibold text-gray-900">Blog</router-link>
          <div class="flex space-x-14">
            <router-link
              to="/blog/my-posts"
              class="text-gray-700 hover:text-gray-900"
            >
              My Posts
            </router-link>
            <router-link
              to="/blog/other-posts"
              class="text-gray-700 hover:text-gray-900"
            >
               Others Posts
            </router-link>
            <button @click="handleLogout" class="text-gray-700 hover:text-gray-900 mx-2">Logout</button>
          </div>
        </nav>
      </header>
      <main class="container mx-auto px-4 py-8">
        <router-view :currentUser="userData"></router-view>
      </main>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from '../axios';
  
  const router = useRouter();
  const userData = ref(null);
  
  const fetchUserData = async () => {
    try {
      const response = await axios.get('/user'); 
      userData.value = response.data.data;
    } catch (err) {
      console.error('Failed to fetch user data', err);
    }
  };
  
  onMounted(fetchUserData);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };
  </script>
  
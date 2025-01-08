<template>
    <div>
      <h2 class="text-xl font-semibold text-gray-800">Posts from Others</h2>
      <div v-if="otherPosts.length === 0" class="text-center text-gray-500">No posts from others yet.</div>
      <div v-else>
        <div
          v-for="post in otherPosts"
          :key="post.id"
          class="bg-white p-6 rounded-lg shadow mb-6"
        >
          <div class="flex justify-between items-start">
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">
              <router-link
                :to="{ name: 'post', params: { slug: post.slug } }"
                class="hover:underline"
              >
                {{ post.title }}
              </router-link>
            </h2>
          </div>
          <p class="text-gray-600 mb-4">{{ post.body.substring(0, 200) }}...</p>
          <div class="text-sm text-gray-500">
            By {{ post.author.name }} |
            {{ new Date(post.created_at).toLocaleDateString() }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from '@/axios'; // Sesuaikan dengan axios Anda
  
  const props = defineProps({
    currentUser: Object,
  });
  
  const otherPosts = ref([]);
  
  const fetchOtherPosts = async () => {
    try {
      const response = await axios.get('/posts');
      otherPosts.value = response.data.data.filter(post => post.author.id !== props.currentUser.id);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };
  
  onMounted(fetchOtherPosts);
  </script>
  
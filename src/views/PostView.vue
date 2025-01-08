<template>
    <div v-if="isLoading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else class="bg-white p-6 rounded-lg shadow">
      <h1 class="text-3xl font-semibold text-gray-900 mb-4">{{ post.title }}</h1>
      <div class="text-sm text-gray-500 mb-4">
        By {{ post.author.name }} | {{ new Date(post.created_at).toLocaleDateString() }}
      </div>
      <div class="prose max-w-none mb-8" v-html="post.body"></div>
      
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Comments</h2>
      <CommentList :post-id="post.id" />
      <CommentForm :post-id="post.id" @comment-added="fetchPost" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from '../axios';
  import CommentList from '@/components/CommentList.vue';
  import CommentForm from '@/components/CommentForm.vue';
  
  const route = useRoute();
  const post = ref(null);
  const isLoading = ref(true);
  const error = ref(null);
  
  const fetchPost = async () => {
    try {
      const response = await axios.get(`/posts/${route.params.slug}`);
      post.value = response.data.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch post';
    } finally {
      isLoading.value = false;
    }
  };
  
  onMounted(fetchPost);
  </script>
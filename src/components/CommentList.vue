<template>
    <div v-if="isLoading" class="text-center">Loading comments...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else class="space-y-4">
      <div v-for="comment in comments" :key="comment.id" class="bg-gray-50 p-4 rounded-lg">
        <p class="text-gray-800 mb-2">{{ comment.body }}</p>
        <div class="text-sm text-gray-500">
          By {{ comment.author.name }} | {{ new Date(comment.created_at).toLocaleDateString() }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  
  const props = defineProps({
    postId: {
      type: Number,
      required: true
    }
  });
  
  const comments = ref([]);
  const isLoading = ref(true);
  const error = ref(null);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        throw new Error('Token not found');
      }
  
      const response = await fetch(`http://127.0.0.1:8001/api/posts/${props.postId}/comments`, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
  
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      comments.value = data.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };
  
  onMounted(fetchComments);
  watch(() => props.postId, fetchComments);
  </script>
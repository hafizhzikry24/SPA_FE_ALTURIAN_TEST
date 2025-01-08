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
      <CommentList 
        :comments="comments" 
        :currentUser="userData"
        @update-comment="updateComment"
        @delete-comment="deleteComment"
      />
      <CommentForm :post-id="post.id" @comment-added="addComment" />
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
  const comments = ref([]);
  const isLoading = ref(true);
  const error = ref(null);
  const currentUserId = ref(localStorage.getItem('userId'));
  
  const fetchPost = async () => {
    try {
      const response = await axios.get(`/posts/${route.params.slug}`);
      post.value = response.data.data;
      fetchComments();
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch post';
    } finally {
      isLoading.value = false;
    }
  };

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
  
  const fetchComments = async () => {
    try {
      const response = await axios.get(`/posts/${post.value.id}/comments`);
      comments.value = response.data.data;
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };
  
  const addComment = async (newComment) => {
    try {
      const response = await axios.post(`/posts/${post.value.id}/comments`, newComment);
      comments.value.unshift(response.data.data);
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };
  
  const updateComment = async (updatedComment) => {
    try {
      await axios.put(`/comments/${updatedComment.id}`, { body: updatedComment.body });
      const index = comments.value.findIndex(c => c.id === updatedComment.id);
      if (index !== -1) {
        comments.value[index] = updatedComment;
      }
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  };
  
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      comments.value = comments.value.filter(c => c.id !== commentId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };
  
  onMounted(fetchPost);
  </script>
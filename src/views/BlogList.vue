<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-semibold text-gray-900">Blog Posts</h1>
        <button @click="showCreateForm = true" class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200">
          Create New Post
        </button>
      </div>
      <div v-if="isLoading" class="text-center">Loading...</div>
      <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
      <div v-else class="space-y-6">
        <div v-for="post in posts" :key="post.id" class="bg-white p-6 rounded-lg shadow">
          <div class="flex justify-between items-start">
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">
              <router-link :to="{ name: 'post', params: { slug: post.slug } }" class="hover:underline">
                {{ post.title }}
              </router-link>
            </h2>

            <div v-if="post.author.id === currentUser?.id" class="flex space-x-2">
            <!-- <div class="flex space-x-2"> -->
              <button @click="editPost(post)" class="text-blue-500 hover:underline">edit
                <i class="fas fa-edit"></i> 
              </button>
              <button @click="deletePost(post.id)" class="text-red-500 hover:underline">delete
                <i class="fas fa-trash-alt"></i> 
              </button>
            </div>
          </div>
          <p class="text-gray-600 mb-4">{{ post.body.substring(0, 200) }}...</p>
          <div class="text-sm text-gray-500">
            By {{ post.author.name }} | {{ new Date(post.created_at).toLocaleDateString() }}
          </div>
        </div>
      </div>
  
      <!-- Post Create Form -->
      <PostForm 
        v-if="showCreateForm" 
        @close="closeCreateForm" 
        @save="savePost"
      />
      
      <!-- Post Edit Form -->
      <PostForm 
        v-if="editingPost" 
        :post="editingPost"
        @close="closeEditForm" 
        @save="updatePost"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from '../axios';
  import PostForm from '@/components/PostForm.vue';
  
  const posts = ref([]);
  const isLoading = ref(true);
  const error = ref(null);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const showCreateForm = ref(false);
  const editingPost = ref(null);
  const props = defineProps({
    currentUser: Object,  
});

  
  const fetchPosts = async () => {
    isLoading.value = true;
    try {
      const response = await axios.get(`/posts?page=${currentPage.value}`);
      posts.value = response.data.data;
      currentPage.value = response.data.current_page;
      totalPages.value = response.data.last_page;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch posts';
    } finally {
      isLoading.value = false;
    }
  };
  
  const deletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`/posts/${postId}`);
      fetchPosts();
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete post';
    }
  };
  
  const editPost = (post) => {
    editingPost.value = post;
  };
  
  const closeCreateForm = () => {
    showCreateForm.value = false;
  };
  
  const closeEditForm = () => {
    editingPost.value = null;
  };
  
  const savePost = async () => {
    await fetchPosts();
    closeCreateForm();
  };
  
  const updatePost = async () => {
    await fetchPosts();
    closeEditForm();
  };
  
  onMounted(() => {
    fetchPosts();
    // currentUser.value = localStorage.getItem('userId');
  });
  </script>
  

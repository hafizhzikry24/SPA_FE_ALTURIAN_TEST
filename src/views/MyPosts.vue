<template>
    <div>
      <h2 class="text-xl font-semibold text-gray-800">My Posts</h2>
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-gray-50 bg-opacity-25 flex items-center justify-center z-50"
      >
        <div
          class="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"
        ></div>
      </div>
      <div v-else>
        <div
          v-for="post in myPosts"
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
            <div
              v-if="post.author.id === currentUser?.id"
              class="flex space-x-2"
            >
              <PencilIcon
                @click="editPost(post)"
                class="text-blue-500 hover:underline size-4"
              >edit</PencilIcon>
              <TrashIcon
                @click="deletePost(post.id)"
                class="text-red-500 hover:underline size-4"
              >delete</TrashIcon>
            </div>
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
  import { ref, computed, onMounted } from 'vue';
  import axios from "../axios";
  import { PencilIcon, TrashIcon } from "@heroicons/vue/24/solid";
  
  const props = defineProps({
    currentUser: Object,
  });
  
  const myPosts = ref([]);
  const isLoading = ref(true);
  
  const fetchMyPosts = async () => {
    isLoading.value = true;
    try {
      const response = await axios.get('/posts');
      myPosts.value = response.data.data.filter(post => post.author.id === props.currentUser.id);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      isLoading.value = false;
    }
  };
  
  const deletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`/posts/${postId}`);
      fetchMyPosts();
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };
  
  const editPost = (post) => {
    // Handle editing logic here
  };
  
  onMounted(fetchMyPosts);
  </script>
  
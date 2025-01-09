<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50"
  >
    <div class="text-center">
      <div
        class="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"
      ></div>
      <p class="mt-2 text-gray-600">Loading posts...</p>
    </div>
  </div>

  <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
  <div v-else class="bg-white p-6 rounded-lg shadow">
    <h1 class="text-3xl font-semibold text-gray-900 mb-4">{{ post.title }}</h1>
    <div class="text-sm text-gray-500 mb-4">
      By {{ post.author.name }} |
      {{ new Date(post.created_at).toLocaleDateString() }}
    </div>
    <div class="prose max-w-none mb-8 overflow-hidden break-words" v-html="post.body"></div>
    <CommentContainer :postId="post.id" :currentUser="userData" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "../axios";
import CommentContainer from "@/components/CommentContainer.vue";

const route = useRoute();
const post = ref(null);
const comments = ref([]);
const isLoading = ref(true);
const error = ref(null);

const fetchPost = async () => {
  try {
    const response = await axios.get(`/posts/${route.params.slug}`);
    post.value = response.data.data;
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to fetch post";
  } finally {
    isLoading.value = false;
  }
};

const userData = ref(null);

const fetchUserData = async () => {
  try {
    const response = await axios.get("/user");
    userData.value = response.data.data;
  } catch (err) {
    console.error("Failed to fetch user data", err);
  }
};

onMounted(fetchUserData);
onMounted(fetchPost);
</script>

<template>
    <div>
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-gray-50 bg-opacity-25 flex items-center justify-center z-50"
      >
        <div
          class="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"
        ></div>
      </div>
  
      <div>
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-semibold text-gray-900">Blog Posts</h1>
          <button
            @click="showCreateForm = true"
            class="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <PlusCircleIcon class="mr-2 size-6" />
            Create New Post
          </button>
        </div>
  
        <div class="mb-4">
          <input
            v-model="searchQuery"
            @input="searchPosts"
            type="text"
            class="px-4 py-2 w-full border border-gray-300 rounded-md"
            placeholder="Search posts..."
          />
        </div>
  
        <div v-if="error" class="text-center text-red-600">{{ error }}</div>
  
        <div v-else class="space-y-6">
          <!-- My Posts -->
          <div v-if="myPosts.length > 0">
            <h2 class="text-xl font-semibold text-gray-800">My Posts</h2>
            <div
              v-for="post in myPosts"
              :key="post.id"
              class="bg-white mt-3 p-6 rounded-lg shadow"
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
  
          <!-- Posts from Others -->
          <div v-if="otherPosts.length > 0">
            <h2 class="text-xl font-semibold text-gray-800">Posts from Others</h2>
            <div
              v-for="post in otherPosts"
              :key="post.id"
              class="bg-white mt-3 p-6 rounded-lg shadow"
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
  
        <PostForm
          v-if="showCreateForm"
          @close="closeCreateForm"
          @refetch="refetchPost"
        />
  
        <PostForm
          v-if="editingPost"
          :post="editingPost"
          @close="closeEditForm"
          @refetch="refetchPost"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from "vue";
  import axios from "../axios";
  import PostForm from "@/components/PostForm.vue";
  import { PencilIcon, PlusCircleIcon, TrashIcon } from "@heroicons/vue/24/solid";
  
  const posts = ref([]);
  const isLoading = ref(true);
  const error = ref(null);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const showCreateForm = ref(false);
  const editingPost = ref(null);
  const searchQuery = ref("");
  const props = defineProps({
    currentUser: Object,
  });
  
  const fetchPosts = async (search = "") => {
    isLoading.value = true;
    try {
      const url = search ? `/posts?search=${search}` : "/posts";
      const response = await axios.get(url);
      posts.value = response.data.data;
      currentPage.value = response.data.current_page;
      totalPages.value = response.data.last_page;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to fetch posts";
    } finally {
      isLoading.value = false;
    }
  };
  
  const deletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`/posts/${postId}`);
      fetchPosts(searchQuery.value);
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to delete post";
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
  
  const refetchPost = async () => {
    await fetchPosts(searchQuery.value);
    closeCreateForm();
  };
  
  const searchPosts = () => {
    fetchPosts(searchQuery.value);
  };
  
  // Computed properties for filtering posts
  const myPosts = computed(() => {
    return posts.value.filter(post => post.author.id === props.currentUser?.id);
  });
  
  const otherPosts = computed(() => {
    return posts.value.filter(post => post.author.id !== props.currentUser?.id);
  });
  
  onMounted(() => {
    fetchPosts();
  });
  </script>
  
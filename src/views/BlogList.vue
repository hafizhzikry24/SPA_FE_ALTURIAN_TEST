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
      <div class="flex justify-between items-center mb-6 mx-2">
        <h1 class="text-3xl font-semibold text-gray-900">Blog Posts</h1>

        <button
          @click="showCreateForm = true"
          class="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <PlusCircleIcon class="mr-2 w-6 h-6" />
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
        <div
          v-for="post in posts"
          :key="post.id"
          class="bg-white p-6 rounded-lg shadow"
        >
          <div class="flex justify-between items-start">
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">
              <router-link
                :to="{ name: 'post', params: { slug: post.slug } }"
                class="hover:underline"
                title="View Post"
              >
                {{ post.title }}
              </router-link>
            </h2>

            <div
              v-if="post.author.id === currentUser?.id"
              class="flex space-x-3"
            >
              <button
                @click="editPost(post)"
                class="text-green-500 hover:text-green-700 bg-green-100 hover:bg-emerald-200 p-2 rounded-lg"
                title="Edit Post"
              >
                <PencilIcon class="size-3.5" />
              </button>
              <button
                @click="deletePost(post.id)"
                class="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 p-2 rounded-lg"
                title="Delete Post"
              >
                <TrashIcon class="size-3.5" />
              </button>
            </div>
          </div>

          <p class="text-gray-600 mb-4">{{ truncateText(post.body) }}...</p>
          <div class="text-sm text-gray-500">
            By {{ post.author.name }} |
            {{ new Date(post.created_at).toLocaleDateString() }}
          </div>
        </div>
      </div>

      <div
        v-if="pagination.total > pagination.per_page"
        class="mt-6 flex justify-center space-x-2"
      >
        <button
          :disabled="pagination.current_page === 1"
          @click="changePage(pagination.current_page - 1)"
          class="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-900 text-white"
        >
          Previous
        </button>
        <span class="px-4 py-2"
          >{{ pagination.current_page }} of {{ pagination.total_pages }}</span
        >
        <button
          :disabled="pagination.current_page === pagination.total_pages"
          @click="changePage(pagination.current_page + 1)"
          class="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-900 text-white"
        >
          Next
        </button>
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
import { ref, onMounted, reactive } from "vue";
import axios from "../axios";
import Swal from "sweetalert2";
import PostForm from "@/components/PostForm.vue";
import {
  EyeIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/vue/24/solid";

const posts = ref({});
const isLoading = ref(true);
const error = ref(null);
const pagination = reactive({});
const showCreateForm = ref(false);
const editingPost = ref(null);
const searchQuery = ref("");

const props = defineProps({
  currentUser: Object,
});

const truncateText = (text, wordLimit = 10, charLimit = 20) => {
  const words = text.split(" ");
  const truncatedWords = words.map((word) => {
    if (word.length > charLimit) {
      return word.slice(0, charLimit) + "...";
    }
    return word;
  });

  const truncatedText = truncatedWords.slice(0, wordLimit).join(" ");
  if (truncatedWords.length > wordLimit) {
    return truncatedText + "...";
  }

  return truncatedText;
};

const fetchPosts = async (page = 1, search = "") => {
  isLoading.value = true;
  try {
    const response = await axios.get(`/posts?search=${search}&page=${page}`);
    posts.value = response.data.data;

    pagination.current_page = response.data.pagination.current_page;
    pagination.total_pages = response.data.pagination.total_pages;
    pagination.per_page = response.data.pagination.per_page;
    pagination.total = response.data.pagination.total;
  } catch (err) {
    console.log(err);
    error.value = err.response?.data?.message || "Failed to fetch posts";
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= pagination.total_pages) {
    pagination.current_page = page;
    fetchPosts(page, searchQuery.value);
  }
};

const deletePost = async (postId) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`/posts/${postId}`);
      fetchPosts(pagination.current_page, searchQuery.value);
      Swal.fire("Deleted!", "Your post has been deleted.", "success");
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to delete post";
      Swal.fire(
        "Error!",
        "Something went wrong while deleting the post.",
        "error"
      );
    }
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
  await fetchPosts(pagination.current_page, searchQuery.value);
  closeCreateForm();
};

const searchPosts = () => {
  fetchPosts(1, searchQuery.value);
};

onMounted(() => {
  fetchPosts(pagination.current_page);
});
</script>

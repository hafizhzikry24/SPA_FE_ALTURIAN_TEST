<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
  >
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">
        {{ isEditing ? "Edit Post" : "Create Post" }}
      </h1>
      <p class="text-gray-600 mb-6">
        {{
          isEditing ? "Update your blog post details" : "Create a new blog post"
        }}
      </p>

      <form @submit.prevent="savePost">
        <div class="space-y-6">
          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Title</label
            >
            <input
              id="title"
              v-model="formData.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label
              for="body"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Content</label
            >
            <textarea
              id="body"
              v-model="formData.body"
              required
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Write your post content"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              {{
                isSubmitting
                  ? "Saving..."
                  : isEditing
                  ? "Save Changes"
                  : "Create Post"
              }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "../axios";
import Swal from "sweetalert2";

const props = defineProps({
  post: Object,
});

const emit = defineEmits(["close", "refetch"]);

const formData = ref({
  title: "",
  body: "",
});

const isSubmitting = ref(false);
const isEditing = computed(() => !!props.post);

onMounted(() => {
  if (props.post) {
    formData.value = {
      title: props.post.title,
      body: props.post.body,
    };
  }
});

const savePost = async () => {
  isSubmitting.value = true;
  try {
    if (isEditing.value) {
      await axios.put(`/posts/${props.post.id}`, formData.value);
      Swal.fire(
        "Updated!",
        "Your post has been updated successfully.",
        "success"
      );
    } else {
      await axios.post("/posts", formData.value);
      Swal.fire(
        "Created!",
        "Your post has been created successfully.",
        "success"
      );
    }
    emit("refetch");
    emit("close");
  } catch (error) {
    Swal.fire(
      "Error!",
      "There was an error while saving the post. Please try again later.",
      "error"
    );
    console.error("Error saving post:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

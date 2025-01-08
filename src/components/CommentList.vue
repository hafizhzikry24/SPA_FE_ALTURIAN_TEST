<template>
  <div v-if="!comments?.length" class="text-center text-gray-500">
    No comments yet.
  </div>

  <div v-else class="space-y-4">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="bg-gray-50 p-4 rounded-lg"
    >
      <div v-if="editingCommentId === comment.id">
        <textarea
          v-model="editedCommentBody"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
          rows="3"
        ></textarea>
        <div class="mt-2 flex justify-end space-x-2">
          <button
            @click="saveEdit(comment)"
            class="text-blue-500 hover:underline"
          >
            Save
          </button>
          <button @click="cancelEdit" class="text-gray-500 hover:underline">
            Cancel
          </button>
        </div>
      </div>
      
      <div v-else>
        <p class="text-gray-800 mb-2">{{ comment.body }}</p>
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">
            By {{ comment.author.name }} |
            {{ new Date(comment.created_at).toLocaleDateString() }}
          </div>
          <div
            v-if="comment.author.id === currentUser?.id"
            class="flex space-x-2 items-center"
          >
            <PencilIcon
              @click="startEdit(comment)"
              class="text-blue-500 hover:underline size-4"
              >Edit</PencilIcon
            >
            <TrashIcon
              @click="deleteComment(comment.id)"
              class="size-4 text-red-500 hover:underline"
              >Delete</TrashIcon
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { BeakerIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  comments: {
    type: Array,
    required: true,
  },
  currentUser: Object,
});

const emit = defineEmits(["update-comment", "delete-comment"]);

const editingCommentId = ref(null);
const editedCommentBody = ref("");

const startEdit = (comment) => {
  editingCommentId.value = comment.id;
  editedCommentBody.value = comment.body;
};

const cancelEdit = () => {
  editingCommentId.value = null;
  editedCommentBody.value = "";
};

const saveEdit = (comment) => {
  emit("update-comment", { ...comment, body: editedCommentBody.value });
  cancelEdit();
};

const deleteComment = (commentId) => {
  if (confirm("Are you sure you want to delete this comment?")) {
    emit("delete-comment", commentId);
  }
};
</script>

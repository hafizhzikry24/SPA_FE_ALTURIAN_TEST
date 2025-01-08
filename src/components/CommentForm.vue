<template>
    <div class="bg-white rounded-lg shadow-md p-8 mt-6">
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Add Comment</h2>
      <p class="text-gray-600 mb-6">Share your thoughts about this post</p>
      
      <form @submit.prevent="submitComment">
        <div class="space-y-6">
          <div>
            <label for="comment" class="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <textarea
              id="comment"
              v-model="commentBody"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Write your comment"
            ></textarea>
          </div>
  
          <div class="flex justify-end space-x-4 pt-2">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Comment' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from '../axios';
  
  const props = defineProps({
    postId: {
      type: Number,
      required: true
    }
  });
  
  const emit = defineEmits(['comment-added']);
  
  const commentBody = ref('');
  const isSubmitting = ref(false);
  
  const submitComment = async () => {
    if (isSubmitting.value) return;
  
    isSubmitting.value = true;
    try {
      await axios.post(`/posts/${props.postId}/comments`, { 
        body: commentBody.value 
      });
      commentBody.value = '';
      emit('comment-added');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>
<template>
     <h2 class="text-2xl font-semibold text-gray-900 mb-4">Comments</h2>
      <CommentList 
        :comments="comments" 
        :currentUser="currentUser"
        @update-comment="updateComment"
        @delete-comment="deleteComment"
      />
      <CommentForm :post-id="postId" @comment-added="addComment" @comment-refetch="fetchComments"/>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';
import axios from '../axios'


const comments = ref([]);
const props = defineProps(['postId', "currentUser"]);
const addComment = async (newComment) => {
    try {
      const response = await axios.post(`/posts/${props.postId}/comments`, newComment);
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
  

  const fetchComments = async () => {
    console.log({"test": props.postId})
    try {
      const response = await axios.get(`/posts/${props.postId}/comments`);
      console.log(response.data)
      comments.value = response.data.data;
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  onMounted(fetchComments);
</script>

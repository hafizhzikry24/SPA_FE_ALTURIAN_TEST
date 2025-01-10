<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">Register</h1>
      <p class="text-gray-600 mb-6">
        Create a new account to access the platform
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Full Name</label
            >
            <input
              id="name"
              v-model="name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Enter your full name"
            />
            <p v-if="validationErrors.name" class="text-sm text-red-600">
              {{ validationErrors.name }}
            </p>
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Email</label
            >
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Enter your email"
            />
            <p v-if="validationErrors.email" class="text-sm text-red-600">
              {{ validationErrors.email }}
            </p>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Password</label
            >
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Enter your password"
            />
            <p v-if="validationErrors.password" class="text-sm text-red-600">
              {{ validationErrors.password }}
            </p>
          </div>

          <div>
            <label
              for="password_confirmation"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Confirm Password</label
            >
            <input
              id="password_confirmation"
              v-model="passwordConfirmation"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Confirm your password"
            />
            <p
              v-if="validationErrors.password_confirmation"
              class="text-sm text-red-600"
            >
              {{ validationErrors.password_confirmation }}
            </p>
          </div>

          <div class="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              @click="navigateToLogin"
            >
              Cancel
            </button>

            <button
              type="submit"
              :disabled="isLoading"
              class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              {{ isLoading ? "Registering..." : "Register" }}
            </button>
          </div>
        </div>
      </form>

      <p v-if="error" class="mt-4 text-sm text-red-600 text-center">
        {{ error }}
      </p>
      <p v-if="success" class="mt-4 text-sm text-green-600 text-center">
        {{ success }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "../axios";
import { useRouter } from "vue-router";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const error = ref("");
const success = ref("");
const isLoading = ref(false);
const validationErrors = ref({});

const navigateToLogin = () => {
  router.push("/");
};

const handleSubmit = async () => {
  if (password.value !== passwordConfirmation.value) {
    error.value = "Passwords do not match";
    return;
  }

  isLoading.value = true;
  error.value = "";
  success.value = "";
  validationErrors.value = {};

  try {
    const response = await axios.post("/register", {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });

    success.value = "Registration successful";
    localStorage.setItem("token", response.data.access_token);

    router.push("/blog");
  } catch (err) {
    if (err.response && err.response.data) {
      if (err.response.data.errors) {
        const errors = err.response.data.errors;
        validationErrors.value = Object.fromEntries(
          Object.entries(errors).map(([field, messages]) => [
            field,
            messages[0],
          ])
        );

        setTimeout(() => {
          validationErrors.value = {};
        }, 3000);
      } else {
        error.value = err.response?.data?.message || "An error occurred";
      }
    } else {
      error.value = err.message || "An error occurred";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

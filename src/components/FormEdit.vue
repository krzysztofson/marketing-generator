<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  msg: {
    type: String,
    required: false
  }
})

const goBack = () => {
  router.push('/')
}

const handleGenerate = () => {
  // Placeholder for generate functionality
  console.log('Generate clicked')
}
</script>

<template>
  <div class="container px-4 mx-auto py-24">
    <h2 class="text-4xl">Edit Your Marketing Content</h2>
    <div class="grid lg:grid-cols-2 gap-8 mb-8">
      <div class="mt-6">
        <label class="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-4"
          placeholder="Title"
        />

        <label class="block text-sm font-medium mb-2">Description</label>
        <textarea
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-4"
          rows="6"
          placeholder="Description"
        ></textarea>

        <input
          type="text"
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-6"
          placeholder="Call to action text"
        />
        <input
          type="text"
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-6"
          placeholder="Image URL"
        />
      </div>
      <div>id</div>
    </div>

    <div class="flex gap-4">
      <button
        @click="goBack"
        class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
      >
        Back
      </button>
      <button
        @click="handleGenerate"
        class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
      >
        Generate
      </button>
    </div>
  </div>
</template>

<style scoped>
h2 {
  font-weight: 500;
}

label {
  color: #e5e7eb;
}

input,
textarea {
  color: #fff;
}

input::placeholder,
textarea::placeholder {
  color: #9ca3af;
}
</style>

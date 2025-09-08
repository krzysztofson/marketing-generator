<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMarketingStore } from '@/stores/marketing'

const router = useRouter()
const marketing = useMarketingStore()
const { title, description, cta, imageUrl } = storeToRefs(marketing)

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
  console.log('Download clicked', {
    title: title.value,
    description: description.value,
    cta: cta.value,
    imageUrl: imageUrl.value
  })
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
          v-model="title"
        />

        <label class="block text-sm font-medium mb-2">Description</label>
        <textarea
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-4"
          rows="6"
          placeholder="Description"
          v-model="description"
        ></textarea>

        <input
          type="text"
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-6"
          placeholder="Call to action text"
          v-model="cta"
        />
        <input
          type="text"
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-6"
          placeholder="Image URL"
          v-model="imageUrl"
        />
      </div>
      <div>
        <div class="aspect-[1/1] bg-white relative overflow-hidden">
          <img src="../assets/logo.svg" class="w-1/2 absolute left-4 top-4" alt="logo" />
          <div
            class="absolute inset-0 w-3/4 bg-gradient-to-r from-blue-300/50 to-transparent pointer-events-none"
          ></div>
          <div class="absolute top-1/2 left-4 z-10">
            <h3 class="text-2xl font-semibold text-gray-900">{{ title }}</h3>
            <p class="mt-2 text-gray-800">{{ description }}</p>
            <button class="mt-4 bg-blue-600 text-white px-3 py-1 rounded">
              {{ cta || 'Call to Action' }}
            </button>
          </div>
          <img v-if="imageUrl" :src="imageUrl" class="object-cover w-full h-full" alt="preview" />
        </div>
      </div>
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
        Download
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

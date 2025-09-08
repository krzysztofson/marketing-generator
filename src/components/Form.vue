<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  msg: {
    type: String,
    required: true
  }
})

const goToFormEdit = () => {
  router.push('/form-edit')
}
</script>

<template>
  <div class="container px-4 mx-auto py-24">
    <h2 class="text-4xl">Brief</h2>
    <textarea
      class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mt-6"
      name="brief"
      id="brief"
      rows="10"
    ></textarea>
    <button
      @click="goToFormEdit"
      class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
    >
      Next
    </button>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>

<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMarketingStore } from '@/stores/marketing'
import { ref, computed } from 'vue'
import html2canvas from 'html2canvas'

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

const previewRef = ref(null)
const isGenerating = ref(false)

// Helper function to convert image to base64
const getImageAsBase64 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.warn('Failed to convert image to base64:', error)
    return imageUrl
  }
}

const handleGenerate = async () => {
  if (!previewRef.value) {
    console.error('Preview element not found')
    return
  }

  isGenerating.value = true

  try {
    // First, try to convert external images to base64 to avoid CORS issues
    if (imageUrl.value && (imageUrl.value.startsWith('http') || imageUrl.value.startsWith('//'))) {
      const base64Image = await getImageAsBase64(imageUrl.value)
      const img = previewRef.value.querySelector('img[alt="preview"]')
      if (img && base64Image !== imageUrl.value) {
        img.src = base64Image
        // Wait for the new image to load
        await new Promise((resolve) => {
          if (img.complete) resolve()
          else {
            img.onload = resolve
            setTimeout(resolve, 2000) // timeout fallback
          }
        })
      }
    }

    // Wait for all images to load
    const images = previewRef.value.querySelectorAll('img')
    const imagePromises = Array.from(images).map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve()
        } else {
          img.onload = resolve
          img.onerror = resolve // Don't fail on image errors
          setTimeout(resolve, 3000) // timeout fallback
        }
      })
    })

    await Promise.all(imagePromises)

    // Add a small delay to ensure everything is rendered
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Configure html2canvas with settings optimized for external images
    const canvas = await html2canvas(previewRef.value, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
      width: previewRef.value.offsetWidth,
      height: previewRef.value.offsetHeight,
      scrollX: 0,
      scrollY: 0
    })

    // Verify canvas has content
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas is empty - please check console for errors')
    }

    // Create download link
    const link = document.createElement('a')
    link.download = `marketing-${title.value?.replace(/\s+/g, '-').toLowerCase() || 'preview'}.png`
    link.href = canvas.toDataURL('image/png', 1.0)

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log('Image downloaded successfully', {
      width: canvas.width,
      height: canvas.height,
      originalImageUrl: imageUrl.value
    })
  } catch (error) {
    console.error('Error generating image:', error)
    alert(`Failed to generate image: ${error.message}\nCheck console for more details.`)
  } finally {
    isGenerating.value = false
  }
}

// Customization controls
const aspectRatio = ref('square') // square | landscape | portrait | story
const showLogo = ref(true)
const imageFit = ref('cover') // cover | contain
const gradientEnabled = ref(true)
const gradientColor = ref('blue') // blue | purple | black
const textVPos = ref('center') // top | center | bottom
const fontStyle = ref('elegant') // elegant | modern | classic
const textColor = ref('dark') // dark | light | white | blue

const aspectClass = computed(() => {
  const map = {
    square: 'aspect-[1/1]',
    landscape: 'aspect-[16/9]',
    portrait: 'aspect-[4/5]',
    story: 'aspect-[9/16]'
  }
  return map[aspectRatio.value] || map.square
})

const imageObjectClass = computed(() =>
  imageFit.value === 'contain' ? 'object-contain' : 'object-cover'
)

const gradientRGB = computed(() => {
  switch (gradientColor.value) {
    case 'purple':
      return '168,85,247' // purple-500
    case 'black':
      return '0,0,0'
    case 'blue':
    default:
      return '96,165,250' // blue-400
  }
})

const gradientStyle = computed(() => {
  if (!gradientEnabled.value) return { display: 'none' }
  const rgb = gradientRGB.value
  return {
    background: `linear-gradient(to right, rgba(${rgb},0.9) 0%, rgba(${rgb},0.9) 33%, rgba(${rgb},0) 100%)`
  }
})

const textPositionClass = computed(() => {
  if (textVPos.value === 'top') return 'top-4'
  if (textVPos.value === 'bottom') return 'bottom-4'
  return 'top-1/2 -translate-y-1/2'
})

const fontClasses = computed(() => {
  const styles = {
    elegant: {
      heading: 'font-heading font-semibold', // Playfair Display
      body: 'font-body',
      button: 'font-body font-medium'
    },
    modern: {
      heading: 'font-sans font-bold tracking-tight',
      body: 'font-sans font-light',
      button: 'font-sans font-semibold'
    },
    classic: {
      heading: 'font-heading font-bold tracking-wide',
      body: 'font-serif',
      button: 'font-sans font-medium'
    }
  }
  return styles[fontStyle.value] || styles.elegant
})

const textColorClasses = computed(() => {
  const colors = {
    dark: {
      heading: 'text-gray-900',
      body: 'text-gray-800',
      button: 'text-white'
    },
    light: {
      heading: 'text-gray-700',
      body: 'text-gray-600',
      button: 'text-white'
    },
    white: {
      heading: 'text-white',
      body: 'text-gray-100',
      button: 'text-gray-900'
    },
    blue: {
      heading: 'text-blue-900',
      body: 'text-blue-800',
      button: 'text-white'
    }
  }
  return colors[textColor.value] || colors.dark
})
</script>

<template>
  <div class="container px-4 mx-auto py-24">
    <h2 class="text-4xl font-heading font-semibold mb-6">Edit Your Marketing Content</h2>
    <div class="grid lg:grid-cols-2 gap-8 mb-8">
      <div class="mt-6">
        <label class="block text-sm font-medium mb-2 font-body">Title</label>
        <input
          type="text"
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-4"
          placeholder="Title"
          v-model="title"
        />

        <label class="block text-sm font-medium mb-2 font-body">Description</label>
        <textarea
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-4 font-body"
          rows="6"
          placeholder="Description"
          v-model="description"
        ></textarea>

        <input
          type="text"
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-6 font-body"
          placeholder="Call to action text"
          v-model="cta"
        />
        <input
          type="text"
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-6 font-body"
          placeholder="Image URL"
          v-model="imageUrl"
        />

        <h3 class="text-lg font-heading font-medium mt-8 mb-3">Customization</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1 font-body">Aspect ratio</label>
            <select
              v-model="aspectRatio"
              class="w-full bg-gray-800 border border-gray-300 rounded-md p-2 font-body"
            >
              <option value="square">1:1 (Square)</option>
              <option value="portrait">4:5 (Portrait)</option>
              <option value="story">9:16 (Story)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1 font-body">Image fit</label>
            <select
              v-model="imageFit"
              class="w-full bg-gray-800 border border-gray-300 rounded-md p-2 font-body"
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <input id="toggleLogo" type="checkbox" v-model="showLogo" class="h-4 w-4" />
            <label for="toggleLogo" class="text-sm">Show logo</label>
          </div>
          <div class="flex items-center gap-2">
            <input id="toggleGradient" type="checkbox" v-model="gradientEnabled" class="h-4 w-4" />
            <label for="toggleGradient" class="text-sm">Gradient overlay</label>
          </div>
          <div v-if="gradientEnabled">
            <label class="block text-sm mb-1">Gradient color</label>
            <select
              v-model="gradientColor"
              class="w-full bg-gray-800 border border-gray-300 rounded-md p-2"
            >
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="black">Black</option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1">Text position</label>
            <select
              v-model="textVPos"
              class="w-full bg-gray-800 border border-gray-300 rounded-md p-2"
            >
              <option value="top">Top</option>
              <option value="center">Center</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1">Font style</label>
            <select
              v-model="fontStyle"
              class="w-full bg-gray-800 border border-gray-300 rounded-md p-2"
            >
              <option value="elegant">Elegant (Playfair + Inter)</option>
              <option value="modern">Modern (Inter)</option>
              <option value="classic">Classic (Mixed)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1">Text color</label>
            <select
              v-model="textColor"
              class="w-full bg-gray-800 border border-gray-300 rounded-md p-2"
            >
              <option value="dark">Dark (Gray/Black)</option>
              <option value="light">Light Gray</option>
              <option value="white">White</option>
              <option value="blue">Blue</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <div ref="previewRef" :class="[aspectClass, 'bg-white relative overflow-hidden']">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :class="[imageObjectClass, 'w-full h-full']"
            alt="preview"
          />
          <div
            class="absolute z-10 inset-0 w-full pointer-events-none"
            :style="gradientStyle"
          ></div>
          <img
            v-if="showLogo"
            src="../assets/logo.svg"
            class="w-1/2 absolute left-4 top-4 z-20"
            alt="logo"
          />
          <div class="absolute left-4 z-10 w-2/3" :class="textPositionClass">
            <h3 :class="['text-2xl leading-tight', fontClasses.heading, textColorClasses.heading]">
              {{ title }}
            </h3>
            <p :class="['mt-2 leading-relaxed', fontClasses.body, textColorClasses.body]">
              {{ description }}
            </p>
            <button
              :class="[
                'mt-4 bg-blue-600 px-3 py-1 rounded',
                fontClasses.button,
                textColorClasses.button
              ]"
            >
              {{ cta || 'Call to Action' }}
            </button>
          </div>
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
        :disabled="isGenerating"
        class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg
          v-if="isGenerating"
          class="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{ isGenerating ? 'Generating...' : 'Download Image' }}
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

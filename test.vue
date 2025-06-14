<template>
  <div class="p-6 w-full max-w-2xl mx-auto">
    <!-- Контент до генерации -->
    <transition name="fade">
      <div v-if="!isGenerating" class="space-y-4">
        <h2 class="text-2xl font-bold">Code Input</h2>

        <textarea
            v-model="code"
            placeholder="Enter your code here..."
            class="w-full h-48 p-2 border rounded resize-none"
        />

        <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div class="flex flex-col w-full">
            <label class="font-medium mb-1">Number of Noises</label>
            <input
                v-model.number="noiseCount"
                type="number"
                min="0"
                class="border p-2 rounded"
            />
          </div>

          <div class="flex flex-col w-full">
            <label class="font-medium mb-1">Noise Level: {{ noiseLevel }}</label>
            <input
                v-model.number="noiseLevel"
                type="range"
                min="1"
                max="100"
                class="w-full"
            />
          </div>
        </div>

        <button
            @click="startGeneration"
            class="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Generate
        </button>
      </div>
    </transition>

    <!-- Generating -->
    <transition name="fade">
      <div v-if="isGenerating" class="flex items-center justify-center h-64">
        <p
            class="text-xl font-semibold animate-pulse text-gray-800"
            :class="generatingClass"
        >
          Generating...
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const code = ref('')
const noiseCount = ref(1)
const noiseLevel = ref(50)
const isGenerating = ref(false)

function startGeneration() {
  isGenerating.value = true

  // Имитация генерации (3 секунды)
  setTimeout(() => {
    // Здесь может быть переход на другой экран или логика
    console.log('Generated task with code:', code.value)
    // isGenerating.value = false  // Оставим true, если на экране появится что-то другое потом
  }, 3000)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-pulse {
  animation: pulse-color 1.5s infinite;
}

@keyframes pulse-color {
  0% {
    color: black;
  }
  50% {
    color: gray;
  }
  100% {
    color: black;
  }
}
</style>

<template>
  <div class="main-content-wrapper"> <span class="code-problem-generator">Code Problem Generator</span>
    <span class="generate-coding-problems"
      >Generate coding problems to test your skills and improve your coding abilities.</span
    >
    <div class="start-button-1">
      <a class="get-started" href="#" @click.prevent="navigateTo('/start')">Get started</a>
    </div>
    <div class="frame">
      <span class="enhance-coding-skills">Enhance Coding Skills</span>
      <span class="improve-coding-abilities"
        >Improve your coding abilities with our unique problem types</span
      >
      <div class="flex-row-cb">
        <span class="fill-in-gaps">Fill in the gaps problems</span>
        <span class="remove-noises">Remove noises problems</span>
      </div>
      <div class="flex-row-3">
        <span class="practice-missing-code"
          >Users can practice filling in missing code elements</span
        >
        <span class="practice-identifying-removing"
          >Users can practice identifying and removing extra code lines</span
        >
      </div>
      <div class="flex-row-fb">
        <a class="try-now" href="#" @click.prevent="navigateTo('/fill-gaps')">Try now →</a>
        <a class="try-now-4" href="#" @click.prevent="navigateTo('/remove-noices')">Try now →</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const navigateTo = (path) => {
  router.push(path)
}
</script>
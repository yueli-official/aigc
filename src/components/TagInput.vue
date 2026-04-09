<script setup lang="ts">
import { ref } from 'vue'

const model = defineModel<string[]>({ required: true })
defineProps<{ placeholder?: string }>()

const input = ref('')
const focused = ref(false)

function addTag() {
  const value = input.value.trim()
  if (value && !model.value.includes(value)) {
    model.value = [...model.value, value]
  }
  input.value = ''
}

function removeTag(index: number) {
  model.value = model.value.filter((_, i) => i !== index)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag()
  }
  if (e.key === 'Backspace' && input.value === '' && model.value.length > 0) {
    model.value = model.value.slice(0, -1)
  }
}
</script>

<template>
  <div
    :class="[
      'flex flex-wrap items-center gap-1.5 rounded-lg px-3 py-2 min-h-[40px] transition-colors duration-150',
      'bg-[#111115] border',
      focused ? 'border-white/30' : 'border-white/[0.08] hover:border-white/15'
    ]"
  >
    <span
      v-for="(tag, index) in model"
      :key="index"
      class="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-[3px] rounded-md text-[11px] font-medium bg-white/[0.06] text-white/70"
    >
      {{ tag }}
      <button
        type="button"
        class="flex items-center justify-center w-4 h-4 rounded text-white/25 hover:text-red-400 cursor-pointer transition-colors"
        @click="removeTag(index)"
      >
        <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
    <input
      v-model="input"
      :placeholder="model.length === 0 ? placeholder : ''"
      class="flex-1 min-w-[100px] bg-transparent outline-none text-[11px] text-white/80 placeholder-white/25"
      @keydown="onKeydown"
      @blur="addTag(); focused = false"
      @focus="focused = true"
    />
  </div>
</template>

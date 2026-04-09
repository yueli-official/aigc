<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useFormStore } from '@/stores/form'
import SectionCard from './SectionCard.vue'

const { t } = useI18n()
const store = useFormStore()
</script>

<template>
  <SectionCard :title="t('section.prompts')">
    <template #icon>
      <svg class="w-3.5 h-3.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    </template>

    <div class="space-y-4">
      <UFormField :label="t('prompt.finalPrompt')">
        <UTextarea v-model="store.prompts.finalPrompt" class="w-full" :rows="3" placeholder="A cinematic wide shot of..." />
      </UFormField>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField :label="t('prompt.camera')">
          <UTextarea v-model="store.prompts.camera" class="w-full" :rows="2" />
        </UFormField>
        <UFormField :label="t('prompt.lighting')">
          <UTextarea v-model="store.prompts.lighting" class="w-full" :rows="2" />
        </UFormField>
        <UFormField :label="t('prompt.colorGrade')">
          <UTextarea v-model="store.prompts.colorGrade" class="w-full" :rows="2" />
        </UFormField>
        <UFormField :label="t('prompt.texture')">
          <UTextarea v-model="store.prompts.texture" class="w-full" :rows="2" />
        </UFormField>
      </div>
      <UFormField :label="t('prompt.moodStoryBeat')">
        <UTextarea v-model="store.prompts.moodStoryBeat" class="w-full" :rows="2" />
      </UFormField>
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useFormStore } from '@/stores/form'
import SectionCard from './SectionCard.vue'
import TagInput from './TagInput.vue'

const { t } = useI18n()
const store = useFormStore()

const aspectRatioOptions = [
  { label: '16:9', value: '16:9' },
  { label: '9:16', value: '9:16' },
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '3:4', value: '3:4' },
]
</script>

<template>
  <SectionCard :title="t('section.textToImage')">
    <template #icon>
      <svg class="w-3.5 h-3.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
      </svg>
    </template>

    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UFormField :label="t('t2i.aspectRatio')">
          <USelect v-model="store.textToImage.aspect_ratio" :items="aspectRatioOptions" class="w-full" />
        </UFormField>
        <UFormField :label="t('t2i.camera')">
          <UInput v-model="store.textToImage.camera" class="w-full" />
        </UFormField>
        <UFormField :label="t('t2i.lensMm')">
          <UInput v-model.number="store.textToImage.lens_mm" type="number" class="w-full" placeholder="35" />
        </UFormField>
        <UFormField :label="t('t2i.aperture')">
          <UInput v-model="store.textToImage.aperture" class="w-full" placeholder="f/2.8" />
        </UFormField>
        <UFormField :label="t('t2i.lighting')">
          <UInput v-model="store.textToImage.lighting" class="w-full" />
        </UFormField>
        <UFormField :label="t('t2i.grade')">
          <UInput v-model="store.textToImage.grade" class="w-full" />
        </UFormField>
      </div>
      <UFormField :label="t('t2i.texture')">
        <UInput v-model="store.textToImage.texture" class="w-full" />
      </UFormField>
      <UFormField :label="t('t2i.styleTags')">
        <TagInput v-model="store.textToImage.style_tags" :placeholder="t('t2i.tagPlaceholder')" />
      </UFormField>
      <UFormField :label="t('t2i.negative')">
        <TagInput v-model="store.textToImage.negative" :placeholder="t('t2i.tagPlaceholder')" />
      </UFormField>
    </div>
  </SectionCard>
</template>

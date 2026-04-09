<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useFormStore } from '@/stores/form'
import SectionCard from './SectionCard.vue'

import { ref } from 'vue'

const { t } = useI18n()
const store = useFormStore()
const imported = ref(false)

function importFromT2i() {
  store.imageToVideo.aspect_ratio = store.textToImage.aspect_ratio
  store.imageToVideo.camera = store.textToImage.camera
  store.imageToVideo.lens_mm = store.textToImage.lens_mm
  store.imageToVideo.aperture = store.textToImage.aperture
  imported.value = true
  setTimeout(() => (imported.value = false), 2000)
}

const motionCurveOptions = [
  { label: 'ease-in', value: 'ease-in' },
  { label: 'ease-out', value: 'ease-out' },
  { label: 'ease-in-out', value: 'ease-in-out' },
  { label: 'linear', value: 'linear' },
]
const dofOptions = [
  { label: 'enabled', value: 'enabled' },
  { label: 'disabled', value: 'disabled' },
]
const grainOptions = [
  { label: 'none', value: 'none' },
  { label: 'subtle', value: 'subtle' },
  { label: 'light', value: 'light' },
  { label: 'heavy', value: 'heavy' },
]
const parallaxOptions = [
  { label: 'enabled', value: 'enabled' },
  { label: 'disabled', value: 'disabled' },
]

const aspectRatioOptions = [
  { label: '16:9', value: '16:9' },
  { label: '9:16', value: '9:16' },
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '3:4', value: '3:4' },
]
</script>

<template>
  <SectionCard :title="t('section.imageToVideo')">
    <template #icon>
      <svg class="w-3.5 h-3.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    </template>

    <template #actions>
      <div class="group/tip relative">
        <button
          @click="importFromT2i"
          :class="[
            'inline-flex items-center gap-1.5 px-2.5 h-7 rounded-lg text-[11px] font-medium transition-all duration-150 cursor-pointer',
            imported
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04] border border-white/6',
          ]"
        >
          <svg v-if="!imported" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          {{ imported ? t('i2v.imported') : t('i2v.importFromT2i') }}
        </button>
        <span class="shortcut-tip">{{ t('i2v.importHint') }}</span>
      </div>
    </template>

    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UFormField :label="t('i2v.aspectRatio')">
          <USelect v-model="store.imageToVideo.aspect_ratio" :items="aspectRatioOptions" class="w-full" />
        </UFormField>
        <UFormField :label="t('i2v.camera')">
          <UInput v-model="store.imageToVideo.camera" class="w-full" />
        </UFormField>
        <UFormField :label="t('i2v.lensMm')">
          <UInput v-model.number="store.imageToVideo.lens_mm" type="number" class="w-full" placeholder="35" />
        </UFormField>
        <UFormField :label="t('i2v.aperture')">
          <UInput v-model="store.imageToVideo.aperture" class="w-full" placeholder="f/2.8" />
        </UFormField>
        <UFormField :label="t('i2v.durationS')">
          <UInput v-model.number="store.imageToVideo.duration_s" type="number" class="w-full" />
        </UFormField>
        <UFormField :label="t('i2v.movement')">
          <UInput v-model="store.imageToVideo.movement" class="w-full" />
        </UFormField>
        <UFormField :label="t('i2v.motionCurve')">
          <USelect v-model="store.imageToVideo.motion_curve" :items="motionCurveOptions" class="w-full" />
        </UFormField>
        <UFormField :label="t('i2v.stabilization')">
          <UInput v-model="store.imageToVideo.stabilization" class="w-full" />
        </UFormField>
        <UFormField :label="t('i2v.depthOfField')">
          <USelect v-model="store.imageToVideo.depth_of_field" :items="dofOptions" class="w-full" />
        </UFormField>
        <UFormField v-if="store.imageToVideo.depth_of_field === 'enabled'" :label="t('i2v.focusTarget')">
          <UInput v-model="store.imageToVideo.focus_target" class="w-full" />
        </UFormField>
        <UFormField :label="t('i2v.grain')">
          <USelect v-model="store.imageToVideo.grain" :items="grainOptions" class="w-full" />
        </UFormField>
        <UFormField :label="t('i2v.parallax')">
          <USelect v-model="store.imageToVideo.parallax" :items="parallaxOptions" class="w-full" />
        </UFormField>
      </div>

      <div v-if="store.imageToVideo.parallax === 'enabled'" class="rounded-lg bg-white/[0.02] border border-white/6 p-4">
        <UFormField :label="t('i2v.strength')">
          <div class="flex items-center gap-4">
            <input
              type="range"
              :value="store.imageToVideo.strength"
              @input="store.imageToVideo.strength = Number(($event.target as HTMLInputElement).value)"
              min="0"
              max="1"
              step="0.01"
              class="flex-1 h-1.5 appearance-none bg-white/10 rounded-full outline-none accent-zinc-600 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-600 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span class="text-sm font-mono text-white/60 tabular-nums w-12 text-right">{{ store.imageToVideo.strength.toFixed(2) }}</span>
          </div>
        </UFormField>
      </div>

      <UFormField :label="t('i2v.shotNotes')">
        <UTextarea v-model="store.imageToVideo.shot_notes" class="w-full" :rows="3" />
      </UFormField>
    </div>
  </SectionCard>
</template>

import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import i18n from '@/i18n'

export type TabMode = 't2i' | 'i2v' | 'both'

export const useFormStore = defineStore('form', () => {
  const activeTab = ref<TabMode>('both')

  const prompts = reactive({
    finalPrompt: '',
    camera: '',
    lighting: '',
    colorGrade: '',
    texture: '',
    moodStoryBeat: '',
  })

  const textToImage = reactive({
    aspect_ratio: '16:9',
    camera: '',
    lens_mm: null as number | null,
    aperture: '',
    lighting: '',
    grade: '',
    texture: '',
    style_tags: [] as string[],
    negative: [] as string[],
  })

  const imageToVideo = reactive({
    aspect_ratio: '16:9',
    camera: '',
    lens_mm: null as number | null,
    aperture: '',
    duration_s: 8,
    movement: '',
    motion_curve: 'ease-in-out',
    stabilization: '',
    depth_of_field: 'disabled' as 'enabled' | 'disabled',
    focus_target: '',
    grain: 'none' as 'none' | 'subtle' | 'light' | 'heavy',
    parallax: 'disabled' as 'enabled' | 'disabled',
    strength: 0.35,
    shot_notes: '',
  })

  const outputJson = computed(() => {
    const dofValue =
      imageToVideo.depth_of_field === 'enabled'
        ? `enabled, focus_target: ${imageToVideo.focus_target}`
        : 'disabled'

    const parallaxValue =
      imageToVideo.parallax === 'enabled'
        ? `enabled, strength: ${imageToVideo.strength}`
        : 'disabled'

    const params: Record<string, unknown> = {}

    if (activeTab.value === 't2i' || activeTab.value === 'both') {
      params.TextToImage = {
        aspect_ratio: textToImage.aspect_ratio,
        camera: textToImage.camera,
        lens_mm: textToImage.lens_mm,
        aperture: textToImage.aperture,
        lighting: textToImage.lighting,
        grade: textToImage.grade,
        texture: textToImage.texture,
        style_tags: textToImage.style_tags,
        negative: textToImage.negative,
      }
    }

    if (activeTab.value === 'i2v' || activeTab.value === 'both') {
      params.ImageToVideo = {
        aspect_ratio: imageToVideo.aspect_ratio,
        camera: imageToVideo.camera,
        lens_mm: imageToVideo.lens_mm,
        aperture: imageToVideo.aperture,
        duration_s: imageToVideo.duration_s,
        movement: imageToVideo.movement,
        motion_curve: imageToVideo.motion_curve,
        stabilization: imageToVideo.stabilization,
        depth_of_field: dofValue,
        grain: imageToVideo.grain,
        parallax: parallaxValue,
        shot_notes: imageToVideo.shot_notes,
      }
    }

    return {
      prompt: {
        [i18n.global.locale.value === 'zh-CN' ? 'Final Prompt (ZH)' : 'Final Prompt (EN)']: prompts.finalPrompt,
        Camera: prompts.camera,
        Lighting: prompts.lighting,
        'Color/Grade': prompts.colorGrade,
        Texture: prompts.texture,
        'Mood/Story beat': prompts.moodStoryBeat,
      },
      Parameters: params,
    }
  })

  function reset() {
    Object.assign(prompts, {
      finalPrompt: '',
      camera: '',
      lighting: '',
      colorGrade: '',
      texture: '',
      moodStoryBeat: '',
    })
    Object.assign(textToImage, {
      aspect_ratio: '16:9',
      camera: '',
      lens_mm: null,
      aperture: '',
      lighting: '',
      grade: '',
      texture: '',
      style_tags: [],
      negative: [],
    })
    Object.assign(imageToVideo, {
      aspect_ratio: '16:9',
      camera: '',
      lens_mm: null,
      aperture: '',
      duration_s: 8,
      movement: '',
      motion_curve: 'ease-in-out',
      stabilization: '',
      depth_of_field: 'disabled',
      focus_target: '',
      grain: 'none',
      parallax: 'disabled',
      strength: 0.35,
      shot_notes: '',
    })
  }

  return { activeTab, prompts, textToImage, imageToVideo, outputJson, reset }
})

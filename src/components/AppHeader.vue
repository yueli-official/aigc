<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const showAbout = ref(false)

function toggleLocale() {
  locale.value = locale.value === 'zh-CN' ? 'en' : 'zh-CN'
}
</script>

<template>
  <header class="sticky top-0 z-20 flex items-center justify-between px-5 md:px-8 h-14 bg-[#111115]/80 backdrop-blur-xl border-b border-white/6">
    <div class="flex items-center gap-3">
      <div class="relative flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-700 shadow-[0_0_16px_rgba(82,82,91,0.35)]">
        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      </div>
      <span class="text-[15px] font-semibold text-white/80">{{ t('app.title') }}</span>
    </div>

    <div class="flex items-center gap-1">
      <button
        @click="showAbout = true"
        class="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-[11px] font-medium text-white/30 hover:text-white/60 transition-colors duration-150 cursor-pointer"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <span class="hidden sm:inline">{{ t('app.about') }}</span>
      </button>

      <button
        @click="toggleLocale"
        class="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-[11px] font-medium text-white/30 hover:text-white/60 transition-colors duration-150 cursor-pointer"
      >
        {{ locale === 'zh-CN' ? 'English' : '中文' }}
      </button>
    </div>

    <!-- Animated gradient accent line -->
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </header>

  <!-- About dialog -->
  <Teleport to="body">
    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showAbout"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/60" @click="showAbout = false" />

        <div class="relative w-full max-w-sm mx-4 rounded-2xl bg-[#1c1c22] border border-white/6 p-6 space-y-5">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-700 shadow-[0_0_20px_rgba(82,82,91,0.3)]">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <div>
                <h3 class="text-[14px] font-semibold text-white/90">{{ t('app.title') }}</h3>
                <span class="text-[10px] text-white/25">{{ t('app.version') }} 1.0.0</span>
              </div>
            </div>
            <button
              @click="showAbout = false"
              class="flex items-center justify-center w-7 h-7 rounded-lg text-white/25 hover:text-white/60 transition-colors duration-150 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Description -->
          <p class="text-[12px] leading-relaxed text-white/40">{{ t('app.aboutDesc') }}</p>

          <!-- Links -->
          <div class="space-y-3">
            <!-- GitHub -->
            <a
              href="https://github.com/yueli-official/aigc"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/6 hover:border-white/12 hover:bg-white/[0.05] transition-all duration-150 group"
            >
              <svg class="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <div class="flex-1 min-w-0">
                <div class="text-[12px] font-medium text-white/70 group-hover:text-white/90 transition-colors">{{ t('app.sourceCode') }}</div>
                <div class="text-[10px] text-white/25 truncate">github.com/yueli-official/aigc</div>
              </div>
              <svg class="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>

            <!-- Bilibili -->
            <a
              href="https://space.bilibili.com/4279370"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/6 hover:border-white/12 hover:bg-white/[0.05] transition-all duration-150 group"
            >
              <svg class="w-5 h-5 text-white/40 group-hover:text-[#00a1d6] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
              </svg>
              <div class="flex-1 min-w-0">
                <div class="text-[12px] font-medium text-white/70 group-hover:text-white/90 transition-colors">Bilibili</div>
                <div class="text-[10px] text-white/25 truncate">space.bilibili.com/4279370</div>
              </div>
              <svg class="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>

            <!-- Contact / Issues -->
            <a
              href="https://github.com/yueli-official/aigc/issues"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/6 hover:border-white/12 hover:bg-white/[0.05] transition-all duration-150 group"
            >
              <svg class="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <div class="flex-1 min-w-0">
                <div class="text-[12px] font-medium text-white/70 group-hover:text-white/90 transition-colors">{{ t('app.contact') }}</div>
                <div class="text-[10px] text-white/25">{{ t('app.contactDesc') }}</div>
              </div>
              <svg class="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>

          <!-- Footer -->
          <p class="text-[10px] text-white/15 text-center pt-1">Built with Vue 3 + Nuxt UI + TailwindCSS</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

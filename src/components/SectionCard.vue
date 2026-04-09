<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <section class="group relative rounded-2xl bg-[#1c1c22] border border-white/6 transition-all duration-300 hover:border-white/10">
    <!-- Subtle top accent gradient -->
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    <!-- Hover glow effect -->
    <div class="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <div class="relative">
      <div class="flex items-center gap-2.5 px-5 py-4">
        <slot name="icon" />
        <h2 class="text-sm font-semibold text-white/80">{{ title }}</h2>
        <div class="ml-auto">
          <slot name="actions" />
        </div>
      </div>
      <div class="px-5 pb-5 space-y-4">
        <slot />
      </div>
    </div>
  </section>
</template>

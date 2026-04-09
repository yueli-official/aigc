<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useFormStore } from "@/stores/form";

defineProps<{ embedded?: boolean }>();
const { t } = useI18n();
const store = useFormStore();
const copied = ref(false);
const emit = defineEmits<{ close: [] }>();

const jsonString = computed(() => JSON.stringify(store.outputJson, null, 2));

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const highlighted = computed(() => {
  return jsonString.value.replace(
    /("(?:[^"\\]|\\.)*")\s*(:?)|\b(\d+(?:\.\d+)?)\b|([{}[\],])|(\bnull\b)/g,
    (match, str, colon, num, bracket, nul) => {
      if (str && colon) return `<span class="jk">${esc(str)}</span>:`;
      if (str) return `<span class="js">${esc(str)}</span>`;
      if (num !== undefined && num !== "") return `<span class="jn">${num}</span>`;
      if (bracket) return `<span class="jb">${bracket}</span>`;
      if (nul) return `<span class="jnull">null</span>`;
      return match;
    },
  );
});

async function copyToClipboard() {
  await navigator.clipboard.writeText(jsonString.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

function downloadJson() {
  const blob = new Blob([jsonString.value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "aigc-params.json";
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="flex flex-col h-full bg-[#111115] pb-14">
    <!-- Header (hidden when embedded in sidebar) -->
    <div v-if="!embedded" class="flex items-center justify-between px-5 h-14 border-b border-white/6 shrink-0">
      <span class="text-[11px] tracking-[0.2em] text-white/30 uppercase">JSON</span>
      <div class="flex items-center gap-2">
        <button
          @click="copyToClipboard"
          :class="[
            'px-2.5 h-7 rounded-lg text-[11px] font-medium transition-colors duration-150 cursor-pointer',
            copied ? 'bg-emerald-500 text-white' : 'text-white/30 hover:text-white/60',
          ]"
        >
          {{ copied ? t("actions.copied") : t("actions.copy") }}
        </button>
        <button
          @click="downloadJson"
          class="px-2.5 h-7 rounded-lg text-[11px] font-medium text-white/30 hover:text-white/60 transition-colors duration-150 cursor-pointer"
        >
          {{ t("actions.download") }}
        </button>
        <button
          @click="emit('close')"
          class="flex items-center justify-center w-7 h-7 rounded-lg text-white/25 hover:text-white/60 transition-colors duration-150 cursor-pointer"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Compact toolbar when embedded -->
    <div v-else class="flex items-center gap-2 px-4 py-2 border-b border-white/6 shrink-0">
      <button
        @click="copyToClipboard"
        :class="[
          'px-2.5 h-7 rounded-lg text-[11px] font-medium transition-colors duration-150 cursor-pointer',
          copied ? 'bg-emerald-500 text-white' : 'text-white/30 hover:text-white/60',
        ]"
      >
        {{ copied ? t("actions.copied") : t("actions.copy") }}
      </button>
      <button
        @click="downloadJson"
        class="px-2.5 h-7 rounded-lg text-[11px] font-medium text-white/30 hover:text-white/60 transition-colors duration-150 cursor-pointer"
      >
        {{ t("actions.download") }}
      </button>
    </div>

    <!-- Code -->
    <pre
      class="json-hl flex-1 p-5 text-[11px] leading-[1.8] font-mono overflow-auto whitespace-pre-wrap break-words text-white/60"
      v-html="highlighted"
    />
  </div>
</template>

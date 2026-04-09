<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useHistoryStore, type EntryType, type TabMode } from "@/stores/history";

defineProps<{ embedded?: boolean }>();
const { t } = useI18n();
const history = useHistoryStore();
const emit = defineEmits<{ close: []; switchMode: [mode: TabMode] }>();

function modeLabel(mode: TabMode) {
  const keys: Record<TabMode, string> = {
    t2i: "section.textToImage",
    i2v: "section.imageToVideo",
    both: "section.both",
  };
  return t(keys[mode]);
}

const modeColors: Record<TabMode, string> = {
  t2i: "text-white/50 bg-white/[0.06]",
  i2v: "text-white/40 bg-white/[0.04]",
  both: "text-white/40 bg-white/[0.06]",
};

const activeTab = ref<EntryType>("memo");
const selectedIds = ref<Set<string>>(new Set());
const loadedId = ref<string | null>(null);

const filteredEntries = computed(() =>
  history.entries.filter((e) => e.type === activeTab.value),
);

const allSelected = computed(
  () => filteredEntries.value.length > 0 && selectedIds.value.size === filteredEntries.value.length,
);

function handleLoad(entry: (typeof history.entries)[number]) {
  const mode = history.load(entry);
  emit("switchMode", mode);
  loadedId.value = entry.id;
  setTimeout(() => (loadedId.value = null), 1500);
}

function toggleSelect(id: string) {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value.clear();
  } else {
    selectedIds.value = new Set(filteredEntries.value.map((e) => e.id));
  }
}

function clampPage() {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
}

function handleDeleteSelected() {
  history.removeBatch([...selectedIds.value]);
  selectedIds.value.clear();
  clampPage();
}

function handleClearAll() {
  if (confirm(t("history.confirmClear"))) {
    history.clearByType(activeTab.value);
    selectedIds.value.clear();
    currentPage.value = 1;
  }
}

function switchTab(tab: EntryType) {
  activeTab.value = tab;
  selectedIds.value.clear();
  currentPage.value = 1;
}

const PAGE_SIZE = 20;
const currentPage = ref(1);

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEntries.value.length / PAGE_SIZE)));

const pagedEntries = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return filteredEntries.value.slice(start, start + PAGE_SIZE);
});

function formatDate(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function previewText(entry: (typeof history.entries)[number]) {
  const prompt = (entry.prompts as Record<string, string>).finalPrompt || "";
  return prompt.length > 60 ? prompt.slice(0, 60) + "…" : prompt || "—";
}
</script>

<template>
  <div class="flex flex-col h-full bg-[#111115] pb-14">
    <!-- Header (hidden when embedded in sidebar) -->
    <div v-if="!embedded" class="flex items-center justify-between px-5 h-14 border-b border-white/6 shrink-0">
      <span class="text-[11px] tracking-[0.2em] text-white/30 uppercase">{{
        t("history.title")
      }}</span>
      <button
        @click="emit('close')"
        class="flex items-center justify-center w-7 h-7 rounded-lg text-white/25 hover:text-white/60 transition-colors duration-150 cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Tab switcher -->
    <div class="px-5 pt-4 pb-3">
      <div class="flex items-center gap-1 p-1 rounded-xl bg-[#1c1c22] border border-white/6">
        <button
          @click="switchTab('memo')"
          :class="[
            'flex-1 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors duration-150 cursor-pointer',
            activeTab === 'memo'
              ? 'bg-white/[0.08] text-white/80'
              : 'text-white/30 hover:text-white/60',
          ]"
        >
          {{ t("history.tabMemo") }}
        </button>
        <button
          @click="switchTab('history')"
          :class="[
            'flex-1 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors duration-150 cursor-pointer',
            activeTab === 'history'
              ? 'bg-white/[0.08] text-white/80'
              : 'text-white/30 hover:text-white/60',
          ]"
        >
          {{ t("history.tabHistory") }}
        </button>
      </div>
    </div>

    <!-- Batch actions -->
    <div
      v-if="filteredEntries.length > 0"
      class="flex items-center gap-2 px-5 pb-2"
    >
      <button
        @click="toggleSelectAll"
        class="text-[10px] text-white/30 hover:text-white/60 transition-colors cursor-pointer"
      >
        {{ allSelected ? t("history.unselectAll") : t("history.selectAll") }}
      </button>
      <button
        v-if="selectedIds.size > 0"
        @click="handleDeleteSelected"
        class="text-[10px] text-rose-400/70 hover:text-rose-400 transition-colors cursor-pointer"
      >
        {{ t("history.deleteSelected") }} ({{ selectedIds.size }})
      </button>
      <button
        @click="handleClearAll"
        class="ml-auto text-[10px] text-white/20 hover:text-rose-400/70 transition-colors cursor-pointer"
      >
        {{ t("history.clearAll") }}
      </button>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="filteredEntries.length === 0" class="flex flex-col items-center justify-center h-40 gap-1.5">
        <span class="text-[11px] text-white/20">
          {{ activeTab === 'memo' ? t("history.emptyMemo") : t("history.emptyHistory") }}
        </span>
      </div>

      <div v-else class="divide-y divide-white/[0.04]">
        <div
          v-for="entry in pagedEntries"
          :key="entry.id"
          class="group flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
        >
          <!-- Checkbox -->
          <button
            @click="toggleSelect(entry.id)"
            class="mt-0.5 shrink-0 w-4 h-4 rounded border transition-colors cursor-pointer flex items-center justify-center"
            :class="
              selectedIds.has(entry.id)
                ? 'bg-zinc-600 border-zinc-600'
                : 'border-white/15 hover:border-white/30'
            "
          >
            <svg
              v-if="selectedIds.has(entry.id)"
              class="w-2.5 h-2.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="3"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </button>

          <!-- Content (clickable to load) -->
          <button
            @click="handleLoad(entry)"
            class="flex-1 min-w-0 text-left cursor-pointer"
          >
            <div class="flex items-center gap-2">
              <span class="text-[11px] text-white/50 font-mono">{{ formatDate(entry.date) }}</span>
              <span
                :class="['text-[9px] font-semibold px-1.5 py-0.5 rounded', modeColors[entry.mode || 'both']]"
              >
                {{ modeLabel(entry.mode || "both") }}
              </span>
              <span
                v-if="loadedId === entry.id"
                class="text-[10px] text-emerald-400 font-medium"
              >
                {{ t("history.loaded") }}
              </span>
            </div>
            <div v-if="entry.remark" class="text-[11px] text-white/70 mt-1 truncate">
              {{ entry.remark }}
            </div>
            <div class="text-[10px] text-white/25 mt-1 truncate">
              {{ previewText(entry) }}
            </div>
          </button>

          <!-- Delete -->
          <button
            @click="history.remove(entry.id)"
            class="shrink-0 mt-0.5 w-6 h-6 rounded-md flex items-center justify-center text-white/0 group-hover:text-white/20 hover:!text-rose-400/70 transition-colors cursor-pointer"
          >
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-center gap-1 px-5 py-3 border-t border-white/6"
      >
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="w-7 h-7 rounded-lg text-[11px] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-default text-white/40 hover:text-white/70"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span class="text-[10px] text-white/30 min-w-12 text-center">{{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="w-7 h-7 rounded-lg text-[11px] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-default text-white/40 hover:text-white/70"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

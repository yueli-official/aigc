<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import PromptSection from "@/components/PromptSection.vue";
import TextToImageSection from "@/components/TextToImageSection.vue";
import ImageToVideoSection from "@/components/ImageToVideoSection.vue";
import JsonPreview from "@/components/JsonPreview.vue";
import HistoryPanel from "@/components/HistoryPanel.vue";
import { useI18n } from "vue-i18n";
import { useFormStore } from "@/stores/form";
import { useHistoryStore } from "@/stores/history";

const { t } = useI18n();
const store = useFormStore();
const historyStore = useHistoryStore();

// Sidebar state: which tab is active, and is it open
type SidebarTab = "json" | "history";
const sidebarOpen = ref(false);
const sidebarTab = ref<SidebarTab>("json");

// Mobile slideover fallback
const showMobileSlideover = ref(false);
const mobileSlideoverTab = ref<SidebarTab>("json");

const showSaveDialog = ref(false);
const saveRemark = ref("");
const saved = ref(false);
const copied = ref(false);

const jsonString = computed(() => JSON.stringify(store.outputJson, null, 2));

async function copyJson() {
  await navigator.clipboard.writeText(jsonString.value);
  historyStore.saveHistory(store.activeTab);
  copied.value = true;
  showToast(t("actions.copied"));
  setTimeout(() => (copied.value = false), 2000);
}

function openSaveDialog() {
  saveRemark.value = "";
  showSaveDialog.value = true;
}

function confirmSave() {
  historyStore.saveMemo(saveRemark.value.trim(), store.activeTab);
  showSaveDialog.value = false;
  saved.value = true;
  showToast(t("history.saved"));
  setTimeout(() => (saved.value = false), 2000);
}

function toggleSidebar(tab: SidebarTab) {
  if (window.innerWidth >= 1024) {
    if (sidebarOpen.value && sidebarTab.value === tab) {
      sidebarOpen.value = false;
    } else {
      sidebarTab.value = tab;
      sidebarOpen.value = true;
    }
  } else {
    mobileSlideoverTab.value = tab;
    showMobileSlideover.value = true;
  }
}

// Toast system
interface Toast {
  id: number;
  message: string;
  type: "success" | "info";
}
const toasts = ref<Toast[]>([]);
let toastId = 0;

function showToast(message: string, type: Toast["type"] = "success") {
  const id = ++toastId;
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 2500);
}

// Keyboard shortcuts
function handleKeydown(e: KeyboardEvent) {
  // Skip if user is typing in an input/textarea
  const tag = (e.target as HTMLElement)?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

  if (e.shiftKey && e.key === "C") {
    e.preventDefault();
    copyJson();
  } else if (e.shiftKey && e.key === "S") {
    e.preventDefault();
    openSaveDialog();
  }
}

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));
</script>

<template>
  <div class="min-h-dvh flex flex-col bg-[#111115] relative overflow-hidden">
    <!-- Decorative ambient glows -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-white/[0.04] blur-[120px] animate-float-slow" />
      <div class="absolute -top-20 -right-40 w-[400px] h-[400px] rounded-full bg-white/[0.03] blur-[100px] animate-float-slower" />
      <div class="absolute top-1/3 -left-20 w-[300px] h-[300px] rounded-full bg-white/[0.02] blur-[80px] animate-pulse-glow" />
      <div class="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-white/[0.02] blur-[100px] animate-float-slow" style="animation-delay: -4s" />
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
    </div>

    <AppHeader />

    <!-- Main content area: form + optional sidebar -->
    <div class="flex-1 flex relative z-10 overflow-hidden">
      <!-- Form area (scrollable) -->
      <div class="flex-1 overflow-y-auto">
        <div class="mx-auto max-w-275 px-4 sm:px-6 py-6 space-y-6">
          <PromptSection />

          <!-- Tab switcher -->
          <div class="relative flex items-center gap-1 p-1 rounded-xl bg-[#1c1c22] border border-white/6 w-fit">
            <button
              @click="store.activeTab = 't2i'"
              :class="[
                'relative flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-medium transition-all duration-200 cursor-pointer',
                store.activeTab === 't2i'
                  ? 'bg-white/[0.08] text-white/70'
                  : 'text-white/30 hover:text-white/60',
              ]"
            >
              {{ t("section.textToImage") }}
            </button>
            <button
              @click="store.activeTab = 'i2v'"
              :class="[
                'relative flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-medium transition-all duration-200 cursor-pointer',
                store.activeTab === 'i2v'
                  ? 'bg-white/[0.08] text-white/70'
                  : 'text-white/30 hover:text-white/60',
              ]"
            >
              {{ t("section.imageToVideo") }}
            </button>
            <button
              @click="store.activeTab = 'both'"
              :class="[
                'relative flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-medium transition-all duration-200 cursor-pointer',
                store.activeTab === 'both'
                  ? 'bg-white/[0.08] text-white/80'
                  : 'text-white/30 hover:text-white/60',
              ]"
            >
              {{ t("section.both") }}
            </button>
          </div>

          <TextToImageSection v-show="store.activeTab === 't2i' || store.activeTab === 'both'" />
          <ImageToVideoSection v-show="store.activeTab === 'i2v' || store.activeTab === 'both'" />

          <div class="h-20" />
        </div>
      </div>

      <!-- Desktop sidebar (lg+) -->
      <Transition
        enter-active-class="duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
      >
        <aside
          v-if="sidebarOpen"
          class="hidden lg:flex lg:flex-col w-[400px] shrink-0 border-l border-white/6 bg-[#111115]/80 backdrop-blur-xl"
        >
          <!-- Sidebar tab switcher -->
          <div class="flex items-center gap-1 px-4 pt-3 pb-0 shrink-0">
            <button
              @click="sidebarTab = 'json'"
              :class="[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors duration-150 cursor-pointer',
                sidebarTab === 'json'
                  ? 'bg-white/[0.08] text-white/80'
                  : 'text-white/30 hover:text-white/60',
              ]"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
              </svg>
              JSON
            </button>
            <button
              @click="sidebarTab = 'history'"
              :class="[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors duration-150 cursor-pointer',
                sidebarTab === 'history'
                  ? 'bg-white/[0.08] text-white/80'
                  : 'text-white/30 hover:text-white/60',
              ]"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {{ t("history.title") }}
            </button>
            <button
              @click="sidebarOpen = false"
              class="ml-auto flex items-center justify-center w-7 h-7 rounded-lg text-white/25 hover:text-white/60 transition-colors duration-150 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Sidebar content -->
          <div class="flex-1 overflow-hidden">
            <JsonPreview
              v-show="sidebarTab === 'json'"
              class="h-full"
              embedded
              @close="sidebarOpen = false"
            />
            <HistoryPanel
              v-show="sidebarTab === 'history'"
              class="h-full"
              embedded
              @close="sidebarOpen = false"
              @switch-mode="(m) => (store.activeTab = m)"
            />
          </div>
        </aside>
      </Transition>
    </div>

    <!-- Fixed bottom action toolbar -->
    <div class="fixed bottom-0 left-0 right-0 z-30 border-t border-white/6 bg-[#111115]/80 backdrop-blur-xl safe-area-bottom">
      <div class="flex items-center justify-end gap-1 sm:gap-2 px-4 sm:px-6 h-14">
        <!-- Copy JSON -->
        <div class="group/tip relative">
          <button
            @click="copyJson"
            :class="[
              'inline-flex items-center gap-1.5 px-3 sm:px-3.5 h-9 rounded-lg text-[11px] font-semibold transition-all duration-150 cursor-pointer',
              copied ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]' : 'bg-zinc-700 text-white hover:bg-zinc-600 shadow-[0_0_20px_rgba(82,82,91,0.2)] hover:shadow-[0_0_24px_rgba(82,82,91,0.3)]',
            ]"
          >
            <svg v-if="!copied" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <span class="hidden sm:inline">{{ copied ? t("actions.copied") : t("actions.copy") }}</span>
          </button>
          <span class="shortcut-tip">Shift+C</span>
        </div>

        <!-- Save -->
        <div class="group/tip relative">
          <button
            @click="openSaveDialog"
            :class="[
              'inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-lg text-[11px] font-medium transition-colors duration-150 cursor-pointer',
              saved ? 'text-emerald-400' : 'text-white/30 hover:text-white/60',
            ]"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
            <span class="hidden sm:inline">{{ saved ? t("history.saved") : t("history.save") }}</span>
          </button>
          <span class="shortcut-tip">Shift+S</span>
        </div>

        <!-- Preview JSON -->
        <button
          @click="toggleSidebar('json')"
          :class="[
            'inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-lg text-[11px] font-medium transition-colors duration-150 cursor-pointer',
            sidebarOpen && sidebarTab === 'json'
              ? 'text-white/70 bg-white/[0.08]'
              : 'text-white/30 hover:text-white/60',
          ]"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
          </svg>
          <span class="hidden sm:inline">JSON</span>
        </button>

        <!-- History -->
        <button
          @click="toggleSidebar('history')"
          :class="[
            'inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-lg text-[11px] font-medium transition-colors duration-150 cursor-pointer',
            sidebarOpen && sidebarTab === 'history'
              ? 'text-white/70 bg-white/[0.08]'
              : 'text-white/30 hover:text-white/60',
          ]"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span class="hidden sm:inline">{{ t("history.title") }}</span>
        </button>

        <!-- Reset -->
        <button
          @click="store.reset()"
          class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-lg text-[11px] font-medium text-white/30 hover:text-white/60 transition-colors duration-150 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
          <span class="hidden sm:inline">{{ t("actions.reset") }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile slideover (<lg) -->
    <USlideover v-model:open="showMobileSlideover" side="right" :ui="{ width: 'max-w-md w-full' }">
      <template #content>
        <div class="flex flex-col h-full bg-[#111115]">
          <!-- Mobile tab switcher -->
          <div class="flex items-center gap-1 px-4 pt-3 shrink-0">
            <button
              @click="mobileSlideoverTab = 'json'"
              :class="[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors duration-150 cursor-pointer',
                mobileSlideoverTab === 'json'
                  ? 'bg-white/[0.08] text-white/80'
                  : 'text-white/30 hover:text-white/60',
              ]"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
              </svg>
              JSON
            </button>
            <button
              @click="mobileSlideoverTab = 'history'"
              :class="[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors duration-150 cursor-pointer',
                mobileSlideoverTab === 'history'
                  ? 'bg-white/[0.08] text-white/80'
                  : 'text-white/30 hover:text-white/60',
              ]"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {{ t("history.title") }}
            </button>
            <button
              @click="showMobileSlideover = false"
              class="ml-auto flex items-center justify-center w-7 h-7 rounded-lg text-white/25 hover:text-white/60 transition-colors duration-150 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-hidden">
            <JsonPreview
              v-show="mobileSlideoverTab === 'json'"
              class="h-full"
              embedded
              @close="showMobileSlideover = false"
            />
            <HistoryPanel
              v-show="mobileSlideoverTab === 'history'"
              class="h-full"
              embedded
              @close="showMobileSlideover = false"
              @switch-mode="(m) => (store.activeTab = m)"
            />
          </div>
        </div>
      </template>
    </USlideover>

    <!-- Save memo dialog -->
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
          v-if="showSaveDialog"
          class="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div class="absolute inset-0 bg-black/60" @click="showSaveDialog = false" />
          <div class="relative w-full max-w-sm mx-4 rounded-2xl bg-[#1c1c22] border border-white/6 p-5 space-y-4">
            <h3 class="text-[13px] font-semibold text-white/80">{{ t("history.saveParams") }}</h3>
            <input
              v-model="saveRemark"
              :placeholder="t('history.remarkPlaceholder')"
              class="w-full h-9 px-3 rounded-lg bg-[#111115] border border-white/[0.08] text-[12px] text-white/80 placeholder-white/20 outline-none focus:border-white/30 transition-colors"
              @keydown.enter="confirmSave"
              autofocus
            />
            <div class="flex justify-end gap-2">
              <button
                @click="showSaveDialog = false"
                class="px-4 h-8 rounded-lg text-[11px] font-medium text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              >
                {{ t("history.cancel") }}
              </button>
              <button
                @click="confirmSave"
                class="px-4 h-8 rounded-lg text-[11px] font-semibold bg-zinc-700 text-white hover:bg-zinc-600 transition-colors duration-150 cursor-pointer"
              >
                {{ t("history.confirm") }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast notifications -->
    <Teleport to="body">
      <div class="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
        <TransitionGroup
          enter-active-class="duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-3 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-2 scale-95"
        >
          <div
            v-for="toast in toasts"
            :key="toast.id"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c1c22]/95 backdrop-blur-xl border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          >
            <svg
              class="w-4 h-4 text-emerald-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <span class="text-[12px] font-medium text-white/80 whitespace-nowrap">{{ toast.message }}</span>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </div>
</template>

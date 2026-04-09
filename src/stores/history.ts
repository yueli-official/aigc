import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFormStore, type TabMode } from './form'

export type EntryType = 'memo' | 'history'
export type { TabMode }

export interface HistoryEntry {
  id: string
  type: EntryType
  mode: TabMode
  remark: string
  date: string
  prompts: Record<string, unknown>
  textToImage: Record<string, unknown>
  imageToVideo: Record<string, unknown>
}

const STORAGE_KEY = 'aigc-history'

function loadFromStorage(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function snapshot() {
  const form = useFormStore()
  return {
    prompts: JSON.parse(JSON.stringify(form.prompts)),
    textToImage: JSON.parse(JSON.stringify(form.textToImage)),
    imageToVideo: JSON.parse(JSON.stringify(form.imageToVideo)),
  }
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export const useHistoryStore = defineStore('history', () => {
  const entries = ref<HistoryEntry[]>(loadFromStorage())

  /** Manual save with remark (memo) */
  function saveMemo(remark: string, mode: TabMode) {
    const data = snapshot()
    entries.value.unshift({
      id: genId(),
      type: 'memo',
      mode,
      remark,
      date: new Date().toISOString(),
      ...data,
    })
    saveToStorage(entries.value)
  }

  /** Auto-save on copy (history) */
  function saveHistory(mode: TabMode) {
    const data = snapshot()
    entries.value.unshift({
      id: genId(),
      type: 'history',
      mode,
      remark: '',
      date: new Date().toISOString(),
      ...data,
    })
    saveToStorage(entries.value)
  }

  /** Load entry and return its mode for tab switching */
  function load(entry: HistoryEntry): TabMode {
    const form = useFormStore()
    Object.assign(form.prompts, entry.prompts)
    Object.assign(form.textToImage, entry.textToImage)
    Object.assign(form.imageToVideo, entry.imageToVideo)
    return entry.mode || 'both'
  }

  function remove(id: string) {
    entries.value = entries.value.filter((e) => e.id !== id)
    saveToStorage(entries.value)
  }

  function removeBatch(ids: string[]) {
    const set = new Set(ids)
    entries.value = entries.value.filter((e) => !set.has(e.id))
    saveToStorage(entries.value)
  }

  function clearByType(type: EntryType) {
    entries.value = entries.value.filter((e) => e.type !== type)
    saveToStorage(entries.value)
  }

  return { entries, saveMemo, saveHistory, load, remove, removeBatch, clearByType }
})

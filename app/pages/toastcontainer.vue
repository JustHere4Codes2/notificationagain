<template>
  <main class="page">
    <section class="hero">
      <p class="hero-label">System</p>
      <h1>Toast container</h1>
      <p class="hero-desc">
        Toasts are rendered dynamically via a class-based manager and injected into the DOM.
        This page provides a quick way to verify behavior and trigger test notifications.
      </p>
    </section>

    <section class="status">
      <p class="section-label">Status</p>
      <div class="status-grid">
        <div class="status-card">
          <span class="status-key">DOM container</span>
          <span class="status-val" :class="hasContainer ? 'ok' : 'warn'">
            {{ hasContainer ? 'Detected' : 'Not created yet' }}
          </span>
        </div>
        <div class="status-card">
          <span class="status-key">Active toasts</span>
          <span class="status-val">{{ toastCount }}</span>
        </div>
      </div>
    </section>

    <section class="controls">
      <p class="section-label">Trigger a toast</p>
      <div class="buttons">
        <button class="toast-btn btn-info-t" @click="testToast('info')">
          <span class="btn-label">Info</span>
          <span class="btn-desc">Informational message</span>
        </button>
        <button class="toast-btn btn-success-t" @click="testToast('success')">
          <span class="btn-label">Success</span>
          <span class="btn-desc">Action completed</span>
        </button>
        <button class="toast-btn btn-warning-t" @click="testToast('warning')">
          <span class="btn-label">Warning</span>
          <span class="btn-desc">Needs attention</span>
        </button>
        <button class="toast-btn btn-error-t" @click="testToast('error')">
          <span class="btn-label">Error</span>
          <span class="btn-desc">Something went wrong</span>
        </button>
        <button class="toast-btn btn-persistent-t" @click="testPersistent">
          <span class="btn-label">Persistent</span>
          <span class="btn-desc">Stays until closed</span>
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'

const { show } = useToast()

const hasContainer = ref(false)
const toastCount = ref(0)

const updateState = () => {
  hasContainer.value = document.querySelectorAll('.toast-container').length > 0
  toastCount.value = document.querySelectorAll('.toast').length
}

onMounted(() => {
  updateState()
  const observer = new MutationObserver(updateState)
  observer.observe(document.body, { childList: true, subtree: true })
})

const testToast = (type: 'info' | 'success' | 'warning' | 'error') => {
  show({ text: `This is a ${type} toast`, type, position: 'bottom-right' })
}

const testPersistent = () => {
  show({ text: 'Persistent toast (manual close)', type: 'info', position: 'bottom-right', duration: false })
}
</script>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Hero */
.hero {
  padding-bottom: 1.5rem;
  border-bottom: 0.5px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.hero-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
  margin: 0 0 8px;
}

.hero h1 {
  font-size: 22px;
  font-weight: 500;
  color: #0f172a;
  margin: 0 0 8px;
}

.hero-desc {
  font-size: 15px;
  color: #64748b;
  line-height: 1.7;
  margin: 0;
  max-width: 520px;
}

/* Section label */
.section-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
  margin: 0 0 10px;
}

/* Status */
.status {
  margin-bottom: 1.5rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.status-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border: 0.5px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
}

.status-key {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #94a3b8;
}

.status-val {
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
}

.ok   { color: #27500a; }
.warn { color: #633806; }

/* Controls */
.controls {
  margin-bottom: 1.5rem;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.toast-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 0.5px solid;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: transform 0.12s ease, opacity 0.12s;
}

.toast-btn:hover  { transform: translateY(-1px); opacity: 0.9; }
.toast-btn:active { transform: scale(0.98); }

.btn-label { font-size: 13px; font-weight: 500; }
.btn-desc  { font-size: 11px; opacity: 0.75; }

.btn-info-t       { background: #e6f1fb; border-color: #b5d4f4; color: #0c447c; }
.btn-success-t    { background: #eaf3de; border-color: #c0dd97; color: #27500a; }
.btn-warning-t    { background: #faeeda; border-color: #fac775; color: #633806; }
.btn-error-t      { background: #fcebeb; border-color: #f7c1c1; color: #791f1f; }
.btn-persistent-t { background: #f8fafc; border-color: #e2e8f0; color: #1e293b; }
</style>
<template>
  <main class="page">
    <section class="hero">
      <p class="hero-label">Component</p>
      <h1>Toast notifications</h1>
      <p class="hero-desc">
        Trigger notifications with different styles and durations.
        The shared toast container handles rendering and auto-dismiss behavior.
      </p>
    </section>

    <div class="permission-card">
      <div class="permission-left">
        <span class="permission-label">Desktop notifications</span>
        <span class="permission-status">
          {{ supported ? `Permission: ${permission}` : 'Not supported in this browser' }}
        </span>
      </div>
      <button
        class="btn-permission"
        :class="{ granted: permission === 'granted' }"
        @click="enableNotifications"
        :disabled="permission === 'granted' || !supported"
      >
        {{ permission === 'granted' ? 'Notifications enabled' : 'Enable notifications' }}
      </button>
    </div>

    <p class="section-label">Trigger a toast</p>
    <section class="controls">
      <button class="toast-btn btn-info-t" @click="showInfo">
        <span class="btn-label">Info</span>
        <span class="btn-desc">Informational message</span>
      </button>
      <button class="toast-btn btn-success-t" @click="showSuccess">
        <span class="btn-label">Success</span>
        <span class="btn-desc">Action completed</span>
      </button>
      <button class="toast-btn btn-warning-t" @click="showWarning">
        <span class="btn-label">Warning</span>
        <span class="btn-desc">Needs attention</span>
      </button>
      <button class="toast-btn btn-error-t" @click="showError">
        <span class="btn-label">Error</span>
        <span class="btn-desc">Something went wrong</span>
      </button>
      <button class="toast-btn btn-persistent-t" @click="showPersistent">
        <span class="btn-label">Persistent</span>
        <span class="btn-desc">Stays until closed</span>
      </button>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import { useSystemNotification } from '~/composables/useSystemNotification'

const { show } = useToast()
const { supported, permission, requestPermission, notify } = useSystemNotification()

const notifySystem = (message: string, title: string) => {
  if (!supported.value || permission.value !== 'granted') return
  notify(title, { body: message })
}

const enableNotifications = async () => {
  if (!supported.value) {
    show({ text: 'System notifications are not supported', type: 'warning' })
    return
  }
  const result = await requestPermission()
  if (result === 'granted') {
    notify('Desktop notifications enabled', {
      body: 'You will now receive notifications outside the browser.',
    })
  } else {
    show({ text: 'Notification permission not granted', type: 'error' })
  }
}

const showInfo = () => {
  const message = 'This is an info toast.'
  show({ text: message, type: 'info', position: 'bottom-right' })
  notifySystem(message, 'Info')
}

const showSuccess = () => {
  const message = 'Successfully completed the action!'
  show({ text: message, type: 'success', position: 'bottom-right' })
  notifySystem(message, 'Success')
}

const showWarning = () => {
  const message = 'Warning: check your input.'
  show({ text: message, type: 'warning', position: 'bottom-right' })
  notifySystem(message, 'Warning')
}

const showError = () => {
  const message = 'Error occurred while saving.'
  show({ text: message, type: 'error', position: 'bottom-right' })
  notifySystem(message, 'Error')
}

const showPersistent = () => {
  const message = 'This toast stays until closed.'
  show({ text: message, type: 'info', position: 'bottom-right', duration: false })
  notifySystem(message, 'Persistent')
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

/* Permission card */
.permission-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1rem 1.25rem;
  border: 0.5px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  margin-bottom: 1.5rem;
}

.permission-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.permission-label {
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
}

.permission-status {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.btn-permission {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  border: 0.5px solid #cbd5e1;
  background: #f8fafc;
  color: #1e293b;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
  font-family: inherit;
}

.btn-permission:hover:not(:disabled) { background: #f1f5f9; }

.btn-permission:disabled {
  cursor: default;
  opacity: 0.6;
}

.btn-permission.granted {
  color: #27500a;
  border-color: #c0dd97;
  background: #eaf3de;
}

/* Controls */
.section-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
  margin: 0 0 10px;
}

.controls {
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
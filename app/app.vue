<template>
  <NuxtPage />
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.toast-container {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
}

.toast-container[data-position="top-right"]    { top: 20px; right: 20px; }
.toast-container[data-position="top-left"]     { top: 20px; left: 20px; }
.toast-container[data-position="bottom-right"] { bottom: 20px; right: 20px; }
.toast-container[data-position="bottom-left"]  { bottom: 20px; left: 20px; }

.toast {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  position: relative;
  min-width: 260px;
  max-width: 340px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 0.5px solid;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
  font-weight: 400;
  opacity: 0;
  transform: translateX(12px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  overflow: hidden;
}

.toast.show {
  opacity: 1;
  transform: translateX(0);
}

.toast__content {
  flex: 1;
}

.toast__duration {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.7;
  min-width: 24px;
  text-align: right;
}

.toast--info {
  background: #e6f1fb;
  border-color: #b5d4f4;
  color: #0c447c;
}

.toast--success {
  background: #eaf3de;
  border-color: #c0dd97;
  color: #27500a;
}

.toast--warning {
  background: #faeeda;
  border-color: #fac775;
  color: #633806;
}

.toast--error {
  background: #fcebeb;
  border-color: #f7c1c1;
  color: #791f1f;
}

.toast__icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-top: 1px;
  opacity: 0.8;
}

.toast__text {
  flex: 1;
}

.toast__close {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
  line-height: 1;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.4;
  color: inherit;
  font-family: inherit;
  transition: opacity 0.15s;
}

.toast__close:hover {
  opacity: 1;
}

.toast.can-close {
  cursor: pointer;
}

/* Progress bar */
.toast.progress::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: currentColor;
  opacity: 0.12;
  border-radius: 0 0 12px 12px;
}

.toast.progress::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: calc(var(--progress, 1) * 100%);
  height: 2px;
  background: currentColor;
  opacity: 0.5;
  transition: width 0.1s linear;
}
</style>
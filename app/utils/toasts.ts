type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastOptions {
  text?: string
  type?: ToastType
  autoClose?: number | false
  duration?: number | false
  position?: ToastPosition
  onClose?: () => void
  canClose?: boolean
  showProgress?: boolean
  showDuration?: boolean
  pauseOnHover?: boolean
  pauseOnFocusLoss?: boolean
}

const DEFAULT_OPTIONS: Required<Omit<ToastOptions, 'duration'>> = {
  text: '',
  type: 'info',
  autoClose: 5000,
  position: 'bottom-right',
  onClose: () => {},
  canClose: true,
  showProgress: true,
  showDuration: true,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
}

export default class Toast {
  private el: HTMLDivElement
  private closeBtn?: HTMLButtonElement
  private durationEl?: HTMLDivElement
  private options: Required<Omit<ToastOptions, 'duration'>>
  private rafId?: number
  private elapsed = 0
  private lastTime = 0
  private isPaused = false
  private removed = false

  constructor(options: ToastOptions = {}) {
    const resolvedAutoClose =
      options.autoClose !== undefined
        ? options.autoClose
        : options.duration !== undefined
        ? options.duration
        : DEFAULT_OPTIONS.autoClose

    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
      autoClose: resolvedAutoClose,
    }

    this.el = document.createElement('div')
    this.el.className = `toast toast--${this.options.type}`

    // Text
    const textEl = document.createElement('div')
    textEl.className = 'toast__text'
    textEl.textContent = this.options.text
    this.el.appendChild(textEl)

    // Duration display
    if (this.options.showDuration && this.options.autoClose !== false) {
      this.durationEl = document.createElement('div')
      this.durationEl.className = 'toast__duration'
      this.el.appendChild(this.durationEl)
    }

    // Close button
    if (this.options.canClose) {
      this.closeBtn = document.createElement('button')
      this.closeBtn.className = 'toast__close'
      this.closeBtn.textContent = '✕'
      this.closeBtn.setAttribute('aria-label', 'Close notification')
      this.el.appendChild(this.closeBtn)
    }

    // Progress bar
    if (this.options.showProgress && this.options.autoClose !== false) {
      this.el.classList.add('progress')
      this.el.style.setProperty('--progress', '1')
    }

    this.mount()
    this.bindEvents()

    requestAnimationFrame(() => {
      this.el.classList.add('show')
    })

    if (this.options.autoClose !== false) {
      this.startAutoClose()
    }
  }

  private mount() {
    const container = getContainer(this.options.position)
    container.appendChild(this.el)
  }

  private bindEvents() {
    if (this.options.canClose && this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        this.remove()
      })
    }

    if (this.options.pauseOnHover) {
      this.el.addEventListener('mouseenter', this.pause)
      this.el.addEventListener('mouseleave', this.unpause)
    }

    if (this.options.pauseOnFocusLoss) {
      document.addEventListener('visibilitychange', this.handleVisibility)
    }
  }

  private pause = () => {
    this.isPaused = true
  }

  private unpause = () => {
    this.isPaused = false
  }

  private handleVisibility = () => {
    this.isPaused = document.visibilityState !== 'visible'
  }

  private startAutoClose() {
    this.lastTime = performance.now()

    const tick = (time: number) => {
      if (this.removed) return

      const delta = time - this.lastTime
      this.lastTime = time

      if (!this.isPaused) {
        this.elapsed += delta

        const duration = this.options.autoClose as number
        const progress = 1 - this.elapsed / duration
        const remainingSeconds = Math.ceil((duration - this.elapsed) / 1000)

        if (this.options.showProgress) {
          this.el.style.setProperty('--progress', String(Math.max(progress, 0)))
        }

        if (this.options.showDuration && this.durationEl) {
          this.durationEl.textContent = `${Math.max(remainingSeconds, 0)}s`
        }

        if (this.elapsed >= duration) {
          this.remove()
          return
        }
      }

      this.rafId = requestAnimationFrame(tick)
    }

    this.rafId = requestAnimationFrame(tick)
  }

  remove = () => {
    if (this.removed) return
    this.removed = true

    if (this.rafId) cancelAnimationFrame(this.rafId)

    this.el.classList.remove('show')
    const parent = this.el.parentElement

    this.el.addEventListener(
      'transitionend',
      () => {
        this.el.remove()
        if (parent && parent.children.length === 0) {
          parent.remove()
        }
      },
      { once: true }
    )

    this.options.onClose()
    this.cleanup()
  }

  private cleanup() {
    if (this.options.pauseOnFocusLoss) {
      document.removeEventListener('visibilitychange', this.handleVisibility)
    }

    if (this.options.pauseOnHover) {
      this.el.removeEventListener('mouseenter', this.pause)
      this.el.removeEventListener('mouseleave', this.unpause)
    }

    if (this.options.canClose && this.closeBtn) {
      this.closeBtn.removeEventListener('click', this.remove)
    }
  }
}

function getContainer(position: ToastPosition): HTMLDivElement {
  const selector = `.toast-container[data-position="${position}"]`
  let container = document.querySelector<HTMLDivElement>(selector)

  if (!container) {
    container = document.createElement('div')
    container.className = 'toast-container'
    container.dataset.position = position
    document.body.appendChild(container)
  }

  return container
}
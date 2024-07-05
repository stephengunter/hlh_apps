import { SHOW_PHOTO } from '@/store/actions.type'

window[SHOW_PHOTO] = (model) => window.dispatchEvent(new CustomEvent(SHOW_PHOTO, { detail: model }))

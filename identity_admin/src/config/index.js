import { WebStorageStateStore } from 'oidc-client-ts'

export const PRODUCTION = process.env.NODE_ENV === 'production'
export const APP_CLOSED = import.meta.env.VITE_APP_CLOSE == 1
export const API_URL = import.meta.env.VITE_APP_API_URL
export const CLIENT_URL = import.meta.env.VITE_APP_CLIENT_URL
export const SITE_TITLE = import.meta.env.VITE_APP_TITLE
export const IDENTITY_API = import.meta.env.VITE_APP_IDENTITY_API
export const OIDC = {
   authority: API_URL,
   client_id: 'identity-admin',
   redirect_uri: `${CLIENT_URL}/signin-callback`,
   post_logout_redirect_uri: `${CLIENT_URL}`,
   response_type: 'code',
   scope: 'openid offline_access ' + IDENTITY_API,
   userStore: new WebStorageStateStore({ store: window.localStorage })
}


//UI
export const DIALOG_MAX_WIDTH = 480

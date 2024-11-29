import date from './date'
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
	components: {
		VTimePicker,
	},
	theme: {
		themes: {
			light: {
				colors: {
					primary: '#1867C0',
					secondary: '#5CBBF6',
				},
			},
		}
	},
	date
})
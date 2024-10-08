import date from './date'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { VCalendar } from 'vuetify/labs/VCalendar'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
	components: {
		VCalendar,
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
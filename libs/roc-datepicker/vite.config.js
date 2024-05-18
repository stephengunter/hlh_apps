// Plugins
import vue from '@vitejs/plugin-vue'
// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		cssCodeSplit: true,
		lib: {
		  // Could also be a dictionary or array of multiple entry points
		  entry: resolve(__dirname, 'src/datepicker/Datepicker.vue'),
		  name: 'Datepicker',
		  formats: ['es', 'umd'],
		  // the proper extensions will be added
		  fileName: 'roc-datepicker',
		},
		rollupOptions: {
		  // make sure to externalize deps that shouldn't be bundled
		  // into your library
		  external: ['vue', 'date-fns', 'date-fns/fp', 'date-fns/locale'],
		  output: {
			 // Provide global variables to use in the UMD build
			 // for externalized deps
			 globals: {
				vue: 'Vue',
				'date-fns': 'date-fns',
			 },
			 assetFileNames: (assetInfo) => {
				if (assetInfo.name === 'style.css') return 'vue3-datepicker.css'
				return assetInfo.name
			 },
		  },
		},
	 },
	plugins: [
		vue()
	],
	define: { 'process.env': {} },
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
		extensions: [
			'.js',
			'.json',
			'.jsx',
			'.mjs',
			'.ts',
			'.tsx',
			'.vue',
		],
	},
	server: {
		port: 8000,
	},
})

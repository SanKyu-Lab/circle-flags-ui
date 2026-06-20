import { sveltePreprocess } from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sveltePreprocess({
    typescript: {
      tsconfigFile: './tsconfig.json',
    },
  }),
}

export default config

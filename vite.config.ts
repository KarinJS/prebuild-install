import fs from 'node:fs'
import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'

export default defineConfig({
  build: {
    target: 'es2015',
    lib: {
      formats: ['cjs'],
      entry: [
        './index.js',
        './bin.js',
      ],
    },
    outDir: 'dist',
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map((mod) => `node:${mod}`),
      ],
    },
    minify: false,
    commonjsOptions: {
      include: [
        './node_modules/**',
        '*.js',
      ],
      ignoreDynamicRequires: true,
    }
  },
  plugins: [
    // 打包完成后，将dist/*.js复制到根目录下
    {
      name: 'copy-files',
      writeBundle() {
        const files = fs.readdirSync('./dist')
        files.forEach((file) => {
          const src = `./dist/${file}`
          const dest = `./${file}`
          fs.copyFileSync(src, dest)
          console.log(`Copied ${src} to ${dest}`)
        })
      },
    },
  ]
})

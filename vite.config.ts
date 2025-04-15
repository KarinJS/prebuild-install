import fs from 'node:fs'
import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'

export default defineConfig({
  build: {
    target: 'es2015',
    lib: {
      formats: ['cjs'],
      entry: ['./bin.js',],
    },
    outDir: 'dist',
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map((mod) => `node:${mod}`),
      ],
    },
    minify: 'terser',
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
      name: 'copy-dist',
      writeBundle() {
        fs.copyFileSync('./dist/bin.js', './prebuild-install.js')
      },
    },
  ]
})

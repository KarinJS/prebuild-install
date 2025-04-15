import fs from 'node:fs'
import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'

/**
 * rc模块必须要先单独打包 随后显式引用才可以参与最终打包 否则会造成无限循环引用
 */
export default defineConfig({
  build: {
    target: 'es2015',
    lib: {
      formats: ['cjs'],
      entry: [
        './node_modules/rc/index.js',
      ],
      fileName: 'rc.module',
    },
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map((mod) => `node:${mod}`),
      ],
    },
    minify: 'terser',
  },
  plugins: [
    // 监听打包完成事件，将打包的dist/rc.module.js文件复制到../../rc.module.js
    {
      name: 'rc-module',
      writeBundle() {
        const src = './dist/rc.module.js'
        const dest = './rc.module.js'
        fs.copyFileSync(src, dest)
        console.log(`Copied ${src} to ${dest}`)

        /** 将rc.js中的`require('rc')` 替换为`require('./rc.module.js')` */
        const rcPath = './rc.js'
        const rcContent = fs.readFileSync(rcPath, 'utf-8')
        const newRcContent = rcContent.replace(/require\('rc'\)/g, `require('./rc.module.js')`)
        fs.writeFileSync(rcPath, newRcContent)
        console.log(`Replaced require('rc') with require('./rc.module.js') in ${rcPath}`)
      },
    },
  ]
})

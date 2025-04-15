# prebuild-install

> **一个命令行工具，用于在特定平台上为多个版本的 Node.js 和 Electron 轻松安装预构建二进制文件。**
> 默认情况下，它从 GitHub 发布版本下载预构建二进制文件。

[English](README.md)

## [**@karinjs/prebuild-install**](https://github.com/karinjs/prebuild-install) 增强功能

这个分支包含以下显著改进：

- **内置镜像源**：包含预配置的常用原生模块下载镜像（sqlite3、canvas 等），自动使用这些镜像而非 GitHub
- **零依赖**：使用 Vite 重新构建，消除了所有运行时依赖
- **显著减小的包体积**：包大小从 770KB 减少到 146KB（[prebuild-install](https://pkg-size.dev/prebuild-install) vs [@karinjs/prebuild-install](https://pkg-size.dev/@karinjs/prebuild-install)）

---

[![npm](https://img.shields.io/npm/v/prebuild-install.svg)](https://www.npmjs.com/package/prebuild-install)
![Node version](https://img.shields.io/node/v/prebuild-install.svg)
[![Test](https://img.shields.io/github/actions/workflow/status/prebuild/prebuild-install/test.yml?label=test)](https://github.com/prebuild/prebuild-install/actions/workflows/test.yml)
[![Standard](https://img.shields.io/badge/standard-informational?logo=javascript&logoColor=fff)](https://standardjs.com)
[![Common Changelog](https://common-changelog.org/badge.svg)](https://common-changelog.org)

## 注意

**我们推荐使用[`prebuildify`](https://github.com/prebuild/prebuildify)配合[`node-gyp-build`](https://github.com/prebuild/node-gyp-build)，而不是[`prebuild`](https://github.com/prebuild/prebuild)配合[`prebuild-install`](https://github.com/prebuild/prebuild-install)。**

使用`prebuildify`时，所有预构建的二进制文件都会被打包到发布到 npm 的包中，这意味着不需要像`prebuild`那样进行单独的下载步骤。这种方法的讽刺之处在于，当所有平台的预构建二进制文件被打包在一起下载时，比单独下载一个预构建二进制文件作为安装脚本要更快。

优点：

1. 没有额外的下载步骤，使安装更可靠、更快速。
2. 支持本地更改运行时版本并在 Node.js 和 Electron 之间使用相同的安装。由于所有预构建二进制文件都在 npm tarball 中，并且在运行时简单地选择正确的二进制文件，因此不需要重新安装或重建。
3. `node-gyp-build`运行时依赖项是无依赖的，并且原则上将保持这种状态，因为引入依赖项会抵消安装时间的缩短。
4. 即使 npm 安装脚本被禁用，预构建二进制文件也能正常工作。
5. npm 包校验和也涵盖了预构建二进制文件。

缺点：

1. 安装的 npm 包在磁盘上更大。使用[Node-API](https://nodejs.org/api/n-api.html)可以缓解这一问题，因为 Node-API 二进制文件与运行时无关且向前兼容。
2. 发布稍微复杂一些，因为`npm publish`必须在编译和获取预构建二进制文件之后进行（通常在 CI 中）。

## 使用方法

使用[`prebuild`](https://github.com/prebuild/prebuild)创建并上传预构建二进制文件。然后将 package.json 中的安装脚本更改为：

```json
{
  "scripts": {
    "install": "prebuild-install || node-gyp rebuild"
  }
}
```

当用户通过 npm 安装你的包从而触发上述安装脚本时，`prebuild-install`将下载适合的预构建二进制文件，或者如果没有找到合适的二进制文件，则以非零退出代码退出，从而触发`node-gyp rebuild`以从源代码构建。

可以像下面这样将选项（见下文）传递给`prebuild-install`：

```json
{
  "scripts": {
    "install": "prebuild-install -r napi || node-gyp rebuild"
  }
}
```

### 帮助

```
prebuild-install [选项]

  --download    -d  [url]       (下载预构建文件，如果不提供url则从github下载)
  --target      -t  version     (要安装的版本)
  --runtime     -r  runtime     (构建或安装的Node运行时[node, napi或electron]，默认为node)
  --path        -p  path        (在此处执行prebuild-install)
  --token       -T  gh-token    (用于私有仓库的github令牌)
  --arch            arch        (目标CPU架构，参见Node OS模块文档，默认为当前架构)
  --platform        platform    (目标平台，参见Node OS模块文档，默认为当前平台)
  --tag-prefix <prefix>         (github标签前缀，默认为"v")
  --build-from-source           (跳过prebuild下载)
  --verbose                     (详细日志输出)
  --libc                        (使用提供的libc而不是系统默认值)
  --debug                       (设置Debug或Release配置)
  --version                     (打印prebuild-install版本并退出)
  --pkg_name                    (设置包名称 适用于fork后的包)
  --pkg_version                 (设置包版本 适用于fork后的包)
```

当通过`npm`脚本运行`prebuild-install`时，可以通过给`npm`命令的参数传递选项`--build-from-source`、`--debug`、`--download`、`--target`、`--runtime`、`--arch`、`--platform`和`--libc`。

或者，你可以设置环境变量`npm_config_build_from_source=true`、`npm_config_platform`、`npm_config_arch`、`npm_config_target`、`npm_config_runtime`和`npm_config_libc`。

### Libc

在非 glibc 的 Linux 平台上，Libc 名称会附加到平台名称中。例如，基于 musl 的环境被称为`linuxmusl`。如果传递了选项`--libc=glibc`，则 glibc 会被丢弃，并且平台仅被称为`linux`。例如，这可以用于在 Alpine Linux 上构建跨平台包。

### 私有仓库

`prebuild-install`支持使用`-T <github-token>`从私有 GitHub 仓库下载预构建文件：

```
$ prebuild-install -T <github-token>
```

如果你不想在命令行中使用令牌，可以将其放在`~/.prebuild-installrc`中：

```
token=<github-token>
```

或者，你可以在`prebuild-install_token`环境变量中指定它。

请注意，使用 GitHub 令牌会通过 API 解析正确的发布版本，这意味着你受到([GitHub 速率限制](https://developer.github.com/v3/rate_limit/))的约束。

### 创建 GitHub 令牌

创建令牌的步骤：

- 前往[此页面](https://github.com/settings/tokens)
- 点击`Generate new token`按钮
- 给令牌起个名称，并点击`Generate token`按钮，如下所示

![prebuild-token](https://cloud.githubusercontent.com/assets/13285808/20844584/d0b85268-b8c0-11e6-8b08-2b19522165a9.png)

默认权限范围应该足够了。

### 自定义二进制文件

最终用户可以通过其.npmrc 文件中的环境变量覆盖二进制文件下载位置。
变量需要符合`% your package name %_binary_host`或`% your package name %_binary_host_mirror`格式。例如：

```
leveldown_binary_host=http://overriden-host.com/overriden-path
```

`@karinjs/prebuild-install`内置了常用原生模块的镜像源，这些源会被自动使用而无需任何配置，优先级高于 GitHub。目前已内置支持 sqlite3 和 canvas 的下载镜像：

```json
{
  "prebuild": {
    "sqlite3": "https://registry.npmmirror.com/-/binary/sqlite3",
    "canvas": "https://registry.npmmirror.com/-/binary/canvas"
  }
}
```

请注意，包版本子路径和文件名仍会被附加。
所以如果你安装的是`leveldown@1.2.3`，最终的 URL 将是：

```
http://overriden-host.com/overriden-path/v1.2.3/leveldown-v1.2.3-node-v57-win32-x64.tar.gz
```

#### 本地预构建文件

如果你想使用本地文件系统中的预构建文件，可以使用`% your package name %_local_prebuilds` .npmrc 变量来设置包含预构建文件的文件夹路径。例如：

```
leveldown_local_prebuilds=/path/to/prebuilds
```

此选项将直接在该文件夹中查找使用`prebuild`创建的包，例如：

```
/path/to/prebuilds/leveldown-v1.2.3-node-v57-win32-x64.tar.gz
```

非绝对路径相对于调用 prebuild-install 的包的目录解析，例如用于嵌套依赖项。

### 自定义二进制包名称

你可以通过命令行参数、配置文件或环境变量自定义下载的二进制包名称：

- 命令行：`--pkg_name=yourname`
- 环境变量：`npm_config_${pkg_name}_name=yourname`
- 配置文件（.prebuild-installrc）：`pkg_name=yourname`

此参数会影响下载链接、缓存、环境变量前缀等，适用于多包共用二进制或自定义命名场景。

环境变量如：`npm_config_${pkg_name}_name` 也会自动适配。

例如，我的 npm 包名是`@karinjs/sqlite3`，我需要下载`sqlite3`的预构建二进制包，我可以在命令行中执行：

```bash
npx @karinjs/prebuild-install -r napi --pkg_name=sqlite3
```

---

### 自定义二进制包版本

你可以通过命令行参数、配置文件或环境变量自定义下载的二进制包版本：

- 命令行：`--pkg_version=yourversion`
- 环境变量：`npm_config_${pkg_name}_version=yourversion`
- 配置文件（.prebuild-installrc）：`pkg_version=yourversion`

此参数会影响下载链接、缓存、环境变量前缀等，适用于多包共用二进制或自定义版本场景。

环境变量如：`npm_config_${pkg_name}_version` 也会自动适配。
例如，我的 npm 包名是`@karinjs/sqlite3`，我需要下载`sqlite3`的预构建二进制包，我可以在命令行中执行：

```bash
npx @karinjs/prebuild-install -r napi --pkg_name=sqlite3 --pkg_version=5.1.7
```

---

### 缓存

所有预构建二进制文件都会被缓存以最小化流量。因此，`prebuild-install`首先从缓存中获取二进制文件，如果找不到二进制文件，才会下载。根据环境，缓存文件夹按以下顺序确定：

- `${npm_config_cache}/_prebuilds`
- `${APP_DATA}/npm-cache/_prebuilds`
- `${HOME}/.npm/_prebuilds`

## 打包优化

`@karinjs/prebuild-install`使用 Vite 进行了二次打包，打包后的产物实现了 0 依赖，大大减小了包体积。对比数据：

- 原版 prebuild-install: 770KB
- [**@karinjs/prebuild-install**](https://github.com/karinjs/prebuild-install): 146KB

这意味着在使用[**@karinjs/prebuild-install**](https://github.com/karinjs/prebuild-install)时，可以获得更快的安装速度和更小的磁盘占用空间。数据来源：

- [prebuild-install 包大小分析](https://pkg-size.dev/prebuild-install)
- [@karinjs/prebuild-install 包大小分析](https://pkg-size.dev/@karinjs/prebuild-install)

## 安装

使用[npm](https://npmjs.org)执行：

```
npm install @karinjs/prebuild-install
```

作为别名安装并在项目中使用：

```
npm install prebuild-install@npm:@karinjs/prebuild-install
```

## 直接执行

无需安装，直接使用 npx 执行：

```
npx @karinjs/prebuild-install -r napi
```

例如你的`sqlite3@5.1.7`经常报错，你就可以直接`cd node_modules/sqlite3`，然后执行上面这个啦。

## 许可证

[MIT](./LICENSE)

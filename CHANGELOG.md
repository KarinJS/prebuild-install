# Changelog

## [1.3.0](https://github.com/KarinJS/prebuild-install/compare/v1.2.2...v1.3.0) (2025-04-25)


### Features

* 在下载函数中添加日志记录，更新package.json以支持新的依赖项`node-pty-prebuilt-multiarch` ([28b3f53](https://github.com/KarinJS/prebuild-install/commit/28b3f5304f611f04ad8fce7633f3e5276de3d97f))

## [1.2.2](https://github.com/KarinJS/prebuild-install/compare/v1.2.1...v1.2.2) (2025-04-15)


### Bug Fixes

* 统一参数 ([7d98fda](https://github.com/KarinJS/prebuild-install/commit/7d98fdad5349ce7f0af3afc22fe5544031eea2fe))

## [1.2.1](https://github.com/KarinJS/prebuild-install/compare/v1.2.0...v1.2.1) (2025-04-15)


### Bug Fixes

* 4.1的狗屁通乱删我代码 ([92dfa1b](https://github.com/KarinJS/prebuild-install/commit/92dfa1b77136635cfed43e22bfc6708de1b56eed))

## [1.2.0](https://github.com/KarinJS/prebuild-install/compare/v1.1.0...v1.2.0) (2025-04-15)


### Features

* 添加自定义二进制版本支持，更新文档和帮助信息 ([cf58b34](https://github.com/KarinJS/prebuild-install/commit/cf58b34ab5c1e4be07a3c24fb0c56aed596a4074))

## [1.1.0](https://github.com/KarinJS/prebuild-install/compare/v1.0.1...v1.1.0) (2025-04-15)


### Features

* `binary_name` ([c0577d1](https://github.com/KarinJS/prebuild-install/commit/c0577d1700d7f58e5e5dbdbabda4002f62fe8923))

## [1.0.1](https://github.com/KarinJS/prebuild-install/compare/v1.0.0...v1.0.1) (2025-04-15)


### Bug Fixes

* 启用代码压缩 ([1416ee1](https://github.com/KarinJS/prebuild-install/commit/1416ee1011258c277c944ed1f791ced4b672b9e8))

## 1.0.0 (2025-04-15)


### Features

* 使用vite打包 ([ee838e1](https://github.com/KarinJS/prebuild-install/commit/ee838e106ec202893fa1f3889381f5ae12178e52))
* 新增默认下载地址配置，支持从指定源下载预构建二进制文件 ([9394eda](https://github.com/KarinJS/prebuild-install/commit/9394edaf67d14b87c659ccefb2f905ad66b46c1b))


### Bug Fixes

* Calculate correct ABI based on target and runtime ([cbd8ec4](https://github.com/KarinJS/prebuild-install/commit/cbd8ec4e61984754fd4cbece9298a3371b1c2820))
* ci ([8d18ba7](https://github.com/KarinJS/prebuild-install/commit/8d18ba7ba0bb6ef8f02863a654d81feffc92b457))
* download prebuilt binaries when installing with pnpm ([a65b3ba](https://github.com/KarinJS/prebuild-install/commit/a65b3ba9387c24a1a77b47e2c6a9800f2c844bb8))
* download prebuilt binaries when installing with pnpm ([12c6c32](https://github.com/KarinJS/prebuild-install/commit/12c6c32bad54b95a8dbb452e8062ee600835e99b))
* use mkdirp for creating directories ([3e16eab](https://github.com/KarinJS/prebuild-install/commit/3e16eab480ed345a5a76d408e83cb383b99bf2d2))
* use mkdirp for creating directories ([1a48014](https://github.com/KarinJS/prebuild-install/commit/1a48014c528ec4ec6fb85205311cefc72896b34c))
* 修正入口路径、npm包名 ([84104e6](https://github.com/KarinJS/prebuild-install/commit/84104e6684aaf8680db8136b47db9a50b963a70e))
* 更正入口 ([cca6e7a](https://github.com/KarinJS/prebuild-install/commit/cca6e7a9fe84add9ab272d0627877f81efcc8f7a))

## [7.1.3] - 2025-01-22

### Fixed

- Bump napi-build-utils from 1 to 2 ([#204](https://github.com/prebuild/prebuild-install/issues/204)) ([`1bf4a15`](https://github.com/prebuild/prebuild-install/commit/1bf4a15)) (Bailey Pearson)

## [7.1.2] - 2024-02-29

### Fixed

- Support environments where MD5 is prohibited ([#191](https://github.com/prebuild/prebuild-install/issues/191)) ([`9140468`](https://github.com/prebuild/prebuild-install/commit/9140468)) (Tomasz Szuba)

## [7.1.1] - 2022-06-07

### Fixed

- Replace use of npmlog dependency with console.error ([#182](https://github.com/prebuild/prebuild-install/issues/182)) ([`4e2284c`](https://github.com/prebuild/prebuild-install/commit/4e2284c)) (Lovell Fuller)
- Ensure script output can be captured by tests ([#181](https://github.com/prebuild/prebuild-install/issues/181)) ([`d1853cb`](https://github.com/prebuild/prebuild-install/commit/d1853cb)) (Lovell Fuller)

## [7.1.0] - 2022-04-20

### Changed

- Allow setting libc to glibc on non-glibc platform ([#176](https://github.com/prebuild/prebuild-install/issues/176)) ([`f729abb`](https://github.com/prebuild/prebuild-install/commit/f729abb)) (Joona Heinikoski)

## [7.0.1] - 2022-01-28

### Changed

- Upgrade to the latest version of `detect-libc` ([#166](https://github.com/prebuild/prebuild-install/issues/166)) ([`f71c6b9`](https://github.com/prebuild/prebuild-install/commit/f71c6b9)) (Lovell Fuller)

## [7.0.0] - 2021-11-12

### Changed

- **Breaking:** bump `node-abi` so that Electron 14+ gets correct ABI ([#161](https://github.com/prebuild/prebuild-install/issues/161)) ([`477f347`](https://github.com/prebuild/prebuild-install/commit/477f347)) (csett86). Drops support of Node.js < 10.
- Bump `simple-get` ([`7468c14`](https://github.com/prebuild/prebuild-install/commit/7468c14)) (Vincent Weevers).

## [6.1.4] - 2021-08-11

### Fixed

- Move auth token to header instead of query param ([#160](https://github.com/prebuild/prebuild-install/issues/160)) ([`b3fad76`](https://github.com/prebuild/prebuild-install/commit/b3fad76)) (nicolai-nordic)
- Remove `_` prefix as it isn't allowed by npm config ([#153](https://github.com/prebuild/prebuild-install/issues/153)) ([`a964e5b`](https://github.com/prebuild/prebuild-install/commit/a964e5b)) (Tom Boothman)
- Make `rc.path` absolute ([#158](https://github.com/prebuild/prebuild-install/issues/158)) ([`57bcc06`](https://github.com/prebuild/prebuild-install/commit/57bcc06)) (George Waters).

## [6.1.3] - 2021-06-03

### Changed

- Inline no longer maintained `noop-logger` ([#155](https://github.com/prebuild/prebuild-install/issues/155)) ([`e08d75a`](https://github.com/prebuild/prebuild-install/commit/e08d75a)) (Alexandru Dima)
- Point users towards `prebuildify` in README ([#150](https://github.com/prebuild/prebuild-install/issues/150)) ([`5ee1a2f`](https://github.com/prebuild/prebuild-install/commit/5ee1a2f)) (Vincent Weevers)

## [6.1.2] - 2021-04-24

### Fixed

- Support URL-safe strings in scoped packages ([#148](https://github.com/prebuild/prebuild-install/issues/148)) ([`db36c7a`](https://github.com/prebuild/prebuild-install/commit/db36c7a)) (Marco)

## [6.1.1] - 2021-04-04

### Fixed

- Support `force` & `buildFromSource` options in yarn ([#140](https://github.com/prebuild/prebuild-install/issues/140)) ([`8cb1ced`](https://github.com/prebuild/prebuild-install/commit/8cb1ced)) (João Moreno)
- Bump `node-abi` to prevent dedupe (closes [#135](https://github.com/prebuild/prebuild-install/issues/135)) ([`2950fb2`](https://github.com/prebuild/prebuild-install/commit/2950fb2)) (Vincent Weevers)

## [6.1.0] - 2021-04-03

### Added

- Restore local prebuilds feature ([#137](https://github.com/prebuild/prebuild-install/issues/137)) ([`dc4e5ea`](https://github.com/prebuild/prebuild-install/commit/dc4e5ea)) (Wes Roberts). Previously removed in [#81](https://github.com/prebuild/prebuild-install/issues/81) / [`a069253`](https://github.com/prebuild/prebuild-install/commit/a06925378d38ca821bfa93aa4c1fdedc253b2420).

## [6.0.1] - 2021-02-14

### Fixed

- Fixes empty `--tag-prefix` ([#143](https://github.com/prebuild/prebuild-install/issues/143)) ([**@mathiask88**](https://github.com/mathiask88))

## [6.0.0] - 2020-10-23

### Changed

- **Breaking:** don't skip downloads in standalone mode ([`b6f3b36`](https://github.com/prebuild/prebuild-install/commit/b6f3b36)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Document cross platform options ([`e5c9a5a`](https://github.com/prebuild/prebuild-install/commit/e5c9a5a)) ([**@fishbone1**](https://github.com/fishbone1))

### Removed

- **Breaking:** remove `--compile` and `--prebuild` options ([`94f2492`](https://github.com/prebuild/prebuild-install/commit/94f2492)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Support npm 7 ([`8acccac`](https://github.com/prebuild/prebuild-install/commit/8acccac), [`08eaf6d`](https://github.com/prebuild/prebuild-install/commit/08eaf6d), [`22175b8`](https://github.com/prebuild/prebuild-install/commit/22175b8)) ([**@vweevers**](https://github.com/vweevers))

## [5.3.6] - 2020-10-20

### Changed

- Replace `mkdirp` dependency with `mkdirp-classic` ([**@ralphtheninja**](https://github.com/ralphtheninja))

[7.1.3]: https://github.com/prebuild/prebuild-install/releases/tag/v7.1.3

[7.1.2]: https://github.com/prebuild/prebuild-install/releases/tag/v7.1.2

[7.1.1]: https://github.com/prebuild/prebuild-install/releases/tag/v7.1.1

[7.1.0]: https://github.com/prebuild/prebuild-install/releases/tag/v7.1.0

[7.0.1]: https://github.com/prebuild/prebuild-install/releases/tag/v7.0.1

[7.0.0]: https://github.com/prebuild/prebuild-install/releases/tag/v7.0.0

[6.1.4]: https://github.com/prebuild/prebuild-install/releases/tag/v6.1.4

[6.1.3]: https://github.com/prebuild/prebuild-install/releases/tag/v6.1.3

[6.1.2]: https://github.com/prebuild/prebuild-install/releases/tag/v6.1.2

[6.1.1]: https://github.com/prebuild/prebuild-install/releases/tag/v6.1.1

[6.1.0]: https://github.com/prebuild/prebuild-install/releases/tag/v6.1.0

[6.0.1]: https://github.com/prebuild/prebuild-install/releases/tag/v6.0.1

[6.0.0]: https://github.com/prebuild/prebuild-install/releases/tag/v6.0.0

[5.3.6]: https://github.com/prebuild/prebuild-install/releases/tag/v5.3.6

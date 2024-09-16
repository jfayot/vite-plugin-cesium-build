import type { Plugin } from 'vite'

import { viteExternalsPlugin } from 'vite-plugin-externals'

import { type BuildCesiumOptions, copyCesium, importCesium, importCss, resolveOptions, setBaseUrl } from './core'

function pluginEntry(pluginOptions?: Partial<BuildCesiumOptions>): Plugin[] {
  const options = resolveOptions(pluginOptions, 'node_modules/cesium/Build/Cesium')

  return [
    viteExternalsPlugin({ cesium: 'Cesium' }),
    ...copyCesium(
      options,
      ['Assets', 'ThirdParty', 'Widgets', 'Workers'],
      {
        src: `${options.from}/Cesium.js`,
        dest: `${options.to}/`,
      },
    ),

    importCesium(base => `${base}${options.from}Unminified/Cesium.js`, 'serve'),
    importCesium(base => `${base}${options.to}/Cesium.js`, 'build'),

    importCss(options, base => `${base}${options.from}Unminified/Widgets/widgets.css`, 'serve'),
    importCss(options, base => `${base}${options.to}/Widgets/widgets.css`, 'build'),

    setBaseUrl(options),
  ]
}

export default pluginEntry

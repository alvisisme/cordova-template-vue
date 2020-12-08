/**
 * 生成最终需要编译的插件列表
 */
const path = require('path')
const fs = require('fs')

const plugin_dir = path.join(process.cwd(), 'src', 'plugins')
const dirs = fs.readdirSync(plugin_dir)

const pluginConfig = []
for (const dir of dirs) {
  const configPath = path.join(plugin_dir, dir, 'config.json')
  const config = require(configPath)
  if (!config.build) {
    continue
  }
  pluginConfig.push(config)
}

let data = `
export default [`

for (const index in pluginConfig) {
  const item = pluginConfig[index]
  data += `
  {
    id: '${item.id}',
    entry: () => import(/* webpackChunkName: "plugin-${item.id}" */ '@/plugins/${item.id}/bootstrap.js')
  }`
  if (index < pluginConfig.length - 1) {
    data += `,
`
  }
}

data += `
]
`

fs.writeFileSync(path.join(process.cwd(), 'src', 'plugins.js'), data)

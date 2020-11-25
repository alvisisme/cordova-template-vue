const _plugins = []

export default {
  add(plugin) {
    _plugins.push(plugin)
  },
  getAll() {
    return _plugins
  },
  getById(id) {
    for (const item of _plugins) {
      if (item.id === id) {
        return item
      }
    }
  }
}

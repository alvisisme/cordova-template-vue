import _ from 'lodash'

const checkPermission = permission => {
  return new Promise((resolve, reject) => {
    const permissions = window.cordova.plugins.permissions
    permissions.checkPermission(permission, resolve, reject)
  })
}

const requestPermission = permission => {
  return new Promise((resolve, reject) => {
    window.cordova.plugins.permissions.requestPermission(permission, resolve, reject)
  })
}

const requestPermissions = permissions => {
  return new Promise((resolve, reject) => {
    window.cordova.plugins.permissions.requestPermissions(permissions, resolve, reject)
  })
}

export default {
  enabled() {
    return !!_.get(window, 'cordova.plugins.permissions')
  },
  checkPermission,
  requestPermission,
  requestPermissions,
  async ensurePermission(permission) {
    let status = await checkPermission(permission)
    if (!status.hasPermission) {
      status = await requestPermission(permission)
    } else {
      status = {
        hasPermission: true
      }
    }
    return status
  }
}

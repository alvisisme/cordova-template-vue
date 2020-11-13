/**
 * 文件功能辅助接口
 * 注意事项:
 * 1. 所有传入的文件路径前带有 file:// 协议前缀，如 file:///sdcard，否则会报错
 * 2. 路径中如果存在中文，可能需要解码 decodeURI(fileEntry.nativeURL) 才能正常使用
 */
import _ from 'lodash'
import { to } from '@/utils/to'

/**
 * @typedef FileSystemEntry
 * 详见 https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry
 */

/**
 * @typedef FileError
 * @property {Number} code 错误码
 * @property {String} message 错误信息
 * @property {String} stack 错误栈详细信息
 */

// see https://github.com/apache/cordova-plugin-file#list-of-error-codes-and-meanings
const FileError = {
  NOT_FOUND_ERR: 1,
  SECURITY_ERR: 2,
  ABORT_ERR: 3,
  NOT_READABLE_ERR: 4,
  ENCODING_ERR: 5,
  NO_MODIFICATION_ALLOWED_ERR: 6,
  INVALID_STATE_ERR: 7,
  SYNTAX_ERR: 8,
  INVALID_MODIFICATION_ERR: 9,
  QUOTA_EXCEEDED_ERR: 10,
  TYPE_MISMATCH_ERR: 11,
  PATH_EXISTS_ERR: 12,
  // 自定义错误
  UNKNOWN_ERR: 13
}

function createError(code) {
  const error = new Error('UNKNOWN_ERR')
  const keys = _.keys(FileError)
  for (const key of keys) {
    if (FileError[key] === code) {
      error.code = code
      error.message = key
      return error
    }
  }
  error.code = FileError.UNKNOWN_ERR
  return error
}

function FileEntryRemovePromise(entry) {
  return new Promise((resolve, reject) => {
    entry.remove(resolve, fileError => {
      reject(createError(fileError.code))
    })
  })
}

function getFileEntryAsync(path) {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(path, resolve, reject)
  })
}

function getEntriesAsPromise(dirEntry) {
  return new Promise((resolve, reject) => {
    const result = []
    const reader = dirEntry.createReader()
    const doBatch = () => {
      reader.readEntries(entries => {
        if (entries.length > 0) {
          entries.forEach(e => result.push(e))
          doBatch()
        } else {
          resolve(result)
        }
      }, reject)
    }
    doBatch()
  })
}

function writeFileAsPromise(fileEntry, data, isAppend) {
  return new Promise((resolve, reject) => {
    fileEntry.createWriter(fileWriter => {
      fileWriter.onwriteend = resolve
      fileWriter.onerror = function(e) {
        reject(e)
      }
      // If we are appending data to file, go to the end of the file.
      if (isAppend) {
        try {
          fileWriter.seek(fileWriter.length)
        } catch (e) {
          reject(e)
        }
      }
      fileWriter.write(data)
    }, reject)
  })
}

function copyToAsPromise(fileEntry, newParent, newName) {
  return new Promise((resolve, reject) => {
    fileEntry.copyTo(newParent, newName, resolve, reject)
  })
}

function moveToAsPromise(fileEntry, newParent, newName) {
  return new Promise((resolve, reject) => {
    fileEntry.moveTo(newParent, newName, resolve, reject)
  })
}

function readFileAsPromise(fileEntry) {
  return new Promise((resolve, reject) => {
    fileEntry.file(file => {
      const reader = new FileReader()
      reader.onloadend = function() {
        resolve(this.result)
      }
      reader.readAsText(file)
    }, reject)
  })
}

export default {
  /**
   * 判断文件功能是否可用，调用其它接口前务必调用该接口判断
   * @return  {Boolean} 功能是否可用
   * @example
   * if (FileFeature.enabled()) {
   *  // do something
   * }
   */
  enabled() {
    return !!_.get(window, 'cordova.file')
  },
  /**
   * 文件是否存在
   * @param {String} path 文件路径
   * @return {Boolean} 文件是否存在
   * @throws {FileError}
   * @example
   * const filePath = 'file:///sdcard/test.txt'
   * const exists = await FileFeature.exists(filePath)
   * if (exists) {
   *   console.log('file exists')
   * }
   */
  exists(path) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(path, fileEntry => {
        resolve(true)
      }, fileError => {
        if (fileError.code === FileError.NOT_FOUND_ERR) {
          resolve(false)
        } else {
          reject(createError(fileError.code))
        }
      })
    })
  },
  /**
   * 在指定目录下创建一个新目录
   * @param {String} parent 需要创建的目录所在父目录，该目录必须存在
   * @param {String} dir 需要创建的目录名，如果该目录已存在，则正常返回
   * @return {FileSystemEntry}
   * @throws {FileError} parent 目录不存在时抛出异常
   * @example
   * const parent = cordova.file.externalRootDirectory
   * const dir = 'testDir'
   * const fileEntry = await FileFeature.mkdir(parent, dir)
   * if (fileEntry) {
   *   console.log('create dir success')
   * }
   */
  async mkdir(parent, dir) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(parent, fileEntry => {
        if (fileEntry.isDirectory) {
          fileEntry.getDirectory(dir, { create: true }, resolve, fileError => {
            reject(createError(fileError.code))
          })
        }
      }, fileError => {
        reject(createError(fileError.code))
      })
    })
  },
  /**
   * 递归删除目录
   *
   * @param {String} path, 如 file:///sdcard/dir
   * @throws {FileError} 目录不存在或者不是目录则抛出异常
   * @example
   * const path = file:///sdcard/testdir
   * try {
   *   await FileFeature.removeDirRecursive(path)
   *   console.log('remove dir success')
   * } catch(error) {
   *   console.log('remove dir failed ' + error.message)
   * }
   */
  async removeDirRecursive(path) {
    function LocalFileSystemPromise(path) {
      return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(path, entry => {
          if (!entry.isDirectory) {
            return resolve([entry])
          }
          entry.createReader().readEntries(resolve, reject)
        }, reject)
      })
    }
    async function removeWrapper(path) {
      const entries = await LocalFileSystemPromise(path)
      for (const entry of entries) {
        if (entry.isFile) {
          await FileEntryRemovePromise(entry)
        } else if (entry.isDirectory) {
          // 递归删除子目录
          await removeWrapper(entry.nativeURL)
          await FileEntryRemovePromise(entry)
        }
      }
    }

    try {
      const fileEntry = await getFileEntryAsync(path)
      if (!fileEntry.isDirectory) {
        const notDirError = new Error('TYPE_MISMATCH_ERR')
        notDirError.code = FileError.TYPE_MISMATCH_ERR
        throw notDirError
      }
      // 删除所有子目录和子文件
      await removeWrapper(path)
      // 删除自身
      await FileEntryRemovePromise(fileEntry)
    } catch (error) {
      throw createError(error.code)
    }
  },
  /**
   * 删除指定文件
   * @param {String} path 文件路径，如 file:///sdcard/a.txt
   * @throws {FileError} 文件不存在，或不是普通文件，或删除失败等则抛出异常
   * @example
   * const path = file:///sdcard/test.txt
   * try {
   *   await FileFeature.removeFile(path)
   *   console.log('remove file success')
   * } catch(error) {
   *   console.log('remove file failed ' + error.message)
   * }
   */
  async removeFile(path) {
    try {
      const fileEntry = await getFileEntryAsync(path)
      if (!fileEntry.isFile) {
        const notDirError = new Error('TYPE_MISMATCH_ERR')
        notDirError.code = FileError.TYPE_MISMATCH_ERR
        throw notDirError
      }
      // 删除自身
      await FileEntryRemovePromise(fileEntry)
    } catch (error) {
      throw createError(error.code)
    }
  },
  /**
   * 判断路径是否为目录
   * @param {String} path 文件路径
   * @return {Boolean} 是否为目录
   * @throw {FileError} 路径不存在时抛出异常
   * @example
   * const path = file:///sdcard/testDir
   * try {
   *   const isDir = await FileFeature.isDirectory(path)
   *   console.log('isDir ? ' + isDir)
   * } catch(error) {
   *   console.log(error.message)
   * }
   */
  async isDirectory(path) {
    try {
      const fileEntry = await getFileEntryAsync(path)
      return fileEntry.isDirectory
    } catch (error) {
      throw createError(error.code)
    }
  },
  /**
   * 判断路径是否为文件
   * @param {String} path 文件路径
   * @return {Boolean} 是否为文件
   * @throw {FileError} 路径不存在时抛出异常
   * @example
   * const path = file:///sdcard/testFile
   * try {
   *   const isFile = await FileFeature.isFile(path)
   *   console.log('isFile ? ' + isFile)
   * } catch(error) {
   *   console.log(error.message)
   * }
   */
  async isFile(path) {
    try {
      const fileEntry = await getFileEntryAsync(path)
      return fileEntry.isFile
    } catch (error) {
      throw createError(error.code)
    }
  },
  /**
   * 获得目录下所有文件信息
   * @param {String} dir 目录路径
   * @return {Array<FileEntry>} 文件对象列表
   * @throw {FileError} 目录不存在或者dir不是目录时抛出异常
   * @example
   * const path = file:///sdcard/
   * try {
   *   const fileEntries = await FileFeature.readDirectory(path)
   *   console.log(fileEntries)
   * } catch(error) {
   *   console.log(error.message)
   * }
   */
  async readDirectory(dir) {
    try {
      const dirEntry = await getFileEntryAsync(dir)
      if (!dirEntry.isDirectory) {
        const notDirError = new Error('TYPE_MISMATCH_ERR')
        notDirError.code = FileError.TYPE_MISMATCH_ERR
        throw notDirError
      }
      return getEntriesAsPromise(dirEntry)
    } catch (error) {
      throw createError(error.code)
    }
  },
  /**
   * 在目标目录下创建一个文件，若文件已存在则正常返回
   * @param {String} parent 文件所在目录，必须存在
   * @param {String} fileName 需要创建的文件名
   * @throw {FileError} 以下情形会抛出异常
   *  1. parent不是目录
   *  2. parent目录不存在
   *  3. 创建文件失败时
   *  4. fileName已存在但是不是文件
   * @example
   * const parent = 'file:///sdcard/testdir'
   * const fileName = 'test.txt'
   * try {
   *   await FileFeature.createFile(parent, fileName)
   *   console.log('create file success')
   * } catch (error) {
   *   console.log('create file failed with message ' + error.message)
   * }
   */
  async createFile(parent, fileName) {
    try {
      const dirEntry = await getFileEntryAsync(parent)
      if (!dirEntry.isDirectory) {
        const notDirError = new Error('TYPE_MISMATCH_ERR')
        notDirError.code = FileError.TYPE_MISMATCH_ERR
        throw notDirError
      }
      return new Promise((resolve, reject) => {
        dirEntry.getFile(fileName, { create: true, exclusive: false }, resolve, reject)
      }).then(async fileEntry => {
        // 一个BUG: 如果文件已存在而且是一个目录，
        // fileEntry.isFile 会是 true，
        // 需要进行类型判断
        const entry = await getFileEntryAsync(`${parent}/${fileName}`)
        if (entry.isFile) {
          return fileEntry
        } else {
          const error = new Error('TYPE_MISMATCH_ERR')
          error.code = FileError.TYPE_MISMATCH_ERR
          throw error
        }
      })
    } catch (error) {
      throw createError(error.code)
    }
  },
  /**
   * 写入文本到本地文件
   * @param {String} filePath 需要写入文本的文件路径
   * @param {String} text 需要写入的文本
   * @throw {FileError} filePath 不是文件时抛出异常
   * @example
   * const filePath = 'file:///sdcard/test.txt'
   * const data = 'hello world'
   * try {
   *   await FileFeature.writeFile(filePath, data)
   *   console.log('write file success')
   * } catch (error) {
   *   console.log('write file failed with message ' + error.message)
   * }
   */
  async writeFile(filePath, data) {
    try {
      const fileEntry = await getFileEntryAsync(filePath)
      await writeFileAsPromise(fileEntry, data)
    } catch (error) {
      throw createError(error.code)
    }
  },
  /**
   * 追加文本到本地文件
   * @param {String} filePath 需要写入文本的文件路径
   * @param {String} text 需要写入的文本
   * @throw {FileError} filePath 不是文件时抛出异常
   * @example
   * const filePath = 'file:///sdcard/test.txt'
   * const data = 'hello world'
   * try {
   *   await FileFeature.appendFile(filePath, data)
   *   console.log('append file success')
   * } catch (error) {
   *   console.log('append file failed with message ' + error.message)
   * }
   */
  async appendFile(filePath, data) {
    try {
      const isAppend = true
      const fileEntry = await getFileEntryAsync(filePath)
      await writeFileAsPromise(fileEntry, data, isAppend)
    } catch (error) {
      if (error.message) {
        throw error
      } else {
        throw createError(error.code)
      }
    }
  },
  /**
   * 从本地文件读取文本内容
   * @param {String} filePath 需要读取文本的文件路径
   * @return {String} 读取的文本内容
   * @throw {FileError} filePath 不是文件时抛出异常
   * const filePath = 'file:///sdcard/test.txt'
   * try {
   *   const data = await FileFeature.readFile(filePath)
   *   console.log('read file data ' + data)
   * } catch (error) {
   *   console.log('read file data failed with message ' + error.message)
   * }
   */
  async readFile(filePath) {
    try {
      const fileEntry = await getFileEntryAsync(filePath)
      return await readFileAsPromise(fileEntry)
    } catch (error) {
      throw createError(error.code)
    }
  },
  /**
   * 移动 source 文件到 target 目录下的，命名为 newName
   * @param {String} source 需要移动的文件路径，必须存在
   * @param {String} target 新文件所在目标目录路径，必须存在
   * @param {String} newName 新文件名
   * @throw {FileError} source 或者 target 不存在时抛出异常
   * @example
   * try {
   *   const source = 'file:///sdcard/a.txt'
   *   const target = 'file:///sdcard/'
   *   const newName = 'a.txt.bak'
   *   await FileFeature.moveTo(source, parent, newName)
   *   console.log('move success')
   * } catch (error) {
   *   console.error(error)
   * }
   */
  async moveTo(source, target, newName) {
    let sourceEntry, targetEntry, error
    [error, sourceEntry] = await to(getFileEntryAsync(source))
    if (error) {
      const err = createError(error.code)
      err.message = 'source dir error ' + err.message
      throw err
    }

    [error, targetEntry] = await to(getFileEntryAsync(target))
    if (error) {
      const err = createError(error.code)
      err.message = 'target dir error ' + err.message
      throw err
    }

    [error] = await to(moveToAsPromise(sourceEntry, targetEntry, newName))
    if (error) {
      const err = createError(error.code)
      err.message = 'move error ' + err.message
      throw err
    }
  },
  /**
   * 复制 source 文件到 target 目录下的，命名为 newName
   * @param {String} source 需要复制的文件路径，必须存在
   * @param {String} target 新文件所在目标目录路径，必须存在
   * @param {String} newName 新文件名
   * @throw {FileError} source 或者 target 不存在时抛出异常
   * @example
   * try {
   *   const source = 'file:///sdcard/a.txt'
   *   const target = 'file:///sdcard/'
   *   const newName = 'a.txt.bak'
   *   await FileFeature.copyTo(source, parent, newName)
   *   console.log('copy success')
   * } catch (error) {
   *   console.error(error)
   * }
   */
  async copyTo(source, target, newName) {
    let sourceEntry, targetEntry, error
    [error, sourceEntry] = await to(getFileEntryAsync(source))
    if (error) {
      const err = createError(error.code)
      err.message = 'source dir error ' + err.message
      throw err
    }

    [error, targetEntry] = await to(getFileEntryAsync(target))
    if (error) {
      const err = createError(error.code)
      err.message = 'target dir error ' + err.message
      throw err
    }

    [error] = await to(copyToAsPromise(sourceEntry, targetEntry, newName))
    if (error) {
      const err = createError(error.code)
      err.message = 'copy error ' + err.message
      throw err
    }
  }
}

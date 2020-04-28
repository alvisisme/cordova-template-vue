# cordova-template-vue

[![Build Status](https://img.shields.io/travis/com/alvisisme/cordova-template-vue?style=flat-square)](https://travis-ci.com/alvisisme/cordova-template-vue)

cordova和vue的工程模板

## 如何使用

```bash
cordova create myapp --template git+https://github.com/alvisisme/cordova-template-vue.git
cd myapp
yarn install
yarn build
cordova platform add android
cordova prepare android
cordova run android
```

## 参考引用

* [Cordova Template Guide](https://cordova.apache.org/docs/en/latest/guide/cli/template.html)
* [Cordova hello world app](https://github.com/apache/cordova-app-hello-world)
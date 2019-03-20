/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

workbox.core.setCacheNameDetails({prefix: "goBuy-cache"});

workbox.skipWaiting(); // 强制等待中的 Service Worker 被激活
workbox.clientsClaim(); // Service Worker 被激活后使其立即获得页面控制权

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/.*\.(?:js|css|png|jpg)/, workbox.strategies.cacheFirst(), 'GET');
workbox.routing.registerRoute(/.*\.html/, workbox.strategies.networkFirst(), 'GET');

self.addEventListener('push', function (event) { 
  console.log('测试push')
  var data =  event.data.text()
  var payload = event.data ? JSON.parse(data) : 'no payload'
  console.log(payload.msg, payload.url)
  var title = '好购商城'
  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.msg,
      url: payload.url
    })
  )
})
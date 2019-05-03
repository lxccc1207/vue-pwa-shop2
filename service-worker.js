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
workbox.routing.registerRoute(/(.*)list(.*)/g, workbox.strategies.cacheFirst(), 'GET');
// 后台同步
const NotificationForUser = () => {
  self.registration.showNotification('留言发送成功', {
    body: '感谢您的留言！',
    icon: './static/phoneIcon.png'
  });
};
const bgSyncPlugin = new workbox.backgroundSync.Plugin('leaveMsg-queue', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours
  callbacks: {
    queueDidReplay: NotificationForUser // 通知用户
  }
});

workbox.routing.registerRoute(
  /(.*)leaveMsg(.*)/g,
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);
self.addEventListener('push', function (event) { 
  console.log('收到服务端push消息')
  var payload = event.data ? JSON.parse(event.data.text()) : 'no payload'
  console.log(payload.msg)
  var title = '好购商城'
  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.msg,
      // url: payload.url,
      icon: './static/phoneIcon.png'
    })
  )
})
var key
var authSecret
var endpoint
(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        window.addEventListener('load', () => {
          var publicKey = 'BF5oVjPzY-ixJmcOYC-o0064yL3fIQW3wrXcRm6Omr44PZYWo4fwmnr0TFe9W8nDw55qQgigd0o5czRYYsP5U0w'
            navigator.serviceWorker.register('sw.js', { scope: '/' }).then(registration => {
              console.log('Service Worker 注册成功')
              console.log('SW registered: ', registration)

              return registration.pushManager.getSubscription() // 获取任何已存在的订阅
                .then(function (subscription) {
                    // if (subscription) {// 如果已经订阅过了，则无须再次注册
                    //     return
                    // }
                    // 开启该客户端的消息推送订阅功能
                    return subscribeUserToPush(registration, publicKey);
                })
            })
            // .then(function (subscription) {
            //     var body = { subscription: subscription }
            //     // 为了方便之后的推送，为每个客户端简单生成一个标识
            //     body.uniqueid = new Date().getTime()
            //     console.log('uniqueid', body.uniqueid)
            //     // 将生成的客户端订阅信息存储在自己的服务器上
            //     return sendSubscriptionToServer(JSON.stringify(body));
            // })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
        })
    } else {
        console.log('浏览器不支持serviceworker')
    }
})()

// 发起订阅
function subscribeUserToPush(registration, publicKey) {
    var subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
    };
    return registration.pushManager.subscribe(subscribeOptions).then(function (subscription) {
        console.log('Received subscription: ', JSON.stringify(subscription));
        var rawKey = subscription.getKey ? subscription.getKey('p256dh') : ''
        key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : ''
        var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : ''
        authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : ''
        endpoint = subscription.endpoint

        // 客户端发送订阅请求
        return fetch('./api/subscription', {
          method: 'post',
          headers: new Headers({
              'content-type': 'application/json'
          }),
          body: JSON.stringify({
              endpoint:subscription.endpoint,
              key: key,
              authSecret: authSecret
          })
        })
    })
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


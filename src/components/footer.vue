<template>
  <div>
    <footer class="footer">
        <div class="footer__wrap">
          <div class="footer__secondary">
            <div class="footer__inner">
              <!-- <div class="footer__region">
                <span>站点</span>
                <select class="footer__region__select">
                  <option value="zh-CN">中国</option>
                  <option value="US">美国</option>
                  <option value="UK">英国</option>
                </select>
              </div> -->
              <div class="footer__secondary__nav">
                <span>Copyright © 2019 Mall 版权所有.</span>
                 <router-link to="/">
                  主页
                </router-link>
                <router-link to="/about">
                  关于我们
                </router-link>
                <router-link to="/contact">
                  联系我们
                </router-link>
                <!-- <a href=":;">
                  商业合作
                </a> -->
                <!-- <router-link to="/adminIndex">
                  管理员登录
                </router-link> -->
              </div>
            </div>
          </div>
        </div>
      </footer>
  </div>
</template>

<script>
export default {
  name:'mallFooter'
}
</script>
<style>
</style>

<!--管理员首页 -->
<template>
  <div>
    <el-container class="change-header">
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="1">商品管理</el-menu-item>
          <el-menu-item index="2" >系统设置</el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :default-openeds="openeds"
            router>
            <el-submenu index="/adminIndex/goodsList">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/adminIndex/goodsList"><router-link :to="{name:'goodsList'}">商品列表</router-link></el-menu-item>
                <el-menu-item index="/adminIndex/addGoods"><router-link :to="{name:'addGoods'}">增加商品</router-link></el-menu-item>
                <el-menu-item index="1-3">商品属性</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="/adminIndex">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1">订单列表</el-menu-item>
                <el-menu-item index="2-2">订单详情</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main> 
      </el-container>
    </el-container>
  </div> 
</template>


<script>
  export default {
    name:'adminIndex',
    data() {
      return {
        activeIndex: '1',
        openeds:['/adminIndex']
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },
    computed: {
    },
    mounted() {
    
    }
  }
</script>
<style lang="stylus" scoped>
.change-header>>> .el-header
  padding:0
</style>


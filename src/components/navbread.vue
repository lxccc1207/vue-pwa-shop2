<template>
  <div>
      <nav class="nav-bar">
        <ul class="nav-bar-ul">
          <li><router-link to="/">首页</router-link><li>
          <li class="li-brand"><a href="#">品牌</a>
            <ul class="nav-bar-ul-second">
              <li><a href="https://sale.vmall.com/p20.html?cid=547">华为</a></li>
              <li><a href="https://www.mi.com/mi8/">小米</a></li>
              <li><a href="http://hd.oppo.com/act/2018/FindX0622/index.html?utm_source=baidu&utm_medium=cpcfindx&utm_campaign=pcfindx00996">OPPO</a></li>  
              <li><a href="https://www.vivo.com/?cid=w-2-baidu_ada-pinzhuan">vivo</a></li>
              <li><a href="https://sale.vmall.com/honor.html?cid=63137&smtid=530089160z2d0az1h042z5qz0z">荣耀</a></li>              
              <li><a href="https://www.apple.com/cn/iphone-x/">iPhone X</a></li>
              <li><a href="https://www.meizu.com">魅族</a></li>
            </ul>
          </li>
          <li><router-link to="/about">关于我们</router-link></li>
          <li><router-link to="/contact">联系我们</router-link></li>
        </ul>
      </nav>   
  </div>
</template>
<script>
  export default {
    name:'mallBread',
    data(){
      return{

      }
    }
  }
</script>

<style lang="stylus" scoped>
.nav-bar
  height :40px
  
  .nav-bar-ul
    max-width :1280px
    line-height :40px
    margin :0 auto   
    li
      @media screen and (min-width :768px){
      font-size:20px  
      }
      font-size:16px
      // font-weight:700
      float :left
      width :25%
      line-height :40px
      text-align :center
      position :relative    
      .nav-bar-ul-second
        width:100%
        min-height:200px
        display :none
        position:absolute
        z-index :99
        background :#f5f7fc
        // @media screen and (min-width:1025px) {
        //   margin-top:15px
        // }
        li
          float :left
          width:100%
    li:hover
      ul
        display: block

</style>


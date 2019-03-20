<!--关于我们 -->
<template>
  <div>
    <div class="contain">
        <div class="head">
            <h1>好购公司</h1>
            <p>好购公司正式成立于2018年6月，是一家专注于高端智能手机、智能耳机以及智能电子产品的企业。
                “让每个人都能享受到用最实惠的价格买到最前沿电子产品”是好购公司的愿景。
                好购公司应用了直接与产商对接的模式，用极客精神做电商，用互联网模式干掉中间商环节，
                致力于让全球每个人，都能享用来自中国的优质智能数码产品。
            </p>
        </div>
        <div class="content">
            <div class="table-left">
                <p class="table-left-h">关于Go buy商城</p>
                <p class="table-left-content">Go buy商城是好购公司重点打造的中国专业的电脑、手机、网上购物商城。
                  好购公司承诺，以更低价格、更便捷的订货方式、更快送达的承诺为网购用户提供内外兼修的品质服务。
                  Go buy商城安卓版是为安卓用户独特打造的，操作更加符合安卓用户，
                  Go buy商城安卓手机版现已实现了下单、订单查询、商品搜索、物流跟踪，产品评价等常用功能，
                  同WEB版合力打造最流畅，最便捷的购物体验。
                  Go buy网上商城是好购公司的唯一官方网上商城，是中国领先、专业的消费电子商品网上商城。
                  Go buy 网上商城自上线以来，立志以满足网购消费者对高端前沿电子产品需求为核心，为网购消费者提供优质划算商品及快速配送服务，
                  我们愿景成为中国最大、最好、最专业的高端消费电子产品网购商城。
                </p>
               
            </div>
            <div class="table-right">
              <img src="../../static/about.jpg" alt="">
            </div>
        </div>
    </div> 
  </div>
</template>


<script>
  export default {
    name:'About',
    data () {
      return {
      
      }
    },
    computed: {
    },
    mounted() {
     
    },
    methods: {
        
    }
  }
</script>
<style lang="stylus" scoped>
.contain
  max-width :1280px
  background :white
  margin:0 auto
.head
  text-align :center
  padding:10px 0
  h1
    margin:20px
  p
    display :block
    max-width :1080px
    margin :0 auto
    text-indent: 2em
    text-align:justify
    padding:0 20px
.content
  display :flex
  overflow :hidden
  //min-height :600px
  justify-content :center
  flex-direction :column
.table-left
  position :relative
  width:100%
  .table-left-h
    font-size :2em
    font-weight:540
    text-align :center
    margin:20px 0
  .table-left-content
    display :block
    max-width :1080px
    margin :0 auto
    text-indent: 2em
    text-align:justify
    padding:0 20px
 .table-right
   width :100%
   margin:50px 0
   position :relative
   height :30vw
   img
     position :absolute
     top:50%
     left :50%
     transform :translate(-50%,-50%)
     width :80vw
     height :30vw
     margin:0 auto
</style>


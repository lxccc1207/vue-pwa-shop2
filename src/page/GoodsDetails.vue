<!--商品详情-->
<template>
<div>
  <div class="w store-content">
    <div ref="gray"  class="gray-box">
      <div class="gallery-wrapper">
        <div ref="gallery" class="gallery">
          <!--下面-->
          <div class="thumbnail">
            <ul v-if="List && List.goodsimages">
              <li v-for="(item, index) in List.goodsimages" :key="index" :class="{on:big===index}" @click="getIndex(item.src, index)">
                <img v-lazy="`static/goodsImages/${item.src}`" :alt="List.goodsList[0].productName">
              </li>
              <!-- <li :class="{on:big===2}" @click="big=2">
                <img v-lazy="`static/${item.productImg}`" :alt="item.productName">
              </li> -->
            </ul>
          </div>
          <!--上面-->
          <div class="thumb">
            <div class="big">
              <!-- <img v-lazy="`static/${List.goodsList[0].productImg}`" :alt="List.goodsList[0].productName"> -->
              <img :src="`static/${ImgUrl}`">
            </div>
          </div>
        </div>
      </div>
      <!--右边-->
      <div ref="banner" class="banner">
        <div v-if="List && List.goodsList" class="sku-custom-title">
          <h4>{{List.goodsList[0].productDetails}}</h4>
          <h6>
            <span>{{List.goodsList[0].sub_title}}</span>
            <span class="price">
              <em>¥</em><i>{{List.goodsList[0].productPrice}}</i></span>
          </h6>
        </div>
        <div v-if="List && List.goodsList" class="num">
          <span class="params-name">数量</span>
          <el-input-number size="mini" v-model="num" @change="handleChange" :min="1" :max="List.goodsList[0].limit_num"></el-input-number>
          <!-- <buy-num @edit-num="editNum" :limit="Number(List.goodsList[0].limit_num)"></buy-num> -->
        </div>
        <div v-if="List && List.goodsList" class="buy">
          <y-button text="加入购物车"
                    @btnClick="addCart(List.goodsList[0])"
                    classStyle="main-btn"
                    style="width: 145px;height: 50px;line-height: 48px"></y-button>
          <y-button text="现在购买"
                    @btnClick="checkout(List.goodsList[0])"
                    style="width: 145px;height: 50px;line-height: 48px;margin-left: 10px"></y-button>
        </div>
      </div>
    </div>
    <!--产品信息-->
    <div ref="itemInfo" class="item-info">
      <y-shelf title="产品信息">
        <div slot="content">
          <!-- <div class="img-item">
            <div></div>
          </div> -->
          <div v-if="List && List.goodsList" class="no-info">
            <img v-lazy="`static/details-img/${List.goodsList[0].descImg}`" onclick="return false">
            <br>
            {{List.goodsList[0].desc}}
          </div>
        </div>
      </y-shelf>
    </div>
  </div>
  <modal :mdShow="mdShow" v-on:close="closeModal">
          <p slot="message">{{showText}}</p>
          <div slot="btnGroup">
            <a href="javascript:;" class="btn btn--m" @click="mdShow=false" v-if="!ifCart">关闭</a>
            <a href="javascript:;" class="btn btn--m" @click="mdShow=false" v-if="ifCart">继续购物</a>
            <router-link to="/cart" class="btn btn--m" @click="mdShow=false" v-if="ifCart">去购物车</router-link> 
          </div>
        </modal>
</div>
</template>
<script>
  // import { productDet, addCart } from '../api/goods.js'
  import { mapMutations, mapState } from 'vuex'
  import YShelf from '../components/shelf'
  import BuyNum from '../components/buynum'
  import YButton from '../components/YButton'
  import modal from '../components/modal.vue'
  // import { getStore } from '/utils/storage'
  import axios from 'axios'
  export default {
    data () {
      return {
        ImgUrl:'',
        mainImage: '',
        num: 1,
        small: [],
        List:[],
        big: null,
        product: {},
        productNum: 1,
        userId: '',
        mdShow:false,
        showText:'',
        ifCart:false,
        productId:''
      }
    },
    computed: {
      // ...mapState(['login', 'showMoveImg', 'showCart'])
    },
    mounted() {              
      this.getdata()
    },
    updated() {
      this.calHeight();
    },
    methods: {
      getdata(){
        var m = Base64.decode(this.$route.query.m);
        // alert(m);
        var param = ({
          productId:m
        });
        axios.get('/api/getDetails', {
          params:param
        }).then((res) => {
          res = res.data;
          if(res.status === '1') {
            this.List = res.result;
            console.log(this.List);
            this.ImgUrl = this.List.goodsList[0].productImg // 默认展开的大图
          }
        });
      },
      getIndex(src, index) {
        this.big = index
        this.ImgUrl = 'goodsImages/' + src
      },
      handleChange(num) {
        this.productNum = num
      },
      calHeight(){
        var clientWidth = document.body.clientWidth;
        //  console.log("屏幕宽度"+clientWidth)
        if (clientWidth < 1024) {
          this.$nextTick(() => {
            var gallery = this.$refs.gallery;
            var banner = this.$refs.banner;
            // console.log(gallery.offsetHeight)
            var Height= gallery.offsetHeight+banner.offsetHeight;
            // console.log("所求高度"+Height)
            var gray = this.$refs.gray
            gray.style.height = Height+'px'
          })
        }
      },
      editNum (num) {
        // this.productNum = num
        //console.log(this.productNum);
      },
      addCart(value) {
          this.productId = value.productId;
          var param = {
            productId:this.productId,
            productNum:this.productNum
          };
          //console.log(this.productNum)
          axios.get('/api/addCart', {
            params:param //将productId传给后台
          }).then((res) => {
            res = res.data;
            // console.log(res.status);
            if(res.status === '1'){
              var setData = ({
                productId: value.productId,
                productPrice: value.productPrice,
                checked:1,
                productName: value.productName,
                productImg: value.productImg,
                productNum: this.productNum
                });
              this.$store.commit('updateCartList', setData);
              this.$store.commit('updateCartCount', 1);
              this.$store.commit('updateHaveProduct', true);
              this.showText = res.msg;
              this.mdShow = true;
              this.ifCart = true;
            }else if(res.status === '10001'){
                    //alert(`${res.msg}`);
                    this.showText = res.msg;
                    this.mdShow = true;
            }else{
              console.log('faile!');
            }
          }).catch((error) => {
            console.log('error');
          });
        },
        closeModal() {
          this.mdShow = false;
        },
      checkout (item) {
        var productId=item.productId
        //先检测是否登录
        axios.get('/api/users/checkLogin').then((res) => {
            res = res.data;
            if(res.status === '1') {
                  axios.post('/api/buynow',{
                    params:{
                      productId:item.productId, //传给后台用于查询
                      productNum:this.productNum
                    }
                }).then((res)=>{
                    res=res.data
                    var setdata = {
                      productName:res.productName,
                      productPrice:res.productPrice,
                      productNum:this.productNum,
                      productImg:res.productImg,
                      productId:item.productId,
                      userId:res.userId
                    }
                    //console.log(setdata)
                    this.$store.commit('updatebuynowlist',setdata)
                 })
             this.$router.push({
                    path: '/checkout', query: {productId, num: this.productNum}
                  });
            } else if(res.status === '10001'){
                    //alert(`${res.msg}`);
                    this.showText = res.msg;
                    this.mdShow = true;
           }
          });
     
      },
      scrollTop() {
          var promise = new Promise(()=>{
            this.$router.push({
                path:`/`
            });
          }).then($('html,body').animate({scrollTop:480},500));
      }
    },
    components: {
      YShelf, 
      BuyNum, 
      YButton,
      modal
    },
    //created () {
      //let id = this.$route.query.productId
      //this._productDet(id)
      //this.userId = getStore('userId')
    //}
  }
</script>
<style lang="scss" scoped>
  @import '../assets/style/mixin.scss';
  @import '../assets/css/detailmobile.css';
  .store-content {
    clear: both;
    // width: 1220px;
    min-height: 600px;
    padding: 0 0 25px;
    margin: 0 auto;
  }

  .gray-box {
    display: flex;
    padding: 60px;
    margin: 20px 0;
    .gallery-wrapper {
      .gallery {
        display: flex;
        width: 540px;
        
        .thumbnail {
          li:first-child {
            margin-top: 0px;
          }
          li {
            // @media screen and (max-width: 1023px){
            //   float:left
            // }
            @include wh(80px);
            margin-top: 10px;
            padding: 12px;
            border: 1px solid #f0f0f0;
            border: 1px solid rgba(0, 0, 0, .06);
            border-radius: 5px;
            cursor: pointer;
            &.on {
              padding: 10px;
              border: 3px solid #ccc;
              border: 3px solid rgba(150, 56, 56, 0.2);
            }
            img {
              display: block;
              @include wh(100%);
            }
          }
        }
        .thumb {
          .big {
            margin-left: 20px;
            // @media screen and (max-width: 1023px) {
            
            // // width: 35vw;
            // // height: 22vh;
            // }
          }
          img {
            display: block;
            @include wh(440px);
            // @media screen and (max-width: 1023px) {
            // width:100%;
            // height:100%;
            // }
            
          }
        }
      }
    }
    // 右边
    .banner {
      width: 580px;
      margin-left: 10px;
      h4 {
        font-size: 16px;
        font-weight:700;
        line-height: 1.25;
        color: #000;
        margin-bottom: 13px;
      }
      h6 {
        font-size: 14px;
        line-height: 1.5;
        color: #bdbdbd;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sku-custom-title {
        overflow: hidden;
        padding: 8px 8px 18px 10px;
        position: relative;
      }
      .params-name {
        padding-right: 20px;
        font-size: 14px;
        color: #8d8d8d;
        line-height: 36px;
      }
      .num {
        padding: 29px 0 8px 10px;
        border-top: 1px solid #ebebeb;
        display: flex;
        align-items: center;
      }
      .buy {
        position: relative;
        border-top: 1px solid #ebebeb;
        padding: 30px 0 0 10px;
      }
    }
  }

  .item-info {

    .gray-box {
      padding: 0;
      display: block;
    }
    .img-item {
      width: 1220px;
      // padding: 1vw;
      text-align: center;
      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }

  .no-info {
    padding: 200px 0;
    text-align: center;
    font-size: 30px;
  }

  .price {
    display: block;
    color: #d44d44;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;
    i {
      padding-left: 2px;
      font-size: 24px;
    }
  }
</style>

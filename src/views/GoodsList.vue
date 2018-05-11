<template>
  <div>
      <nav-header></nav-header>
      <nav-bread>
        <span slot="bread">商品</span>
        <span slot="test">测试一下</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">排序:</span>
            <a href="javascript:void(0)" class="default cur">默认</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">价格 <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show': filterBy}">
              <dl class="filter-price">
                <dt>价格:</dt>
                <dd>
                  <a href="javascript:void(0)" 
                    @click="priceChecked='all'" 
                    v-bind:class="{'cur':priceChecked=='all'}">All</a>
                  </dd>
                <dd v-for="(price, index) in priceFilter">
                  <a href="javascript:void(0)"
                    @click="setPriceFilter(index)"
                    v-bind:class="{'cur':priceChecked==index}"
                  >{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item, index) in goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                  <img v-show="hasMore" v-bind:src="'/static/loading.gif'" alt="">
                  <span v-show="!hasMore">我是有底线的...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayflag" @click="closePop"></div>
      <nav-footer></nav-footer>
    </div>
</template>

<script>
import '@/assets/css/base.css'
import '@/assets/css/product.css'

import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import NavBread from '@/components/NavBread'

import axios from 'axios'

export default {
  data(){
    return {
      goodsList: [],
      priceFilter: [
        {
          startPrice: 0,
          endPrice: 100
        },
        {
          startPrice: 100,
          endPrice: 500
        },
        {
          startPrice: 500,
          endPrice: 1000
        },
        {
          startPrice: 1000,
          endPrice: 5000
        }
      ],
      priceChecked: 'all',
      filterBy: false,
      overLayflag: false,
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: true,
      hasMore: true
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread
  },
  mounted(){
    this.getGoodsList();
  },
  methods: {
    getGoodsList(flag){
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      }
      axios.get('api/good/list', {
        params: params
      }).then((response) => {
        let res = response.data;
        if(res.status == '0'){
          if(flag){
            this.goodsList = this.goodsList.concat(res.result.list);
            if(res.result.count == 0 || res.result.count < this.pageSize){
              this.busy = true;
              this.hasMore = false;
            }else{
              this.busy = false;
            }
          }else{
            this.goodsList = res.result.list;
            this.busy = false;
          }
        }else{
          this.goodsList = [];
        }
      });
    },
    sortGoods(){
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList();
    },
    loadMore(){
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 500);
    },
    addCart(productId){
      axios.post('api/good/addCart', {
        productId: productId
      }).then((result) => {
        let res = result.data;
        if(res.status == 0){
          alert('加入成功')
        }else{
          alert(`msg:${res.message}`)
        }
      })
    },
    showFilterPop(){
      this.filterBy = true;
      this.overLayflag = true;
    },
    setPriceFilter(index){
      this.priceChecked = index;
      this.closePop();
      this.page = 1;
      this.getGoodsList();
    },
    closePop(){
      this.filterBy = false;
      this.overLayflag = false;
    }
  }
}
</script>


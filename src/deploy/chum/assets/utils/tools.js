export default {
  methods: {
    // 处理价格整数小数方法
    dealWithPrice(price) {
      price = Number(price);
      if (!price) {
        return [0, 0, `0.00`];
      }
      price = String(price.toFixed(2));
      let decimalNum = price.split('.')[1]; // 小数
      let integerNum = price.split('.')[0]; // 整数
      return [integerNum, decimalNum, `${integerNum}.${decimalNum}`];
    },
  },
}
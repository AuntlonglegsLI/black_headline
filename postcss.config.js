module.exports = {
  plugins: {
    "postcss-pxtorem": {
      // 一般情况下：按设计稿的尺寸来/10
      // 但是!!我们用的是 vant， vant 中默认使用的是 375 的设计稿
      // 所以，我们这里需要按 375 这个设计向来设置
      // 注意：因为设计向是750的，所以我们需要将设计稿中测试的值都除以2来使用
      /*
      总结：1. 因为 vant 是按 375 设计的，所以只能写 37.5
           2. 因为我们的设计图是750的，所以在测试完之后需要除以2再使用
      */
      rootValue: 37.5,
      propList: ["*"]
    }
  }
}

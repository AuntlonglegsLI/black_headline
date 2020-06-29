// 向项目中注册 Vant 组件

import Vue from 'vue'
import {
  Button,
  Cell,
  CellGroup,
  Icon,
  NavBar,
  Form,
  Field,
  CountDown,
  Toast,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  Tag,
  List,
  Popup,
  Grid,
  GridItem,
  Image,
  Lazyload,
  PullRefresh,
  ActionSheet,
  Uploader,
  RadioGroup,
  Radio,
  Picker
} from 'vant'

Vue.use(Button)
  .use(Cell)
  .use(CellGroup)
  .use(Icon)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(CountDown)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Tab)
  .use(Tabs)
  .use(List)
  .use(Popup)
  .use(Grid)
  .use(GridItem)
  .use(Tag)
  .use(Image)
  .use(PullRefresh)
  .use(ActionSheet)
  .use(Uploader)
  .use(RadioGroup)
  .use(Radio)
  .use(Picker)

Vue.use(Lazyload, {
  lazyComponent: true
})

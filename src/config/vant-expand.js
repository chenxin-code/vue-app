// 按需引入组件
// 2019.6.17 已更新为使用 2.x

import Vue from 'vue'
import {
  PasswordInput,
  Switch,
  Area,
  AddressEdit,
  NumberKeyboard,
  Field,
  Button,
  Dialog,
  Popup,
  ActionSheet,
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Step,
  Steps,
  Rate,
  Search,
  Stepper,
  Icon,
  Card,
  SwipeCell,
  Swipe,
  SwipeItem,
  TreeSelect,
  Picker,
  Overlay,
  Panel,
  SwitchCell,
  PullRefresh,
  Tag,
  CollapseItem,
  Collapse,
  Tab,
  NoticeBar,
  Tabs,
  List,
  DatetimePicker,
  IndexBar,
  IndexAnchor,
  ImagePreview,
  Progress,
  Circle,
  Col,
  Row,
  Empty,
  CountDown,
  Sticky,
  ShareSheet,
  Uploader,
  NavBar,
  Toast,
  Popover,
  Loading,
  Skeleton
} from 'vant'

Vue.use(PasswordInput).use(Switch).use(Overlay).use(Area).use(NoticeBar).use(AddressEdit).use(NumberKeyboard).use(Field).use(Button).use(Dialog).use(Popup).use(ActionSheet).use(RadioGroup).use(Radio).use(Cell).use(CellGroup).use(Checkbox).use(CheckboxGroup).use(Step).use(Steps).use(Rate).use(Search).use(Stepper).use(Icon).use(Card).use(SwipeCell).use(Tab).use(Tabs).use(Swipe).use(SwipeItem).use(TreeSelect).use(Picker).use(Panel).use(SwitchCell).use(PullRefresh).use(Tag).use(Collapse).use(CollapseItem).use(DatetimePicker).use(ImagePreview)
Vue.use(List).use(IndexBar).use(IndexAnchor).use(Progress).use(Circle).use(Col).use(Row).use(Empty).use(CountDown).use(Sticky).use(ShareSheet).use(Uploader).use(NavBar).use(Toast).use(Popover).use(Loading).use(Skeleton)


Toast.setDefaultOptions({ duration: 200 });
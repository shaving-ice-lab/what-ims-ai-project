/**
 * Ant Design 组件统一导出
 * 所有Web前端项目必须统一使用Ant Design组件库实现UI界面
 */

// Provider 和 Theme
export { default as AntdProvider, useTheme } from './AntdProvider';
export type { ThemeMode } from './AntdProvider';
export {
  ERROR_COLOR,
  INFO_COLOR,
  PRIMARY_COLOR,
  SUCCESS_COLOR,
  WARNING_COLOR,
  compactTheme,
  darkTheme,
  lightTheme,
} from './theme';

// ==================== 基础组件 ====================
export {
  AutoComplete,
  Button,
  Checkbox,
  ColorPicker,
  DatePicker,
  Input,
  InputNumber,
  Mentions,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
} from 'antd';

// ==================== 导航组件 ====================
export { Anchor, Breadcrumb, Dropdown, Menu, Pagination, Steps, Tabs } from 'antd';

// ==================== 反馈组件 ====================
export {
  Alert,
  Drawer,
  Modal,
  Popconfirm,
  Popover,
  Progress,
  Result,
  Skeleton,
  Spin,
  Tooltip,
  message,
  notification,
} from 'antd';

// ==================== 数据展示组件 ====================
export {
  Avatar,
  Badge,
  Calendar,
  Card,
  Carousel,
  Collapse,
  Descriptions,
  Empty,
  Image,
  List,
  QRCode,
  Segmented,
  Statistic,
  Table,
  Tag,
  Timeline,
  Tree,
} from 'antd';

// ==================== 表单组件 ====================
export { Cascader, Form, Transfer, TreeSelect, Upload } from 'antd';

// ==================== 布局组件 ====================
export { Affix, Col, Divider, Flex, FloatButton, Grid, Layout, Row, Space, Splitter } from 'antd';

// ==================== 其他组件 ====================
export { App, ConfigProvider, Tour, Typography, Watermark } from 'antd';

// ==================== 类型导出 ====================
export type {
  AffixProps,
  AlertProps,
  AnchorProps,
  BadgeProps,
  BreadcrumbProps,
  ButtonProps,
  CalendarProps,
  CardProps,
  CarouselProps,
  CascaderProps,
  CheckboxProps,
  ColProps,
  CollapseProps,
  ConfigProviderProps,
  DatePickerProps,
  DescriptionsProps,
  DividerProps,
  DrawerProps,
  DropdownProps,
  EmptyProps,
  FlexProps,
  FloatButtonProps,
  FormProps,
  ImageProps,
  InputNumberProps,
  InputProps,
  LayoutProps,
  ListProps,
  MenuProps,
  ModalProps,
  PaginationProps,
  PopconfirmProps,
  QRCodeProps,
  RadioProps,
  RateProps,
  ResultProps,
  RowProps,
  SegmentedProps,
  SelectProps,
  SkeletonProps,
  SpinProps,
  SplitterProps,
  StatisticProps,
  StepsProps,
  SwitchProps,
  TableProps,
  TabsProps,
  TagProps,
  TimePickerProps,
  TimelineProps,
  TooltipProps,
  TourProps,
  TransferProps,
  TreeProps,
  TreeSelectProps,
  TypographyProps,
  UploadProps,
  WatermarkProps,
} from 'antd';

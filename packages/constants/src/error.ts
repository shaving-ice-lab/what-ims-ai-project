/**
 * 错误码常量
 */

/** 错误码 */
export const ERROR_CODE = {
  // 通用错误 (1xxxx)
  /** 成功 */
  SUCCESS: 0,
  /** 未知错误 */
  UNKNOWN_ERROR: 10000,
  /** 参数错误 */
  INVALID_PARAMS: 10001,
  /** 资源不存在 */
  NOT_FOUND: 10002,
  /** 操作失败 */
  OPERATION_FAILED: 10003,
  /** 数据重复 */
  DUPLICATE_DATA: 10004,
  /** 数据冲突 */
  DATA_CONFLICT: 10005,

  // 认证错误 (2xxxx)
  /** 未登录 */
  UNAUTHORIZED: 20001,
  /** Token无效 */
  INVALID_TOKEN: 20002,
  /** Token过期 */
  TOKEN_EXPIRED: 20003,
  /** 权限不足 */
  FORBIDDEN: 20004,
  /** 账号被锁定 */
  ACCOUNT_LOCKED: 20005,
  /** 账号被禁用 */
  ACCOUNT_DISABLED: 20006,
  /** 用户名或密码错误 */
  INVALID_CREDENTIALS: 20007,
  /** 验证码错误 */
  INVALID_CAPTCHA: 20008,
  /** 需要选择角色 */
  ROLE_SELECTION_REQUIRED: 20009,

  // 订单错误 (3xxxx)
  /** 订单不存在 */
  ORDER_NOT_FOUND: 30001,
  /** 订单状态不允许操作 */
  ORDER_STATUS_INVALID: 30002,
  /** 未达起送价 */
  MIN_ORDER_NOT_REACHED: 30003,
  /** 商品已下架 */
  PRODUCT_OFFLINE: 30004,
  /** 商品库存不足 */
  INSUFFICIENT_STOCK: 30005,
  /** 购物车为空 */
  CART_EMPTY: 30006,
  /** 取消申请已存在 */
  CANCEL_REQUEST_EXISTS: 30007,
  /** 超过取消时限 */
  CANCEL_TIMEOUT: 30008,

  // 支付错误 (4xxxx)
  /** 支付创建失败 */
  PAYMENT_CREATE_FAILED: 40001,
  /** 支付已过期 */
  PAYMENT_EXPIRED: 40002,
  /** 支付验签失败 */
  PAYMENT_VERIFY_FAILED: 40003,
  /** 退款失败 */
  REFUND_FAILED: 40004,
  /** 重复支付 */
  DUPLICATE_PAYMENT: 40005,

  // 供应商错误 (5xxxx)
  /** 供应商不存在 */
  SUPPLIER_NOT_FOUND: 50001,
  /** 供应商被禁用 */
  SUPPLIER_DISABLED: 50002,
  /** 不在配送区域 */
  NOT_IN_DELIVERY_AREA: 50003,
  /** 不是配送日 */
  NOT_DELIVERY_DAY: 50004,

  // 门店错误 (6xxxx)
  /** 门店不存在 */
  STORE_NOT_FOUND: 60001,
  /** 门店被禁用 */
  STORE_DISABLED: 60002,

  // 物料错误 (7xxxx)
  /** 物料不存在 */
  MATERIAL_NOT_FOUND: 70001,
  /** SKU不存在 */
  SKU_NOT_FOUND: 70002,
  /** 分类不存在 */
  CATEGORY_NOT_FOUND: 70003,
  /** 分类下有子分类 */
  CATEGORY_HAS_CHILDREN: 70004,
  /** 分类下有物料 */
  CATEGORY_HAS_MATERIALS: 70005,

  // 文件错误 (8xxxx)
  /** 文件上传失败 */
  FILE_UPLOAD_FAILED: 80001,
  /** 文件类型不支持 */
  FILE_TYPE_NOT_ALLOWED: 80002,
  /** 文件过大 */
  FILE_TOO_LARGE: 80003,

  // 限流错误 (9xxxx)
  /** 请求过于频繁 */
  RATE_LIMIT_EXCEEDED: 90001,
} as const;

/** 错误消息 */
export const ERROR_MESSAGE: Record<number, string> = {
  [ERROR_CODE.SUCCESS]: '操作成功',
  [ERROR_CODE.UNKNOWN_ERROR]: '未知错误',
  [ERROR_CODE.INVALID_PARAMS]: '参数错误',
  [ERROR_CODE.NOT_FOUND]: '资源不存在',
  [ERROR_CODE.OPERATION_FAILED]: '操作失败',
  [ERROR_CODE.DUPLICATE_DATA]: '数据重复',
  [ERROR_CODE.DATA_CONFLICT]: '数据冲突',

  [ERROR_CODE.UNAUTHORIZED]: '请先登录',
  [ERROR_CODE.INVALID_TOKEN]: '登录凭证无效',
  [ERROR_CODE.TOKEN_EXPIRED]: '登录已过期，请重新登录',
  [ERROR_CODE.FORBIDDEN]: '权限不足',
  [ERROR_CODE.ACCOUNT_LOCKED]: '账号已被锁定，请稍后再试',
  [ERROR_CODE.ACCOUNT_DISABLED]: '账号已被禁用',
  [ERROR_CODE.INVALID_CREDENTIALS]: '用户名或密码错误',
  [ERROR_CODE.INVALID_CAPTCHA]: '验证码错误',
  [ERROR_CODE.ROLE_SELECTION_REQUIRED]: '请选择登录角色',

  [ERROR_CODE.ORDER_NOT_FOUND]: '订单不存在',
  [ERROR_CODE.ORDER_STATUS_INVALID]: '当前订单状态不允许此操作',
  [ERROR_CODE.MIN_ORDER_NOT_REACHED]: '未达到起送价',
  [ERROR_CODE.PRODUCT_OFFLINE]: '商品已下架',
  [ERROR_CODE.INSUFFICIENT_STOCK]: '商品库存不足',
  [ERROR_CODE.CART_EMPTY]: '购物车为空',
  [ERROR_CODE.CANCEL_REQUEST_EXISTS]: '已存在取消申请',
  [ERROR_CODE.CANCEL_TIMEOUT]: '已超过自主取消时限，请联系客服',

  [ERROR_CODE.PAYMENT_CREATE_FAILED]: '创建支付订单失败',
  [ERROR_CODE.PAYMENT_EXPIRED]: '支付已过期，请重新发起',
  [ERROR_CODE.PAYMENT_VERIFY_FAILED]: '支付验证失败',
  [ERROR_CODE.REFUND_FAILED]: '退款失败',
  [ERROR_CODE.DUPLICATE_PAYMENT]: '请勿重复支付',

  [ERROR_CODE.SUPPLIER_NOT_FOUND]: '供应商不存在',
  [ERROR_CODE.SUPPLIER_DISABLED]: '供应商已被禁用',
  [ERROR_CODE.NOT_IN_DELIVERY_AREA]: '不在配送范围内',
  [ERROR_CODE.NOT_DELIVERY_DAY]: '今日不是配送日',

  [ERROR_CODE.STORE_NOT_FOUND]: '门店不存在',
  [ERROR_CODE.STORE_DISABLED]: '门店已被禁用',

  [ERROR_CODE.MATERIAL_NOT_FOUND]: '物料不存在',
  [ERROR_CODE.SKU_NOT_FOUND]: 'SKU不存在',
  [ERROR_CODE.CATEGORY_NOT_FOUND]: '分类不存在',
  [ERROR_CODE.CATEGORY_HAS_CHILDREN]: '该分类下有子分类，无法删除',
  [ERROR_CODE.CATEGORY_HAS_MATERIALS]: '该分类下有物料，无法删除',

  [ERROR_CODE.FILE_UPLOAD_FAILED]: '文件上传失败',
  [ERROR_CODE.FILE_TYPE_NOT_ALLOWED]: '不支持的文件类型',
  [ERROR_CODE.FILE_TOO_LARGE]: '文件过大',

  [ERROR_CODE.RATE_LIMIT_EXCEEDED]: '请求过于频繁，请稍后再试',
};

/** 获取错误消息 */
export function getErrorMessage(code: number): string {
  return ERROR_MESSAGE[code] || ERROR_MESSAGE[ERROR_CODE.UNKNOWN_ERROR];
}

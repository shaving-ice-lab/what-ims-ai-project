import Taro from '@tarojs/taro';

export interface VersionInfo {
  version: string;
  buildNumber: number;
  releaseDate: string;
  forceUpdate: boolean;
  updateUrl: string;
  releaseNotes: string[];
}

// 当前版本信息
export const CURRENT_VERSION = '1.0.0';
export const CURRENT_BUILD_NUMBER = 1;

// 版本比较：返回 1 表示 v1 > v2，-1 表示 v1 < v2，0 表示相等
export const compareVersions = (v1: string, v2: string): number => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
};

// 检查版本更新
export const checkVersion = async (): Promise<VersionInfo | null> => {
  try {
    // 模拟API请求获取最新版本信息
    // 实际项目中应替换为真实的API调用
    const latestVersion: VersionInfo = {
      version: '1.0.1',
      buildNumber: 2,
      releaseDate: '2024-01-30',
      forceUpdate: false,
      updateUrl: 'https://example.com/app/download',
      releaseNotes: ['修复已知问题', '优化用户体验', '新增订单状态推送'],
    };

    // 比较版本
    const needUpdate = compareVersions(latestVersion.version, CURRENT_VERSION) > 0;

    if (needUpdate) {
      return latestVersion;
    }

    return null;
  } catch (error) {
    console.error('检查版本更新失败:', error);
    return null;
  }
};

// 显示更新提示弹窗
export const showUpdateModal = (versionInfo: VersionInfo): void => {
  const { version, forceUpdate, releaseNotes, updateUrl } = versionInfo;

  const content = `发现新版本 v${version}\n\n更新内容：\n${releaseNotes.map((note) => `• ${note}`).join('\n')}`;

  if (forceUpdate) {
    // 强制更新：不显示取消按钮
    Taro.showModal({
      title: '版本更新',
      content,
      showCancel: false,
      confirmText: '立即更新',
      success: () => {
        handleDownloadUpdate(updateUrl);
      },
    });
  } else {
    // 非强制更新：显示取消按钮
    Taro.showModal({
      title: '发现新版本',
      content,
      cancelText: '稍后再说',
      confirmText: '立即更新',
      success: (res) => {
        if (res.confirm) {
          handleDownloadUpdate(updateUrl);
        }
      },
    });
  }
};

// 处理下载更新
const handleDownloadUpdate = (updateUrl: string): void => {
  // 判断平台
  const systemInfo = Taro.getSystemInfoSync();

  if (systemInfo.platform === 'android') {
    // Android：下载APK
    Taro.showLoading({ title: '正在下载...' });

    Taro.downloadFile({
      url: updateUrl,
      success: (res) => {
        Taro.hideLoading();
        if (res.statusCode === 200) {
          // 安装APK（需要原生支持）
          Taro.showToast({ title: '下载完成，请安装', icon: 'success' });
          // 实际项目中需要调用原生插件安装APK
        }
      },
      fail: () => {
        Taro.hideLoading();
        Taro.showToast({ title: '下载失败，请重试', icon: 'none' });
      },
    });
  } else if (systemInfo.platform === 'ios') {
    // iOS：跳转App Store
    Taro.showToast({ title: '请前往App Store更新', icon: 'none' });
    // 可以使用原生插件打开App Store链接
  } else {
    // 其他平台：打开浏览器
    Taro.setClipboardData({
      data: updateUrl,
      success: () => {
        Taro.showToast({ title: '下载链接已复制', icon: 'success' });
      },
    });
  }
};

// 初始化版本检查（在App启动时调用）
export const initVersionCheck = async (): Promise<void> => {
  const versionInfo = await checkVersion();
  if (versionInfo) {
    showUpdateModal(versionInfo);
  }
};

// 获取当前版本显示文本
export const getVersionText = (): string => {
  return `v${CURRENT_VERSION} (Build ${CURRENT_BUILD_NUMBER})`;
};

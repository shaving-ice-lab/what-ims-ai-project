import { useEffect, useState } from 'react';

import { Button, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import { checkVersion, CURRENT_VERSION, VersionInfo } from '../../services/version';

import './index.scss';

interface UpdateModalProps {
  onClose?: () => void;
}

export default function UpdateModal({ onClose }: UpdateModalProps) {
  const [visible, setVisible] = useState(false);
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    checkForUpdate();
  }, []);

  const checkForUpdate = async () => {
    const info = await checkVersion();
    if (info) {
      setVersionInfo(info);
      setVisible(true);
    }
  };

  const handleClose = () => {
    if (versionInfo?.forceUpdate) {
      Taro.showToast({ title: '此版本必须更新', icon: 'none' });
      return;
    }
    setVisible(false);
    onClose?.();
  };

  const handleUpdate = async () => {
    if (!versionInfo) return;

    setDownloading(true);

    const systemInfo = Taro.getSystemInfoSync();

    if (systemInfo.platform === 'android') {
      Taro.showLoading({ title: '正在下载...' });

      Taro.downloadFile({
        url: versionInfo.updateUrl,
        success: (res) => {
          Taro.hideLoading();
          setDownloading(false);
          if (res.statusCode === 200) {
            Taro.showToast({ title: '下载完成', icon: 'success' });
          }
        },
        fail: () => {
          Taro.hideLoading();
          setDownloading(false);
          Taro.showToast({ title: '下载失败', icon: 'none' });
        },
      });
    } else {
      setDownloading(false);
      Taro.setClipboardData({
        data: versionInfo.updateUrl,
        success: () => {
          Taro.showToast({ title: '下载链接已复制', icon: 'success' });
        },
      });
    }
  };

  if (!visible || !versionInfo) return null;

  return (
    <View className="update-modal-overlay">
      <View className="update-modal">
        <View className="modal-header">
          <Text className="modal-title">🎉 发现新版本</Text>
          <Text className="version-tag">v{versionInfo.version}</Text>
        </View>

        <View className="modal-body">
          <View className="version-compare">
            <Text className="current-version">当前版本：v{CURRENT_VERSION}</Text>
            <Text className="arrow">→</Text>
            <Text className="new-version">最新版本：v{versionInfo.version}</Text>
          </View>

          <View className="release-notes">
            <Text className="notes-title">更新内容：</Text>
            {versionInfo.releaseNotes.map((note, index) => (
              <View key={index} className="note-item">
                <Text className="note-bullet">•</Text>
                <Text className="note-text">{note}</Text>
              </View>
            ))}
          </View>

          {versionInfo.forceUpdate && (
            <View className="force-update-tip">
              <Text>⚠️ 此版本为强制更新，请立即更新以继续使用</Text>
            </View>
          )}
        </View>

        <View className="modal-footer">
          {!versionInfo.forceUpdate && (
            <Button className="btn-cancel" onClick={handleClose}>
              稍后再说
            </Button>
          )}
          <Button
            className={`btn-update ${versionInfo.forceUpdate ? 'full' : ''}`}
            onClick={handleUpdate}
            loading={downloading}
            disabled={downloading}
          >
            {downloading ? '下载中...' : '立即更新'}
          </Button>
        </View>
      </View>
    </View>
  );
}

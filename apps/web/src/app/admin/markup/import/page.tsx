'use client';

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  message,
  Progress,
  Result,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

interface ImportPreviewItem {
  key: string;
  rowNum: number;
  name: string;
  storeName: string | null;
  supplierName: string | null;
  materialName: string | null;
  markupType: string;
  markupValue: number;
  status: 'valid' | 'error' | 'warning';
  errorMsg: string | null;
}

type ImportStep = 'upload' | 'preview' | 'importing' | 'result';

export default function MarkupImportPage() {
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewData, setPreviewData] = useState<ImportPreviewItem[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
    total: number;
  } | null>(null);

  // 模拟预览数据
  const mockPreviewData: ImportPreviewItem[] = [
    {
      key: '1',
      rowNum: 2,
      name: '默认加价规则',
      storeName: null,
      supplierName: null,
      materialName: null,
      markupType: '百分比',
      markupValue: 3,
      status: 'valid',
      errorMsg: null,
    },
    {
      key: '2',
      rowNum: 3,
      name: '生鲜供应商A固定加价',
      storeName: null,
      supplierName: '生鲜供应商A',
      materialName: null,
      markupType: '固定金额',
      markupValue: 2,
      status: 'valid',
      errorMsg: null,
    },
    {
      key: '3',
      rowNum: 4,
      name: '门店A专属规则',
      storeName: '门店A - 朝阳店',
      supplierName: null,
      materialName: null,
      markupType: '百分比',
      markupValue: 2.5,
      status: 'warning',
      errorMsg: '已存在同名规则，将更新',
    },
    {
      key: '4',
      rowNum: 5,
      name: '无效规则',
      storeName: '不存在的门店',
      supplierName: null,
      materialName: null,
      markupType: '百分比',
      markupValue: -1,
      status: 'error',
      errorMsg: '门店不存在；加价值不能为负数',
    },
  ];

  // 下载模板
  const handleDownloadTemplate = () => {
    message.success('模板下载中...');
    // 实际应调用API下载模板文件
  };

  // 文件上传变化
  const handleUploadChange = (info: { fileList: UploadFile[] }) => {
    setFileList(info.fileList);
    if (info.fileList.length > 0 && info.fileList[0]?.status === 'done') {
      // 模拟解析文件
      setPreviewData(mockPreviewData);
      setCurrentStep('preview');
    }
  };

  // 确认导入
  const handleConfirmImport = async () => {
    const validItems = previewData.filter((item) => item.status !== 'error');
    if (validItems.length === 0) {
      message.error('没有可导入的有效数据');
      return;
    }

    setCurrentStep('importing');

    // 模拟导入进度
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setImportProgress(i);
    }

    // 模拟导入结果
    setImportResult({
      success: validItems.length,
      failed: previewData.length - validItems.length,
      total: previewData.length,
    });
    setCurrentStep('result');
  };

  // 重新导入
  const handleReset = () => {
    setCurrentStep('upload');
    setFileList([]);
    setPreviewData([]);
    setImportProgress(0);
    setImportResult(null);
  };

  // 预览表格列
  const previewColumns: ColumnsType<ImportPreviewItem> = [
    {
      title: '行号',
      dataIndex: 'rowNum',
      key: 'rowNum',
      width: 60,
    },
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '门店',
      dataIndex: 'storeName',
      key: 'storeName',
      render: (name: string | null) => name || <Tag>全部</Tag>,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      render: (name: string | null) => name || <Tag>全部</Tag>,
    },
    {
      title: '物料',
      dataIndex: 'materialName',
      key: 'materialName',
      render: (name: string | null) => name || <Tag>全部</Tag>,
    },
    {
      title: '加价方式',
      dataIndex: 'markupType',
      key: 'markupType',
    },
    {
      title: '加价值',
      dataIndex: 'markupValue',
      key: 'markupValue',
    },
    {
      title: '校验结果',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record) => {
        if (status === 'valid') {
          return (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              有效
            </Tag>
          );
        }
        if (status === 'warning') {
          return (
            <Space direction="vertical" size={0}>
              <Tag color="warning" icon={<ExclamationCircleOutlined />}>
                警告
              </Tag>
              <Text type="warning" style={{ fontSize: 12 }}>
                {record.errorMsg}
              </Text>
            </Space>
          );
        }
        return (
          <Space direction="vertical" size={0}>
            <Tag color="error" icon={<CloseCircleOutlined />}>
              错误
            </Tag>
            <Text type="danger" style={{ fontSize: 12 }}>
              {record.errorMsg}
            </Text>
          </Space>
        );
      },
    },
  ];

  // 统计信息
  const validCount = previewData.filter((item) => item.status === 'valid').length;
  const warningCount = previewData.filter((item) => item.status === 'warning').length;
  const errorCount = previewData.filter((item) => item.status === 'error').length;

  return (
    <AdminLayout>
      <div>
        <Title level={3}>批量导入加价规则</Title>
        <Paragraph type="secondary">
          通过Excel文件批量导入加价规则，请先下载模板并按格式填写
        </Paragraph>

        {/* 步骤1: 上传文件 */}
        {currentStep === 'upload' && (
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>
                下载导入模板
              </Button>

              <Dragger
                name="file"
                accept=".xlsx,.xls"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
                maxCount={1}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">支持 .xlsx、.xls 格式的Excel文件</p>
              </Dragger>

              <Alert
                message="导入说明"
                description={
                  <ul style={{ paddingLeft: 20, margin: 0 }}>
                    <li>请按照模板格式填写数据</li>
                    <li>门店、供应商、物料列留空表示对全部生效</li>
                    <li>加价方式可填写"固定金额"或"百分比"</li>
                    <li>同名规则将被更新</li>
                  </ul>
                }
                type="info"
              />
            </Space>
          </Card>
        )}

        {/* 步骤2: 预览数据 */}
        {currentStep === 'preview' && (
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Alert
                message={
                  <Space>
                    <span>数据校验结果：</span>
                    <Tag color="success">有效 {validCount}</Tag>
                    <Tag color="warning">警告 {warningCount}</Tag>
                    <Tag color="error">错误 {errorCount}</Tag>
                  </Space>
                }
                type={errorCount > 0 ? 'warning' : 'success'}
              />

              <Table
                dataSource={previewData}
                columns={previewColumns}
                pagination={false}
                size="small"
                scroll={{ x: 900 }}
              />

              <Space>
                <Button onClick={handleReset}>重新上传</Button>
                <Button
                  type="primary"
                  onClick={handleConfirmImport}
                  disabled={validCount + warningCount === 0}
                >
                  确认导入 ({validCount + warningCount} 条)
                </Button>
              </Space>
            </Space>
          </Card>
        )}

        {/* 步骤3: 导入中 */}
        {currentStep === 'importing' && (
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Progress type="circle" percent={importProgress} />
              <div style={{ marginTop: 24 }}>
                <Text>正在导入数据，请稍候...</Text>
              </div>
            </div>
          </Card>
        )}

        {/* 步骤4: 导入结果 */}
        {currentStep === 'result' && importResult && (
          <Card>
            <Result
              status={importResult.failed > 0 ? 'warning' : 'success'}
              title="导入完成"
              subTitle={
                <Space direction="vertical">
                  <Text>共处理 {importResult.total} 条数据</Text>
                  <Text type="success">成功导入 {importResult.success} 条</Text>
                  {importResult.failed > 0 && (
                    <Text type="danger">失败 {importResult.failed} 条</Text>
                  )}
                </Space>
              }
              extra={[
                <Button key="again" onClick={handleReset}>
                  继续导入
                </Button>,
                <Button
                  key="list"
                  type="primary"
                  onClick={() => (window.location.href = '/admin/markup/rules')}
                >
                  查看规则列表
                </Button>,
              ]}
            />
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

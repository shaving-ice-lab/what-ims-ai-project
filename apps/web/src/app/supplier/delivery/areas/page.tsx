"use client";

import { SupplierLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { showToast } from "@/lib/toast";
import { Info, Plus, Save, Trash2 } from "lucide-react";
import * as React from "react";

interface AreaItem {
  id: number;
  province: string;
  city: string;
  district: string;
}

interface AreaOption {
  value: string;
  label: string;
  children?: AreaOption[];
}

export default function DeliveryAreasPage() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedDistricts, setSelectedDistricts] = React.useState<string[]>([]);

  const [areasData, setAreasData] = React.useState<AreaItem[]>([
    { id: 1, province: "北京市", city: "北京市", district: "朝阳区" },
    { id: 2, province: "北京市", city: "北京市", district: "海淀区" },
    { id: 3, province: "北京市", city: "北京市", district: "西城区" },
    { id: 4, province: "北京市", city: "北京市", district: "东城区" },
  ]);

  const areaOptions: AreaOption[] = [
    {
      value: "北京市",
      label: "北京市",
      children: [
        {
          value: "北京市",
          label: "北京市",
          children: [
            { value: "朝阳区", label: "朝阳区" },
            { value: "海淀区", label: "海淀区" },
            { value: "西城区", label: "西城区" },
            { value: "东城区", label: "东城区" },
            { value: "丰台区", label: "丰台区" },
            { value: "通州区", label: "通州区" },
          ],
        },
      ],
    },
    {
      value: "上海市",
      label: "上海市",
      children: [
        {
          value: "上海市",
          label: "上海市",
          children: [
            { value: "浦东新区", label: "浦东新区" },
            { value: "黄浦区", label: "黄浦区" },
            { value: "徐汇区", label: "徐汇区" },
          ],
        },
      ],
    },
  ];

  const getCityOptions = () => {
    const province = areaOptions.find((p) => p.value === selectedProvince);
    return province?.children || [];
  };

  const getDistrictOptions = () => {
    const city = getCityOptions().find((c) => c.value === selectedCity);
    return city?.children || [];
  };

  const handleDelete = (id: number) => {
    setAreasData((prev) => prev.filter((item) => item.id !== id));
    showToast.success("配送区域已删除");
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleAddAreas = () => {
    if (!selectedProvince || !selectedCity || selectedDistricts.length === 0) {
      showToast.warning("请选择完整的配送区域");
      return;
    }

    const existingKeys = areasData.map(
      (a) => `${a.province}-${a.city}-${a.district}`
    );
    const newAreas: AreaItem[] = selectedDistricts
      .filter(
        (district) =>
          !existingKeys.includes(`${selectedProvince}-${selectedCity}-${district}`)
      )
      .map((district, index) => ({
        id: Date.now() + index,
        province: selectedProvince,
        city: selectedCity,
        district,
      }));

    if (newAreas.length === 0) {
      showToast.warning("所选区域已存在");
      return;
    }

    setAreasData((prev) => [...prev, ...newAreas]);
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedDistricts([]);
    setModalVisible(false);
    showToast.success(`已添加 ${newAreas.length} 个配送区域`);
  };

  const handleSubmit = () => {
    showToast.success("配送区域设置已提交审核");
  };

  return (
    <SupplierLayout>
      <WorkbenchShell
        badge="配送区域"
        title="配送区域管理"
        description="设置您的配送范围，门店所在区域需在您的配送范围内才能下单"
        actions={
          <>
            <Button onClick={() => setModalVisible(true)}>
              <Plus className="mr-2 h-4 w-4" />
              添加区域
            </Button>
            <Button variant="outline" onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              提交审核
            </Button>
          </>
        }
        results={
          <div className="space-y-6 animate-fade-in">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>区域匹配说明</AlertTitle>
              <AlertDescription>
                系统会根据门店的收货地址自动匹配配送区域，请确保覆盖您服务的所有区域
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">
                  配送区域列表 ({areasData.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>省份</TableHead>
                        <TableHead>城市</TableHead>
                        <TableHead>区/县</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="w-[80px]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {areasData.map((area) => (
                        <TableRow key={area.id}>
                          <TableCell>{area.province}</TableCell>
                          <TableCell>{area.city}</TableCell>
                          <TableCell>{area.district}</TableCell>
                          <TableCell>
                            <Badge variant="success">已生效</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => {
                                setDeleteId(area.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-1 h-4 w-4" />
                              删除
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        }
      >

        {/* Add Area Dialog */}
        <Dialog open={modalVisible} onOpenChange={setModalVisible}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加配送区域</DialogTitle>
              <DialogDescription>
                选择要添加的配送区域
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">省份</label>
                <Select
                  value={selectedProvince}
                  onValueChange={(v) => {
                    setSelectedProvince(v);
                    setSelectedCity("");
                    setSelectedDistricts([]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择省份" />
                  </SelectTrigger>
                  <SelectContent>
                    {areaOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">城市</label>
                <Select
                  value={selectedCity}
                  onValueChange={(v) => {
                    setSelectedCity(v);
                    setSelectedDistricts([]);
                  }}
                  disabled={!selectedProvince}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择城市" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCityOptions().map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">区/县（点击选择多个）</label>
                <div className="flex flex-wrap gap-2">
                  {getDistrictOptions().map((opt) => (
                    <Badge
                      key={opt.value}
                      variant={
                        selectedDistricts.includes(opt.value)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedDistricts((prev) =>
                          prev.includes(opt.value)
                            ? prev.filter((d) => d !== opt.value)
                            : [...prev, opt.value]
                        );
                      }}
                    >
                      {opt.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button onClick={handleAddAreas}>添加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>删除配送区域</AlertDialogTitle>
              <AlertDialogDescription>
                确定要删除此配送区域吗？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </WorkbenchShell>
    </SupplierLayout>
  );
}

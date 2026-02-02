"use client";

/**
 * AreaSelect - 配送区域选择组件
 * 省市区三级联动，支持多选、数据懒加载、已选区域列表展示
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MapPin, Plus, Trash2, X } from "lucide-react";
import * as React from "react";

export interface AreaNode {
  /** 区域编码或名称 */
  value: string;
  /** 区域标签 */
  label: string;
  /** 是否叶子节点 */
  isLeaf?: boolean;
  /** 子区域 */
  children?: AreaNode[];
}

export interface SelectedArea {
  /** 省 */
  province: string;
  /** 省标签 */
  provinceLabel: string;
  /** 市 */
  city?: string;
  /** 市标签 */
  cityLabel?: string;
  /** 区 */
  district?: string;
  /** 区标签 */
  districtLabel?: string;
}

export interface AreaSelectProps {
  /** 区域数据（完整树结构） */
  areaData?: AreaNode[];
  /** 懒加载区域数据的函数 */
  loadAreaData?: (selectedOptions: AreaNode[]) => Promise<AreaNode[]>;
  /** 选中的区域列表 */
  value?: SelectedArea[];
  /** 选中变化回调 */
  onChange?: (value: SelectedArea[]) => void;
  /** 是否支持多选 */
  multiple?: boolean;
  /** 最大选择数量 */
  maxCount?: number;
  /** 是否允许选择非叶子节点（省/市级） */
  allowNonLeaf?: boolean;
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示已选区域列表 */
  showSelectedList?: boolean;
}

const AreaSelect: React.FC<AreaSelectProps> = ({
  areaData: propAreaData = [],
  loadAreaData,
  value = [],
  onChange,
  multiple = true,
  maxCount,
  allowNonLeaf = true,
  placeholder: _placeholder = "选择配送区域",
  disabled = false,
  showSelectedList = true,
}) => {
  const [areaData, setAreaData] = React.useState<AreaNode[]>(propAreaData);
  const [selectedAreas, setSelectedAreas] = React.useState<SelectedArea[]>(value);
  const [selectedProvince, setSelectedProvince] = React.useState<string>("");
  const [selectedCity, setSelectedCity] = React.useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>("");

  // Use props data
  React.useEffect(() => {
    if (propAreaData.length > 0) {
      setAreaData(propAreaData);
    }
  }, [propAreaData]);

  // Sync external value
  React.useEffect(() => {
    setSelectedAreas(value);
  }, [value]);

  // Get cities for selected province
  const cities = React.useMemo(() => {
    const province = areaData.find((p) => p.value === selectedProvince);
    return province?.children || [];
  }, [areaData, selectedProvince]);

  // Get districts for selected city
  const districts = React.useMemo(() => {
    const province = areaData.find((p) => p.value === selectedProvince);
    const city = province?.children?.find((c) => c.value === selectedCity);
    return city?.children || [];
  }, [areaData, selectedProvince, selectedCity]);

  // Handle province change
  const handleProvinceChange = async (value: string) => {
    setSelectedProvince(value);
    setSelectedCity("");
    setSelectedDistrict("");

    // Load cities if using lazy loading
    if (loadAreaData) {
      const province = areaData.find((p) => p.value === value);
      if (province && !province.children) {
        try {
          const children = await loadAreaData([province]);
          province.children = children;
          setAreaData([...areaData]);
        } catch (error) {
          console.error("Failed to load cities:", error);
        }
      }
    }
  };

  // Handle city change
  const handleCityChange = async (value: string) => {
    setSelectedCity(value);
    setSelectedDistrict("");

    // Load districts if using lazy loading
    if (loadAreaData) {
      const province = areaData.find((p) => p.value === selectedProvince);
      const city = province?.children?.find((c) => c.value === value);
      if (city && !city.children) {
        try {
          const children = await loadAreaData([province!, city]);
          city.children = children;
          setAreaData([...areaData]);
        } catch (error) {
          console.error("Failed to load districts:", error);
        }
      }
    }
  };

  // Add area
  const handleAddArea = () => {
    if (!selectedProvince) return;

    const province = areaData.find((p) => p.value === selectedProvince);
    if (!province) return;

    const newArea: SelectedArea = {
      province: selectedProvince,
      provinceLabel: province.label,
    };

    if (selectedCity) {
      const city = province.children?.find((c) => c.value === selectedCity);
      if (city) {
        newArea.city = selectedCity;
        newArea.cityLabel = city.label;

        if (selectedDistrict) {
          const district = city.children?.find((d) => d.value === selectedDistrict);
          if (district) {
            newArea.district = selectedDistrict;
            newArea.districtLabel = district.label;
          }
        }
      }
    }

    // Check if already exists
    const exists = selectedAreas.some(
      (area) =>
        area.province === newArea.province &&
        area.city === newArea.city &&
        area.district === newArea.district
    );

    if (exists) return;

    // Check max count
    if (maxCount && selectedAreas.length >= maxCount) return;

    let newSelectedAreas: SelectedArea[];
    if (multiple) {
      newSelectedAreas = [...selectedAreas, newArea];
    } else {
      newSelectedAreas = [newArea];
    }

    setSelectedAreas(newSelectedAreas);
    onChange?.(newSelectedAreas);

    // Reset selection
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedDistrict("");
  };

  // Remove area
  const handleRemoveArea = (index: number) => {
    const newSelectedAreas = selectedAreas.filter((_, i) => i !== index);
    setSelectedAreas(newSelectedAreas);
    onChange?.(newSelectedAreas);
  };

  // Clear all
  const handleClearAll = () => {
    setSelectedAreas([]);
    onChange?.([]);
  };

  // Format area text
  const formatAreaText = (area: SelectedArea): string => {
    const parts = [area.provinceLabel];
    if (area.cityLabel) parts.push(area.cityLabel);
    if (area.districtLabel) parts.push(area.districtLabel);
    return parts.join(" / ");
  };

  const isMaxReached = maxCount !== undefined && selectedAreas.length >= maxCount;

  return (
    <div className="space-y-3">
      {/* Selectors */}
      <div className="flex flex-wrap gap-2">
        <Select
          value={selectedProvince}
          onValueChange={handleProvinceChange}
          disabled={disabled || isMaxReached}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="选择省份" />
          </SelectTrigger>
          <SelectContent>
            {areaData.map((province) => (
              <SelectItem key={province.value} value={province.value}>
                {province.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedCity}
          onValueChange={handleCityChange}
          disabled={disabled || !selectedProvince || isMaxReached}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="选择城市" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedDistrict}
          onValueChange={setSelectedDistrict}
          disabled={disabled || !selectedCity || isMaxReached}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="选择区县" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((district) => (
              <SelectItem key={district.value} value={district.value}>
                {district.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {multiple && (
          <Button
            onClick={handleAddArea}
            disabled={
              disabled ||
              !selectedProvince ||
              (!allowNonLeaf && !selectedDistrict) ||
              isMaxReached
            }
          >
            <Plus className="mr-1 h-4 w-4" />
            添加
          </Button>
        )}
      </div>

      {/* Selected Areas List */}
      {showSelectedList && selectedAreas.length > 0 && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              已选区域 ({selectedAreas.length}
              {maxCount ? `/${maxCount}` : ""})
            </span>
            {selectedAreas.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-[hsl(var(--error))] h-auto py-1"
                onClick={handleClearAll}
              >
                <Trash2 className="mr-1 h-3 w-3" />
                清空全部
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedAreas.map((area, index) => (
              <Badge
                key={`${area.province}-${area.city || ""}-${area.district || ""}`}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                {formatAreaText(area)}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                  onClick={() => handleRemoveArea(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaSelect;

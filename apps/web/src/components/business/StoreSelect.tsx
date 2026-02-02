"use client";

/**
 * StoreSelect - 门店选择组件
 * 支持按区域筛选、搜索
 */

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Loader2, MapPin, Search, Store } from "lucide-react";
import * as React from "react";

export interface StoreOption {
  id: number;
  name: string;
  storeNo?: string;
  province?: string;
  city?: string;
  district?: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  status: number;
}

export interface AreaOption {
  value: string;
  label: string;
  children?: AreaOption[];
}

export interface StoreSelectProps {
  stores?: StoreOption[];
  fetchStores?: (params?: {
    keyword?: string;
    province?: string;
    city?: string;
    district?: string;
  }) => Promise<StoreOption[]>;
  areaOptions?: AreaOption[];
  value?: number | number[];
  onChange?: (value: number | number[] | undefined) => void;
  multiple?: boolean;
  showAreaFilter?: boolean;
  showStatus?: boolean;
  onlyActive?: boolean;
  showAddress?: boolean;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const StoreSelect: React.FC<StoreSelectProps> = ({
  stores: propStores = [],
  fetchStores,
  areaOptions,
  value,
  onChange,
  multiple = false,
  showAreaFilter = false,
  showStatus = true,
  onlyActive = true,
  showAddress = false,
  placeholder = "请选择门店",
  loading: propLoading,
  disabled,
  className,
}) => {
  const [stores, setStores] = React.useState<StoreOption[]>(propStores);
  const [loading, setLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [selectedArea, setSelectedArea] = React.useState<string[]>([]);

  // Load stores
  const loadStores = React.useCallback(
    async (params?: { keyword?: string; province?: string; city?: string; district?: string }) => {
      if (fetchStores) {
        setLoading(true);
        try {
          const data = await fetchStores(params);
          setStores(data);
        } catch (error) {
          console.error("加载门店数据失败:", error);
        } finally {
          setLoading(false);
        }
      }
    },
    [fetchStores]
  );

  // Initial load
  React.useEffect(() => {
    if (fetchStores && stores.length === 0) {
      loadStores();
    }
  }, [fetchStores, stores.length, loadStores]);

  // Sync props
  React.useEffect(() => {
    if (propStores.length > 0) {
      setStores(propStores);
    }
  }, [propStores]);

  // Filter stores
  const filteredStores = stores.filter((store) => {
    if (onlyActive && store.status !== 1) return false;
    if (selectedArea.length > 0 && !fetchStores) {
      const [province, city, district] = selectedArea;
      if (province && store.province !== province) return false;
      if (city && store.city !== city) return false;
      if (district && store.district !== district) return false;
    }
    if (!fetchStores && searchValue) {
      const keyword = searchValue.toLowerCase();
      return (
        store.name.toLowerCase().includes(keyword) ||
        store.storeNo?.toLowerCase().includes(keyword) ||
        store.address?.toLowerCase().includes(keyword)
      );
    }
    return true;
  });

  // Handle single select
  const handleSingleSelect = (storeId: string) => {
    onChange?.(parseInt(storeId));
    setOpen(false);
  };

  // Handle multi select toggle
  const handleMultiSelectToggle = (storeId: number) => {
    const currentValues = (value as number[]) || [];
    const newValues = currentValues.includes(storeId)
      ? currentValues.filter((id) => id !== storeId)
      : [...currentValues, storeId];
    onChange?.(newValues);
  };

  // Get display label
  const getDisplayLabel = () => {
    if (!value) return placeholder;
    if (multiple) {
      const selectedCount = (value as number[])?.length || 0;
      if (selectedCount === 0) return placeholder;
      return `已选择 ${selectedCount} 家门店`;
    }
    const store = stores.find((s) => s.id === value);
    return store?.name || placeholder;
  };

  // Single select mode
  if (!multiple) {
    return (
      <div className={cn("space-y-2", className)}>
        {showAreaFilter && areaOptions && (
          <Select
            value={selectedArea[0]}
            onValueChange={(v) => {
              setSelectedArea([v]);
              if (fetchStores) {
                loadStores({ keyword: searchValue, province: v });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择区域筛选" />
            </SelectTrigger>
            <SelectContent>
              {areaOptions.map((area) => (
                <SelectItem key={area.value} value={area.value}>
                  {area.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select
          value={value?.toString()}
          onValueChange={handleSingleSelect}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {filteredStores.map((store) => (
              <SelectItem
                key={store.id}
                value={store.id.toString()}
                disabled={onlyActive && store.status !== 1}
              >
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span>{store.name}</span>
                  {store.storeNo && (
                    <span className="text-xs text-muted-foreground">
                      ({store.storeNo})
                    </span>
                  )}
                  {showStatus && store.status !== 1 && (
                    <Badge variant="error" className="ml-1">
                      已禁用
                    </Badge>
                  )}
                </div>
                {showAddress && store.address && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {store.province}
                    {store.city}
                    {store.district} {store.address}
                  </div>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Multiple select mode
  return (
    <div className={cn("space-y-2", className)}>
      {showAreaFilter && areaOptions && (
        <Select
          value={selectedArea[0]}
          onValueChange={(v) => {
            setSelectedArea([v]);
            if (fetchStores) {
              loadStores({ keyword: searchValue, province: v });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择区域筛选" />
          </SelectTrigger>
          <SelectContent>
            {areaOptions.map((area) => (
              <SelectItem key={area.value} value={area.value}>
                {area.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="relative">
        <div
          className={cn(
            "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onClick={() => !disabled && setOpen(!open)}
        >
          <span className={!value || (value as number[]).length === 0 ? "text-muted-foreground" : ""}>
            {getDisplayLabel()}
          </span>
          {(propLoading || loading) && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
        </div>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索门店..."
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    if (fetchStores) {
                      const [province, city, district] = selectedArea;
                      loadStores({
                        keyword: e.target.value,
                        province,
                        city,
                        district,
                      });
                    }
                  }}
                  className="pl-8"
                />
              </div>
            </div>
            <ScrollArea className="max-h-[200px]">
              {filteredStores.map((store) => {
                const isSelected = (value as number[])?.includes(store.id);
                return (
                  <div
                    key={store.id}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent",
                      isSelected && "bg-accent"
                    )}
                    onClick={() => handleMultiSelectToggle(store.id)}
                  >
                    <Checkbox checked={isSelected} />
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <span>{store.name}</span>
                        {store.storeNo && (
                          <span className="text-xs text-muted-foreground">
                            ({store.storeNo})
                          </span>
                        )}
                        {showStatus && store.status !== 1 && (
                          <Badge variant="error">已禁用</Badge>
                        )}
                      </div>
                      {showAddress && store.address && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {store.address}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreSelect;

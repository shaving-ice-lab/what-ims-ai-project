"use client";

/**
 * MaterialSelect - 物料选择组件
 * 弹窗选择器，支持分类树筛选、物料搜索、已选物料列表、多选
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Folder, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";

export interface MaterialOption {
  id: number;
  name: string;
  materialNo?: string;
  categoryId?: number;
  categoryName?: string;
  brand?: string;
  spec?: string;
  unit?: string;
  imageUrl?: string;
  status: number;
}

export interface CategoryTreeNode {
  id: number;
  name: string;
  children?: CategoryTreeNode[];
}

export interface MaterialSelectProps {
  materials?: MaterialOption[];
  fetchMaterials?: (params?: {
    keyword?: string;
    categoryId?: number;
  }) => Promise<MaterialOption[]>;
  categoryTree?: CategoryTreeNode[];
  fetchCategories?: () => Promise<CategoryTreeNode[]>;
  value?: number[];
  onChange?: (value: number[], selectedMaterials: MaterialOption[]) => void;
  multiple?: boolean;
  maxCount?: number;
  triggerText?: string;
  modalTitle?: string;
  disabled?: boolean;
  onlyActive?: boolean;
}

const MaterialSelect: React.FC<MaterialSelectProps> = ({
  materials: propMaterials = [],
  fetchMaterials,
  categoryTree: propCategoryTree = [],
  fetchCategories,
  value = [],
  onChange,
  multiple = true,
  maxCount,
  triggerText = "选择物料",
  modalTitle = "选择物料",
  disabled = false,
  onlyActive = true,
}) => {
  const [open, setOpen] = React.useState(false);
  const [materials, setMaterials] = React.useState<MaterialOption[]>(propMaterials);
  const [categoryTree, setCategoryTree] = React.useState<CategoryTreeNode[]>(propCategoryTree);
  const [loading, setLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | undefined>();
  const [selectedIds, setSelectedIds] = React.useState<number[]>(value);
  const [selectedMaterials, setSelectedMaterials] = React.useState<MaterialOption[]>([]);

  // Load materials
  const loadMaterials = React.useCallback(
    async (params?: { keyword?: string; categoryId?: number }) => {
      if (fetchMaterials) {
        setLoading(true);
        try {
          const data = await fetchMaterials(params);
          setMaterials(data);
        } catch (error) {
          console.error("加载物料数据失败:", error);
        } finally {
          setLoading(false);
        }
      }
    },
    [fetchMaterials]
  );

  // Load categories
  const loadCategories = React.useCallback(async () => {
    if (fetchCategories) {
      try {
        const data = await fetchCategories();
        setCategoryTree(data);
      } catch (error) {
        console.error("加载分类数据失败:", error);
      }
    }
  }, [fetchCategories]);

  // Initialize on open
  React.useEffect(() => {
    if (open) {
      if (fetchMaterials && materials.length === 0) {
        loadMaterials();
      }
      if (fetchCategories && categoryTree.length === 0) {
        loadCategories();
      }
      setSelectedIds(value);
      const selected = materials.filter((m) => value.includes(m.id));
      setSelectedMaterials(selected);
    }
  }, [open, value, fetchMaterials, fetchCategories, materials, categoryTree, loadMaterials, loadCategories]);

  // Sync props
  React.useEffect(() => {
    if (propMaterials.length > 0) setMaterials(propMaterials);
  }, [propMaterials]);

  React.useEffect(() => {
    if (propCategoryTree.length > 0) setCategoryTree(propCategoryTree);
  }, [propCategoryTree]);

  // Filter materials
  const filteredMaterials = materials.filter((material) => {
    if (onlyActive && material.status !== 1) return false;
    if (!fetchMaterials) {
      if (searchValue) {
        const keyword = searchValue.toLowerCase();
        const matches =
          material.name.toLowerCase().includes(keyword) ||
          material.materialNo?.toLowerCase().includes(keyword);
        if (!matches) return false;
      }
      if (selectedCategoryId && material.categoryId !== selectedCategoryId) {
        return false;
      }
    }
    return true;
  });

  // Select/deselect material
  const handleSelectMaterial = (material: MaterialOption) => {
    let newSelectedIds: number[];
    let newSelectedMaterials: MaterialOption[];

    if (selectedIds.includes(material.id)) {
      newSelectedIds = selectedIds.filter((id) => id !== material.id);
      newSelectedMaterials = selectedMaterials.filter((m) => m.id !== material.id);
    } else {
      if (!multiple) {
        newSelectedIds = [material.id];
        newSelectedMaterials = [material];
      } else if (maxCount && selectedIds.length >= maxCount) {
        return;
      } else {
        newSelectedIds = [...selectedIds, material.id];
        newSelectedMaterials = [...selectedMaterials, material];
      }
    }

    setSelectedIds(newSelectedIds);
    setSelectedMaterials(newSelectedMaterials);
  };

  // Remove material
  const handleRemoveMaterial = (materialId: number) => {
    setSelectedIds(selectedIds.filter((id) => id !== materialId));
    setSelectedMaterials(selectedMaterials.filter((m) => m.id !== materialId));
  };

  // Confirm
  const handleConfirm = () => {
    onChange?.(selectedIds, selectedMaterials);
    setOpen(false);
  };

  // Cancel
  const handleCancel = () => {
    setSelectedIds(value);
    setSelectedMaterials(materials.filter((m) => value.includes(m.id)));
    setOpen(false);
  };

  // Render category tree
  const renderCategoryTree = (nodes: CategoryTreeNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id}>
        <button
          type="button"
          className={cn(
            "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent",
            selectedCategoryId === node.id && "bg-accent"
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => {
            setSelectedCategoryId(node.id);
            if (fetchMaterials) {
              loadMaterials({ keyword: searchValue, categoryId: node.id });
            }
          }}
        >
          <Folder className="h-3 w-3 inline mr-1" />
          {node.name}
        </button>
        {node.children && renderCategoryTree(node.children, level + 1)}
      </div>
    ));
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} disabled={disabled}>
        <Plus className="mr-2 h-4 w-4" />
        {triggerText}
        {value.length > 0 && (
          <Badge variant="secondary" className="ml-2">
            {value.length}
          </Badge>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
            {/* Category Tree */}
            <div className="col-span-3 border-r pr-4">
              <p className="text-sm font-medium mb-2">物料分类</p>
              <ScrollArea className="h-[440px]">
                {categoryTree.length > 0 ? (
                  renderCategoryTree(categoryTree)
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    暂无分类
                  </p>
                )}
              </ScrollArea>
            </div>

            {/* Material List */}
            <div className="col-span-6 flex flex-col">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索物料名称/编号"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-9"
                />
              </div>
              <ScrollArea className="flex-1">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>物料</TableHead>
                        <TableHead>分类</TableHead>
                        <TableHead>品牌</TableHead>
                        <TableHead>规格</TableHead>
                        <TableHead className="w-[80px]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMaterials.map((material) => {
                        const isSelected = selectedIds.includes(material.id);
                        return (
                          <TableRow key={material.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {material.imageUrl && (
                                  <div className="relative w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
                                    <Image
                                      src={material.imageUrl}
                                      alt={material.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-sm">
                                    {material.name}
                                  </p>
                                  {material.materialNo && (
                                    <p className="text-xs text-muted-foreground">
                                      {material.materialNo}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {material.categoryName}
                            </TableCell>
                            <TableCell className="text-sm">
                              {material.brand}
                            </TableCell>
                            <TableCell className="text-sm">
                              {material.spec}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant={isSelected ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleSelectMaterial(material)}
                                disabled={
                                  !isSelected &&
                                  maxCount !== undefined &&
                                  selectedIds.length >= maxCount
                                }
                              >
                                {isSelected ? "取消" : "选择"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </div>

            {/* Selected List */}
            <div className="col-span-3 border-l pl-4">
              <p className="text-sm font-medium mb-2">
                已选物料 ({selectedMaterials.length}
                {maxCount ? `/${maxCount}` : ""})
              </p>
              <ScrollArea className="h-[440px]">
                {selectedMaterials.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    暂未选择物料
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedMaterials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between py-2 border-b"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-sm truncate">
                            {material.name}
                          </span>
                          {material.spec && (
                            <Badge variant="outline" className="flex-shrink-0">
                              {material.spec}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveMaterial(material.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              取消
            </Button>
            <Button onClick={handleConfirm}>确认选择</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MaterialSelect;

package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
)

// UploadImage 上传图片
func UploadImage() echo.HandlerFunc {
	return func(c echo.Context) error {
		file, err := c.FormFile("file")
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请选择要上传的文件")
		}

		// 检查文件大小（5MB）
		if file.Size > 5*1024*1024 {
			return ErrorResponse(c, http.StatusBadRequest, "文件大小不能超过5MB")
		}

		// 检查文件类型
		ext := strings.ToLower(filepath.Ext(file.Filename))
		allowedExts := map[string]bool{
			".jpg":  true,
			".jpeg": true,
			".png":  true,
			".gif":  true,
			".webp": true,
		}
		if !allowedExts[ext] {
			return ErrorResponse(c, http.StatusBadRequest, "只支持jpg、png、gif、webp格式的图片")
		}

		// 生成文件名
		filename := fmt.Sprintf("%d_%s%s", time.Now().Unix(), generateRandomString(8), ext)
		uploadPath := filepath.Join("uploads", "images", time.Now().Format("2006/01"))
		
		// 创建目录
		if err := os.MkdirAll(uploadPath, os.ModePerm); err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "创建上传目录失败")
		}

		// 保存文件
		fullPath := filepath.Join(uploadPath, filename)
		src, err := file.Open()
		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "打开文件失败")
		}
		defer src.Close()

		dst, err := os.Create(fullPath)
		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "保存文件失败")
		}
		defer dst.Close()

		if _, err = io.Copy(dst, src); err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "写入文件失败")
		}

		// 返回文件URL
		fileURL := fmt.Sprintf("/uploads/images/%s/%s", time.Now().Format("2006/01"), filename)
		
		return SuccessResponse(c, map[string]string{
			"url":      fileURL,
			"filename": filename,
		})
	}
}

// UploadExcel 上传Excel文件
func UploadExcel() echo.HandlerFunc {
	return func(c echo.Context) error {
		file, err := c.FormFile("file")
		if err != nil {
			return ErrorResponse(c, http.StatusBadRequest, "请选择要上传的文件")
		}

		// 检查文件大小（10MB）
		if file.Size > 10*1024*1024 {
			return ErrorResponse(c, http.StatusBadRequest, "文件大小不能超过10MB")
		}

		// 检查文件类型
		ext := strings.ToLower(filepath.Ext(file.Filename))
		allowedExts := map[string]bool{
			".xlsx": true,
			".xls":  true,
			".csv":  true,
		}
		if !allowedExts[ext] {
			return ErrorResponse(c, http.StatusBadRequest, "只支持xlsx、xls、csv格式的文件")
		}

		// 生成文件名
		filename := fmt.Sprintf("%d_%s%s", time.Now().Unix(), generateRandomString(8), ext)
		uploadPath := filepath.Join("uploads", "excel", time.Now().Format("2006/01"))
		
		// 创建目录
		if err := os.MkdirAll(uploadPath, os.ModePerm); err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "创建上传目录失败")
		}

		// 保存文件
		fullPath := filepath.Join(uploadPath, filename)
		src, err := file.Open()
		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "打开文件失败")
		}
		defer src.Close()

		dst, err := os.Create(fullPath)
		if err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "保存文件失败")
		}
		defer dst.Close()

		if _, err = io.Copy(dst, src); err != nil {
			return ErrorResponse(c, http.StatusInternalServerError, "写入文件失败")
		}

		// 返回文件路径供后续处理
		return SuccessResponse(c, map[string]string{
			"path":     fullPath,
			"filename": filename,
			"original": file.Filename,
		})
	}
}

// generateRandomString 生成随机字符串
func generateRandomString(length int) string {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	result := make([]byte, length)
	for i := range result {
		result[i] = chars[time.Now().UnixNano()%int64(len(chars))]
	}
	return string(result)
}

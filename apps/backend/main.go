package main

import (
	"github.com/project/backend/config"
	"github.com/project/backend/database"
	"github.com/project/backend/middleware"
	"github.com/project/backend/routes"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"go.uber.org/zap"
)

func main() {
	// 初始化配置
	cfg := config.Load()
	
	// 初始化日志
	logger := config.InitLogger(cfg.Log)
	defer logger.Sync()
	
	// 初始化数据库
	db := database.InitDB(cfg.Database)
	database.RunMigrations(db)
	
	// 初始化Redis
	redisClient := database.InitRedis(cfg.Redis)
	defer redisClient.Close()
	
	// 创建Echo实例
	e := echo.New()
	
	// 配置中间件
	e.Use(echoMiddleware.Logger())
	e.Use(echoMiddleware.Recover())
	e.Use(echoMiddleware.CORS())
	e.Use(echoMiddleware.RequestID())
	e.Use(echoMiddleware.Secure())
	e.Use(middleware.RateLimiter())
	e.Use(middleware.ResponseFormatter())
	
	// 注册路由
	routes.RegisterRoutes(e, db, redisClient, logger)
	
	// 启动服务器
	logger.Info("Starting server", zap.String("address", cfg.Server.Address))
	if err := e.Start(cfg.Server.Address); err != nil {
		logger.Fatal("Failed to start server", zap.Error(err))
	}
}

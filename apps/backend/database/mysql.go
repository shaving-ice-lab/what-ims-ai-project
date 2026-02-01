package database

import (
	"fmt"
	"log"
	"time"

	"github.com/project/backend/config"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func InitDB(cfg config.DatabaseConfig) *gorm.DB {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=%s&parseTime=True&loc=Local",
		cfg.User,
		cfg.Password,
		cfg.Host,
		cfg.Port,
		cfg.DBName,
		cfg.Charset,
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
		NowFunc: func() time.Time {
			return time.Now().Local()
		},
	})

	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	// 配置连接池
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get database instance: ", err)
	}

	sqlDB.SetMaxIdleConns(cfg.MaxIdle)
	sqlDB.SetMaxOpenConns(cfg.MaxOpen)
	sqlDB.SetConnMaxLifetime(time.Hour)

	return db
}

func RunMigrations(db *gorm.DB) {
	// 自动迁移所有模型
	err := db.AutoMigrate(
		&User{},
		&Admin{},
		&Store{},
		&Supplier{},
		&DeliveryArea{},
		&Category{},
		&Material{},
		&MaterialSku{},
		&SupplierMaterial{},
		&Order{},
		&OrderItem{},
		&OrderStatusLog{},
		&PaymentRecord{},
		&PriceMarkup{},
		&SystemConfig{},
		&WebhookLog{},
		&OperationLog{},
		&OrderCancelRequest{},
		&LoginLog{},
		&WechatBinding{},
		&ImageMatchRule{},
		&MediaImage{},
	)

	if err != nil {
		log.Fatal("Failed to run migrations: ", err)
	}
}

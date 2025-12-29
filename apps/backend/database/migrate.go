package database

import (
	"fmt"
	"log"

	"github.com/project/backend/models"
	"gorm.io/gorm"
)

// AutoMigrate runs automatic migrations for all models
func AutoMigrate(db *gorm.DB) error {
	// Enable foreign key constraints
	if err := db.Exec("SET FOREIGN_KEY_CHECKS = 1").Error; err != nil {
		return err
	}

	// Run migrations for all models
	err := db.AutoMigrate(
		// User and Authentication models
		&models.User{},
		&models.Admin{},
		&models.WechatBinding{},
		&models.LoginLog{},
		&models.Store{},
		&models.Supplier{},
		&models.DeliveryArea{},
		&models.SupplierSettingAudit{},

		// Material models
		&models.Category{},
		&models.Material{},
		&models.MaterialSku{},
		&models.SupplierMaterial{},

		// Order models
		&models.Order{},
		&models.OrderItem{},
		&models.OrderCancelRequest{},
		&models.OrderStatusLog{},
		&models.OperationLog{},

		// Media models
		&models.MediaImage{},
		&models.ImageMatchRule{},
	)

	if err != nil {
		log.Printf("Failed to auto migrate: %v", err)
		return err
	}

	log.Println("Database migration completed successfully")
	return nil
}

// CreateIndexes creates custom indexes
func CreateIndexes(db *gorm.DB) error {
	// User indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)")

	// Admin indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_admins_is_primary ON admins(is_primary)")

	// Store indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_stores_area ON stores(province, city, district)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_stores_status ON stores(status)")

	// Supplier indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON suppliers(user_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_suppliers_management_mode ON suppliers(management_mode)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status)")

	// DeliveryArea indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_delivery_areas_supplier_id ON delivery_areas(supplier_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_delivery_areas_area ON delivery_areas(province, city, district)")

	// Category indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_categories_path ON categories(path)")

	// Material indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_materials_category_id ON materials(category_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_materials_name ON materials(name)")
	db.Exec("CREATE FULLTEXT INDEX IF NOT EXISTS idx_materials_search ON materials(name, alias, keywords)")

	// MaterialSku indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_material_skus_material_id ON material_skus(material_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_material_skus_brand ON material_skus(brand)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_material_skus_barcode ON material_skus(barcode)")
	db.Exec("CREATE UNIQUE INDEX IF NOT EXISTS uk_material_skus_material_brand_spec ON material_skus(material_id, brand, spec)")

	// SupplierMaterial indexes
	db.Exec("CREATE UNIQUE INDEX IF NOT EXISTS uk_supplier_materials_supplier_sku ON supplier_materials(supplier_id, material_sku_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_supplier_materials_material_sku_id ON supplier_materials(material_sku_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_supplier_materials_price ON supplier_materials(price)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_supplier_materials_stock_status ON supplier_materials(stock_status)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_supplier_materials_audit_status ON supplier_materials(audit_status)")

	// Order indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON orders(supplier_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_orders_store_status_created ON orders(store_id, status, created_at)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_orders_supplier_status_created ON orders(supplier_id, status, created_at)")

	// OrderItem indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_order_items_material_sku_id ON order_items(material_sku_id)")

	// WechatBinding indexes
	db.Exec("CREATE UNIQUE INDEX IF NOT EXISTS uk_wechat_bindings_openid ON wechat_bindings(openid)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_wechat_bindings_user_id ON wechat_bindings(user_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_wechat_bindings_bindable ON wechat_bindings(bindable_type, bindable_id)")

	// SupplierSettingAudit indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_supplier_setting_audits_supplier_id ON supplier_setting_audits(supplier_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_supplier_setting_audits_status ON supplier_setting_audits(status)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_supplier_setting_audits_submit_time ON supplier_setting_audits(submit_time)")

	// OrderCancelRequest indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_order_cancel_requests_order_id ON order_cancel_requests(order_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_order_cancel_requests_status ON order_cancel_requests(status)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_order_cancel_requests_created_at ON order_cancel_requests(created_at)")

	// OrderStatusLog indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_order_status_logs_order_id ON order_status_logs(order_id)")

	// OperationLog indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_operation_logs_user ON operation_logs(user_type, user_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_operation_logs_module_action ON operation_logs(module, action)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_operation_logs_target ON operation_logs(target_type, target_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_operation_logs_created_at ON operation_logs(created_at)")

	// MediaImage indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_media_images_category_brand ON media_images(category_id, brand)")
	db.Exec("CREATE FULLTEXT INDEX IF NOT EXISTS idx_media_images_search ON media_images(name, match_keywords)")

	// ImageMatchRule indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_image_match_rules_active_priority ON image_match_rules(is_active, priority DESC)")

	// LoginLog indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_login_logs_username ON login_logs(username)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_login_logs_login_at ON login_logs(login_at)")

	log.Println("Database indexes created successfully")
	return nil
}

// SeedInitialData seeds initial data
func SeedInitialData(db *gorm.DB) error {
	// Check if admin user already exists
	var count int64
	db.Model(&models.User{}).Where("username = ?", "admin").Count(&count)
	if count > 0 {
		log.Println("Initial data already seeded")
		return nil
	}

	// Create default admin user
	// Default password: Admin@123 (bcrypt hash with cost 10)
	// Users should change this password after first login
	adminUser := &models.User{
		Username:     "admin",
		PasswordHash: "$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqbOH1OJyqqqVnKLBa1xLxDBJ.S3.", // Admin@123
		Role:         models.RoleAdmin,
		Phone:        "13800000000",
		Status:       1,
	}

	if err := db.Create(adminUser).Error; err != nil {
		return err
	}

	// Create admin record
	permissions := models.Permissions{"order", "supplier", "store", "material", "report", "system", "user"}
	admin := &models.Admin{
		UserID:      adminUser.ID,
		Name:        "系统管理员",
		IsPrimary:   1,
		Permissions: permissions,
		Status:      1,
	}

	if err := db.Create(admin).Error; err != nil {
		return err
	}

	log.Printf("Default admin user created: username=admin, password=Admin@123")

	// Seed default categories
	if err := seedCategories(db); err != nil {
		log.Printf("Failed to seed categories: %v", err)
	}

	// Initialize default system configs
	if err := models.InitDefaultConfigs(db); err != nil {
		log.Printf("Failed to init default configs: %v", err)
	} else {
		log.Println("Default system configs initialized")
	}

	log.Println("Initial data seeded successfully")
	return nil
}

// seedCategories creates default material categories
func seedCategories(db *gorm.DB) error {
	// Check if categories already exist
	var count int64
	db.Model(&models.Category{}).Count(&count)
	if count > 0 {
		return nil
	}

	// Create top-level categories
	topCategories := []models.Category{
		{Name: "蔬菜", Icon: "vegetable", SortOrder: 1, Level: 1, Path: "", MarkupEnabled: 1, Status: 1},
		{Name: "水果", Icon: "fruit", SortOrder: 2, Level: 1, Path: "", MarkupEnabled: 1, Status: 1},
		{Name: "肉类", Icon: "meat", SortOrder: 3, Level: 1, Path: "", MarkupEnabled: 1, Status: 1},
		{Name: "海鲜水产", Icon: "seafood", SortOrder: 4, Level: 1, Path: "", MarkupEnabled: 1, Status: 1},
		{Name: "粮油米面", Icon: "grain", SortOrder: 5, Level: 1, Path: "", MarkupEnabled: 1, Status: 1},
		{Name: "调味品", Icon: "condiment", SortOrder: 6, Level: 1, Path: "", MarkupEnabled: 1, Status: 1},
		{Name: "乳制品", Icon: "dairy", SortOrder: 7, Level: 1, Path: "", MarkupEnabled: 1, Status: 1},
		{Name: "冷冻食品", Icon: "frozen", SortOrder: 8, Level: 1, Path: "", MarkupEnabled: 1, Status: 1},
		{Name: "饮料酒水", Icon: "beverage", SortOrder: 9, Level: 1, Path: "", MarkupEnabled: 1, Status: 1},
		{Name: "干货杂粮", Icon: "dried", SortOrder: 10, Level: 1, Path: "", MarkupEnabled: 1, Status: 1},
		{Name: "烘焙原料", Icon: "baking", SortOrder: 11, Level: 1, Path: "", MarkupEnabled: 1, Status: 1},
		{Name: "餐厨用品", Icon: "kitchen", SortOrder: 12, Level: 1, Path: "", MarkupEnabled: 1, Status: 1},
		{Name: "其他", Icon: "other", SortOrder: 99, Level: 1, Path: "", MarkupEnabled: 1, Status: 1},
	}

	for i := range topCategories {
		if err := db.Create(&topCategories[i]).Error; err != nil {
			log.Printf("Failed to create category %s: %v", topCategories[i].Name, err)
			continue
		}
		// Update path after ID is assigned
		topCategories[i].Path = fmt.Sprintf("%d", topCategories[i].ID)
		db.Model(&topCategories[i]).Update("path", topCategories[i].Path)
	}

	// Create sub-categories for vegetables
	var vegCategory models.Category
	if err := db.Where("name = ?", "蔬菜").First(&vegCategory).Error; err == nil {
		subCategories := []models.Category{
			{Name: "叶菜类", ParentID: &vegCategory.ID, SortOrder: 1, Level: 2, Path: fmt.Sprintf("%d", vegCategory.ID), MarkupEnabled: 1, Status: 1},
			{Name: "根茎类", ParentID: &vegCategory.ID, SortOrder: 2, Level: 2, Path: fmt.Sprintf("%d", vegCategory.ID), MarkupEnabled: 1, Status: 1},
			{Name: "茄果类", ParentID: &vegCategory.ID, SortOrder: 3, Level: 2, Path: fmt.Sprintf("%d", vegCategory.ID), MarkupEnabled: 1, Status: 1},
			{Name: "菌菇类", ParentID: &vegCategory.ID, SortOrder: 4, Level: 2, Path: fmt.Sprintf("%d", vegCategory.ID), MarkupEnabled: 1, Status: 1},
			{Name: "豆类", ParentID: &vegCategory.ID, SortOrder: 5, Level: 2, Path: fmt.Sprintf("%d", vegCategory.ID), MarkupEnabled: 1, Status: 1},
		}
		for i := range subCategories {
			if err := db.Create(&subCategories[i]).Error; err != nil {
				log.Printf("Failed to create sub-category %s: %v", subCategories[i].Name, err)
				continue
			}
			subCategories[i].Path = fmt.Sprintf("%d/%d", vegCategory.ID, subCategories[i].ID)
			db.Model(&subCategories[i]).Update("path", subCategories[i].Path)
		}
	}

	// Create sub-categories for meat
	var meatCategory models.Category
	if err := db.Where("name = ?", "肉类").First(&meatCategory).Error; err == nil {
		subCategories := []models.Category{
			{Name: "猪肉", ParentID: &meatCategory.ID, SortOrder: 1, Level: 2, Path: fmt.Sprintf("%d", meatCategory.ID), MarkupEnabled: 1, Status: 1},
			{Name: "牛肉", ParentID: &meatCategory.ID, SortOrder: 2, Level: 2, Path: fmt.Sprintf("%d", meatCategory.ID), MarkupEnabled: 1, Status: 1},
			{Name: "羊肉", ParentID: &meatCategory.ID, SortOrder: 3, Level: 2, Path: fmt.Sprintf("%d", meatCategory.ID), MarkupEnabled: 1, Status: 1},
			{Name: "禽类", ParentID: &meatCategory.ID, SortOrder: 4, Level: 2, Path: fmt.Sprintf("%d", meatCategory.ID), MarkupEnabled: 1, Status: 1},
		}
		for i := range subCategories {
			if err := db.Create(&subCategories[i]).Error; err != nil {
				log.Printf("Failed to create sub-category %s: %v", subCategories[i].Name, err)
				continue
			}
			subCategories[i].Path = fmt.Sprintf("%d/%d", meatCategory.ID, subCategories[i].ID)
			db.Model(&subCategories[i]).Update("path", subCategories[i].Path)
		}
	}

	log.Println("Default categories seeded successfully")
	return nil
}

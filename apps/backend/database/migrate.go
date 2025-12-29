package database

import (
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
		&models.Store{},
		&models.Supplier{},
		&models.DeliveryArea{},

		// Material models
		&models.Category{},
		&models.Material{},
		&models.MaterialSku{},
		&models.SupplierMaterial{},

		// Order models
		&models.Order{},
		&models.OrderItem{},
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
	adminUser := &models.User{
		Username:     "admin",
		PasswordHash: "$2a$10$YourHashedPasswordHere", // TODO: Generate proper password hash
		Role:         models.RoleAdmin,
		Status:       1,
	}

	if err := db.Create(adminUser).Error; err != nil {
		return err
	}

	// Create admin record
	admin := &models.Admin{
		UserID:    adminUser.ID,
		Name:      "系统管理员",
		IsPrimary: 1,
		Status:    1,
	}

	if err := db.Create(admin).Error; err != nil {
		return err
	}

	// Create default categories
	categories := []models.Category{
		{Name: "蔬菜", SortOrder: 1, Level: 1, Status: 1},
		{Name: "水果", SortOrder: 2, Level: 1, Status: 1},
		{Name: "肉类", SortOrder: 3, Level: 1, Status: 1},
		{Name: "海鲜", SortOrder: 4, Level: 1, Status: 1},
		{Name: "粮油", SortOrder: 5, Level: 1, Status: 1},
		{Name: "调料", SortOrder: 6, Level: 1, Status: 1},
		{Name: "饮料", SortOrder: 7, Level: 1, Status: 1},
		{Name: "其他", SortOrder: 99, Level: 1, Status: 1},
	}

	for _, category := range categories {
		if err := db.Create(&category).Error; err != nil {
			log.Printf("Failed to create category %s: %v", category.Name, err)
		}
	}

	log.Println("Initial data seeded successfully")
	return nil
}

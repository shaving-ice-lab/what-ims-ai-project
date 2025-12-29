package config

import (
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	Database DatabaseConfig `mapstructure:"database"`
	Redis    RedisConfig    `mapstructure:"redis"`
	JWT      JWTConfig      `mapstructure:"jwt"`
	Log      LogConfig      `mapstructure:"log"`
}

type ServerConfig struct {
	Address string `mapstructure:"address"`
	Port    int    `mapstructure:"port"`
}

type DatabaseConfig struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	DBName   string `mapstructure:"dbname"`
	Charset  string `mapstructure:"charset"`
	MaxIdle  int    `mapstructure:"max_idle"`
	MaxOpen  int    `mapstructure:"max_open"`
}

type RedisConfig struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	Password string `mapstructure:"password"`
	DB       int    `mapstructure:"db"`
}

type JWTConfig struct {
	Secret           string `mapstructure:"secret"`
	AccessExpiry     int    `mapstructure:"access_expiry"`  // minutes
	RefreshExpiry    int    `mapstructure:"refresh_expiry"` // days
}

type LogConfig struct {
	Level      string `mapstructure:"level"`
	OutputPath string `mapstructure:"output_path"`
}

func Load() *Config {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./config")
	
	// 设置默认值
	viper.SetDefault("server.address", ":8080")
	viper.SetDefault("database.charset", "utf8mb4")
	viper.SetDefault("database.max_idle", 5)
	viper.SetDefault("database.max_open", 20)
	viper.SetDefault("jwt.access_expiry", 120)
	viper.SetDefault("jwt.refresh_expiry", 7)
	viper.SetDefault("log.level", "info")
	
	// 环境变量覆盖
	viper.AutomaticEnv()
	
	if err := viper.ReadInConfig(); err != nil {
		panic("Failed to read config file: " + err.Error())
	}
	
	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		panic("Failed to unmarshal config: " + err.Error())
	}
	
	return &config
}

func InitLogger(cfg LogConfig) *zap.Logger {
	var level zapcore.Level
	switch cfg.Level {
	case "debug":
		level = zapcore.DebugLevel
	case "info":
		level = zapcore.InfoLevel
	case "warn":
		level = zapcore.WarnLevel
	case "error":
		level = zapcore.ErrorLevel
	default:
		level = zapcore.InfoLevel
	}
	
	config := zap.Config{
		Level:       zap.NewAtomicLevelAt(level),
		Development: false,
		Encoding:    "json",
		EncoderConfig: zapcore.EncoderConfig{
			TimeKey:        "timestamp",
			LevelKey:       "level",
			NameKey:        "logger",
			CallerKey:      "caller",
			FunctionKey:    zapcore.OmitKey,
			MessageKey:     "msg",
			StacktraceKey:  "stacktrace",
			LineEnding:     zapcore.DefaultLineEnding,
			EncodeLevel:    zapcore.LowercaseLevelEncoder,
			EncodeTime:     zapcore.ISO8601TimeEncoder,
			EncodeDuration: zapcore.SecondsDurationEncoder,
			EncodeCaller:   zapcore.ShortCallerEncoder,
		},
		OutputPaths:      []string{cfg.OutputPath, "stdout"},
		ErrorOutputPaths: []string{"stderr"},
	}
	
	logger, err := config.Build()
	if err != nil {
		panic("Failed to initialize logger: " + err.Error())
	}
	
	return logger
}

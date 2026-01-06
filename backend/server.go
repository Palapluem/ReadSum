package main

import (
	"log"
	"os"

	"github.com/MadMax168/Readsum/config"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	// Try loading from root first (../.env), then current directory (.env)
	if err := godotenv.Load("../.env"); err != nil {
		if err := godotenv.Load(".env"); err != nil {
			log.Println("Not found .env file")
		}
	}

	config.ConnectDB()

	config.DB.AutoMigrate(
	//models
	)

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowCredentials: true,
	}))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Println("Server Starting on: 8000")
	app.Listen(":" + port)
}

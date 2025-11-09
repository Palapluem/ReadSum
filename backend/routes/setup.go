package routes

import (
	"github.com/MadMax168/Readsum/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetAllRoutes(app *fiber.App){
	app.Post("/register", handlers.Register);
}
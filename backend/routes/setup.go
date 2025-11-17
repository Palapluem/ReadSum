package routes

import (
	"github.com/MadMax168/Readsum/handlers"
	"github.com/MadMax168/Readsum/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetAllRoutes(app *fiber.App){
	app.Post("/register", handlers.Register);
	app.Post("/login", handlers.Login);

	api := app.Group("/api")

	user := api.Group("/user", middleware.AuthMiddleware)
	user.Get("/me", handlers.GetUser)
}
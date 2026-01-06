package routes

import (
	"github.com/MadMax168/Readsum/handlers"
	"github.com/MadMax168/Readsum/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetAllRoutes(app *fiber.App) {
	app.Post("/register", handlers.Register)
	app.Post("/login", handlers.Login)

	api := app.Group("/api")

	v1 := api.Group("/v1")

	users := v1.Group("/users", middleware.AuthMiddleware)

	users.Get("/me", handlers.GetUser)
	users.Patch("/me/password", handlers.UpdPass)

	// Chat Routes
	chats := v1.Group("/chats", middleware.AuthMiddleware)
	chats.Get("/", handlers.GetChat)
	chats.Post("/", handlers.Create)
	chats.Patch("/:chatID", handlers.UpdChat)
	chats.Delete("/:chatID", handlers.DelChat)

	// Message Routes (Nested under chat)
	messages := chats.Group("/:chatID/messages")
	messages.Get("/", handlers.GetMessage)
	messages.Post("/", handlers.PostMessage)
	messages.Patch("/:messageID", handlers.UpdMessage)
	messages.Delete("/:messageID", handlers.DelMessage)
}

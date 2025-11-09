package customerrors

import (
	"fmt"
)

type CustomError struct {
	Code    int
	Message string
}

func (e *CustomError) Error() string {
	return fmt.Sprintf("Status %d: %s", e.Code, e.Message)
}

func (e *CustomError) GetCode() int {
	return e.Code
}

//Error
func NewBadRequestError(message string) *CustomError {
	return &CustomError{
		Code: 400,
		Message: message,
	}
}

func NewUnauthorizedError(message string) *CustomError {
	return &CustomError{
		Code: 401,
		Message: message,
	}
}

func NewForbiddenError(message string) *CustomError {
	return &CustomError{
		Code: 403,
		Message: message,
	}
}

func NewNotFoundError(message string) *CustomError {
	return &CustomError{
		Code: 404,
		Message: message,
	}
}

func NewConflictError(message string) *CustomError {
	return &CustomError{
		Code: 409,
		Message: message,
	}
}

func NewInternalServerError(message string) *CustomError {
	return &CustomError{
		Code: 500,
		Message: message,
	}
}
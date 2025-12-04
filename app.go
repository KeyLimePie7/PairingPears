package main

import (
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx context.Context
	db  *Database
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// Initialize database
	db, err := InitDatabase()
	if err != nil {
		fmt.Printf("Failed to initialize database: %v\n", err)
		return
	}
	a.db = db
}

// shutdown is called when the app is closing
func (a *App) shutdown(ctx context.Context) {
	if a.db != nil {
		a.db.Close()
	}
}

// Developer methods
func (a *App) GetAllDevelopers() ([]Developer, error) {
	return a.db.GetAllDevelopers()
}

func (a *App) AddDeveloper(name string) (Developer, error) {
	return a.db.AddDeveloper(name)
}

func (a *App) DeleteDeveloper(id string) error {
	return a.db.DeleteDeveloper(id)
}

func (a *App) ClearAllDevelopers() error {
	return a.db.ClearAllDevelopers()
}

// Group methods
func (a *App) GetAllGroups() ([]Group, error) {
	return a.db.GetAllGroups()
}

func (a *App) AddGroup(name string) (Group, error) {
	return a.db.AddGroup(name)
}

func (a *App) UpdateGroup(id string, name string, members []string) error {
	return a.db.UpdateGroup(id, name, members)
}

func (a *App) DeleteGroup(id string) error {
	return a.db.DeleteGroup(id)
}

func (a *App) ClearAllGroups() error {
	return a.db.ClearAllGroups()
}

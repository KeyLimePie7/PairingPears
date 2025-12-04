package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/google/uuid"
	"go.etcd.io/bbolt"
)

type Database struct {
	db *bbolt.DB
}

type Developer struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Group struct {
	ID      string   `json:"id"`
	Name    string   `json:"name"`
	Members []string `json:"members"`
}

var (
	developersBucket = []byte("developers")
	groupsBucket     = []byte("groups")
)

func InitDatabase() (*Database, error) {
	// Get the directory where the executable is located
	exePath, err := os.Executable()
	if err != nil {
		return nil, fmt.Errorf("failed to get executable path: %w", err)
	}

	exeDir := filepath.Dir(exePath)

	// Database file will be in the same directory as the executable
	dbPath := filepath.Join(exeDir, "pairing-pears.db")

	db, err := bbolt.Open(dbPath, 0600, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Create buckets (like tables)
	err = db.Update(func(tx *bbolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists(developersBucket)
		if err != nil {
			return err
		}
		_, err = tx.CreateBucketIfNotExists(groupsBucket)
		return err
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create buckets: %w", err)
	}

	return &Database{db: db}, nil
}

func (d *Database) Close() error {
	return d.db.Close()
}

// Developer methods
func (d *Database) GetAllDevelopers() ([]Developer, error) {
	var developers []Developer

	err := d.db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket(developersBucket)
		return b.ForEach(func(k, v []byte) error {
			var dev Developer
			if err := json.Unmarshal(v, &dev); err != nil {
				return err
			}
			developers = append(developers, dev)
			return nil
		})
	})

	return developers, err
}

func (d *Database) AddDeveloper(name string) (Developer, error) {
	dev := Developer{
		ID:   uuid.New().String(),
		Name: name,
	}

	err := d.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket(developersBucket)
		data, err := json.Marshal(dev)
		if err != nil {
			return err
		}
		return b.Put([]byte(dev.ID), data)
	})

	if err != nil {
		return Developer{}, err
	}

	return dev, nil
}

func (d *Database) DeleteDeveloper(id string) error {
	return d.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket(developersBucket)
		return b.Delete([]byte(id))
	})
}

func (d *Database) ClearAllDevelopers() error {
	return d.db.Update(func(tx *bbolt.Tx) error {
		if err := tx.DeleteBucket(developersBucket); err != nil {
			return err
		}
		_, err := tx.CreateBucket(developersBucket)
		return err
	})
}

// Group methods
func (d *Database) GetAllGroups() ([]Group, error) {
	var groups []Group

	err := d.db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket(groupsBucket)
		return b.ForEach(func(k, v []byte) error {
			var group Group
			if err := json.Unmarshal(v, &group); err != nil {
				return err
			}
			groups = append(groups, group)
			return nil
		})
	})

	return groups, err
}

func (d *Database) AddGroup(name string) (Group, error) {
	group := Group{
		ID:      uuid.New().String(),
		Name:    name,
		Members: []string{},
	}

	err := d.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket(groupsBucket)
		data, err := json.Marshal(group)
		if err != nil {
			return err
		}
		return b.Put([]byte(group.ID), data)
	})

	if err != nil {
		return Group{}, err
	}

	return group, nil
}

func (d *Database) UpdateGroup(id string, name string, members []string) error {
	return d.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket(groupsBucket)

		// Get existing group
		data := b.Get([]byte(id))
		if data == nil {
			return fmt.Errorf("group not found")
		}

		var group Group
		if err := json.Unmarshal(data, &group); err != nil {
			return err
		}

		// Update fields
		group.Name = name
		group.Members = members

		// Save back
		newData, err := json.Marshal(group)
		if err != nil {
			return err
		}
		return b.Put([]byte(id), newData)
	})
}

func (d *Database) DeleteGroup(id string) error {
	return d.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket(groupsBucket)
		return b.Delete([]byte(id))
	})
}

func (d *Database) ClearAllGroups() error {
	return d.db.Update(func(tx *bbolt.Tx) error {
		if err := tx.DeleteBucket(groupsBucket); err != nil {
			return err
		}
		_, err := tx.CreateBucket(groupsBucket)
		return err
	})
}

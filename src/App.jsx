import React, { useState } from 'react'
import { innovationTypes } from './innovationData'
import './App.css'
import FrameworkCreator from './components/FrameworkCreator'

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [activeTypes, setActiveTypes] = useState(new Set())
  const [showAll, setShowAll] = useState(true)
  const [selectedFramework, setSelectedFramework] = useState(null)
  const [frameworks, setFrameworks] = useState([])
  const [isCreatingFramework, setIsCreatingFramework] = useState(false)

  const categories = {
    'Configuration': innovationTypes.filter(type => type.category === 'Configuration'),
    'Offering': innovationTypes.filter(type => type.category === 'Offering'),
    'Experience': innovationTypes.filter(type => type.category === 'Experience')
  }

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null)
      setActiveTypes(new Set())
      setShowAll(true)
    } else {
      setSelectedCategory(category)
      setActiveTypes(new Set(categories[category].map(type => type.id)))
      setShowAll(true)
    }
  }

  const handleTypeClick = (typeId) => {
    setShowAll(false)
    setActiveTypes(new Set([typeId]))
  }

  const handleShowAllClick = () => {
    setShowAll(true)
    if (selectedCategory) {
      setActiveTypes(new Set(categories[selectedCategory].map(type => type.id)))
    }
  }

  const handleCreateFramework = () => {
    setIsCreatingFramework(true)
    setSelectedFramework(null) // Clear selected framework when creating a new one
  }

  const handleSaveFramework = (framework) => {
    if (framework.id) {
      // Edit existing framework
      setFrameworks(frameworks.map(f => f.id === framework.id ? framework : f))
    } else {
      // Create new framework
      const newFramework = { ...framework, id: Date.now().toString() }
      setFrameworks([...frameworks, newFramework])
      setSelectedFramework(newFramework) // Set the newly created framework as selected
    }
    setIsCreatingFramework(false)
  }

  const handleEditFramework = (framework) => {
    setSelectedFramework(framework)
    setIsCreatingFramework(true)
  }

  const handleDeleteFramework = (frameworkId) => {
    setFrameworks(frameworks.filter(f => f.id !== frameworkId))
    setSelectedFramework(null) // Clear selected framework after deletion
  }

  const handleCancelFramework = () => {
    setIsCreatingFramework(false)
    setSelectedFramework(null)
  }

  return (
    <div className="app">
      <div className="header">
        <h1>10 Types of Innovation</h1>
        <div className="framework-controls">
          <select 
            value={selectedFramework?.id || ''}
            onChange={(e) => setSelectedFramework(frameworks.find(f => f.id === e.target.value))}
            className="framework-select"
          >
            <option value="">Select a Framework</option>
            {frameworks.map(framework => (
              <option key={framework.id} value={framework.id}>{framework.name}</option>
            ))}
          </select>
          <button className="create-framework-btn" onClick={handleCreateFramework}>
            Create New Framework
          </button>
          <button 
            className="edit-framework-btn"
            disabled={!selectedFramework}
            onClick={() => handleEditFramework(selectedFramework)}
          >
            Edit Framework
          </button>
          <button 
            className="delete-framework-btn"
            disabled={!selectedFramework}
            onClick={() => handleDeleteFramework(selectedFramework.id)}
          >
            Delete Framework
          </button>
        </div>
      </div>

      {isCreatingFramework && (
        <FrameworkCreator 
          onSave={handleSaveFramework} 
          onCancel={handleCancelFramework} 
          initialData={selectedFramework} 
        />
      )}

      <div className="container">
        <div className={`main-categories ${selectedCategory ? 'horizontal' : ''}`}>
          {Object.keys(categories).map(category => (
            <button
              key={category}
              className={`category-button ${category.toLowerCase()} ${selectedCategory === category ? 'selected' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="content-area">
            <div className={`types-panel ${selectedCategory.toLowerCase()}`}>
              <button
                className={`show-all-button ${showAll ? 'selected' : ''}`}
                onClick={handleShowAllClick}
              >
                Show All
              </button>
              <div className="types-list">
                {categories[selectedCategory].map(type => (
                  <button
                    key={type.id}
                    className={`type-button ${activeTypes.has(type.id) ? 'selected' : ''}`}
                    onClick={() => handleTypeClick(type.id)}
                  >
                    {type.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="details-panel">
              {categories[selectedCategory]
                .filter(type => activeTypes.has(type.id))
                .map(type => (
                  <div key={type.id} className="type-details">
                    <h2>{type.title}</h2>
                    <p>{type.description}</p>
                    <div className="tactics-list">
                      {type.subtypes.map((tactic, index) => (
                        <div key={index} className="tactic-card">
                          <h3>{tactic.title}</h3>
                          <p>{tactic.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

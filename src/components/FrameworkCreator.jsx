import React, { useState, useEffect } from 'react'
import './FrameworkCreator.css'

function FrameworkCreator({ onSave, onCancel, initialData }) {
  const [frameworkName, setFrameworkName] = useState('')
  const [categories, setCategories] = useState([])
  const [currentCategory, setCurrentCategory] = useState({ name: '', color: '#1F77B4' })
  const [currentType, setCurrentType] = useState({ title: '', description: '' })
  const [currentSubtype, setCurrentSubtype] = useState({ title: '', description: '' })
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null)
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(null)

  useEffect(() => {
    if (initialData) {
      setFrameworkName(initialData.name)
      setCategories(initialData.categories || [])
    }
  }, [initialData])

  const handleAddCategory = () => {
    if (currentCategory.name) {
      setCategories([...categories, { 
        ...currentCategory, 
        types: [] 
      }])
      setCurrentCategory({ name: '', color: '#1F77B4' })
    }
  }

  const handleAddType = () => {
    if (currentType.title && selectedCategoryIndex !== null) {
      const updatedCategories = [...categories]
      if (!updatedCategories[selectedCategoryIndex].types) {
        updatedCategories[selectedCategoryIndex].types = []
      }
      updatedCategories[selectedCategoryIndex].types.push({
        ...currentType,
        subtypes: []
      })
      setCategories(updatedCategories)
      setCurrentType({ title: '', description: '' })
    }
  }

  const handleAddSubtype = () => {
    if (currentSubtype.title && selectedCategoryIndex !== null && selectedTypeIndex !== null) {
      const updatedCategories = [...categories]
      if (!updatedCategories[selectedCategoryIndex].types[selectedTypeIndex].subtypes) {
        updatedCategories[selectedCategoryIndex].types[selectedTypeIndex].subtypes = []
      }
      updatedCategories[selectedCategoryIndex].types[selectedTypeIndex].subtypes.push(currentSubtype)
      setCategories(updatedCategories)
      setCurrentSubtype({ title: '', description: '' })
    }
  }

  const handleSelectCategory = (index) => {
    setSelectedCategoryIndex(index)
    setSelectedTypeIndex(null)
  }

  const handleSelectType = (categoryIndex, typeIndex) => {
    setSelectedCategoryIndex(categoryIndex)
    setSelectedTypeIndex(typeIndex)
  }

  const handleSave = () => {
    if (frameworkName && categories.length > 0) {
      const framework = {
        id: initialData?.id || Date.now().toString(),
        name: frameworkName,
        categories: categories
      }
      onSave(framework)
    }
  }

  return (
    <div className="framework-creator">
      <h2>{initialData ? 'Edit Framework' : 'Create New Framework'}</h2>
      
      <div className="section">
        <h3>Framework Name</h3>
        <input 
          type="text" 
          value={frameworkName} 
          onChange={(e) => setFrameworkName(e.target.value)} 
          placeholder="Enter framework name" 
        />
      </div>

      <div className="section">
        <h3>Categories</h3>
        <div className="input-group">
          <input 
            type="text" 
            value={currentCategory.name} 
            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })} 
            placeholder="Category name" 
          />
          <input 
            type="color" 
            value={currentCategory.color} 
            onChange={(e) => setCurrentCategory({ ...currentCategory, color: e.target.value })} 
          />
          <button onClick={handleAddCategory}>Add Category</button>
        </div>
        <div className="preview">
          <ul>
            {categories.map((cat, index) => (
              <li 
                key={index} 
                onClick={() => handleSelectCategory(index)}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: selectedCategoryIndex === index ? '#f0f0f0' : 'transparent'
                }}
              >
                {cat.name} ({cat.color})
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section">
        <h3>Types</h3>
        <div className="input-group">
          <input 
            type="text" 
            value={currentType.title} 
            onChange={(e) => setCurrentType({ ...currentType, title: e.target.value })} 
            placeholder="Type title" 
            disabled={selectedCategoryIndex === null}
          />
          <textarea 
            value={currentType.description} 
            onChange={(e) => setCurrentType({ ...currentType, description: e.target.value })} 
            placeholder="Type description" 
            disabled={selectedCategoryIndex === null}
          />
          <button 
            onClick={handleAddType}
            disabled={selectedCategoryIndex === null}
          >
            Add Type
          </button>
        </div>
        <div className="preview">
          <ul>
            {selectedCategoryIndex !== null && categories[selectedCategoryIndex].types?.map((type, index) => (
              <li 
                key={index}
                onClick={() => handleSelectType(selectedCategoryIndex, index)}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: selectedTypeIndex === index ? '#f0f0f0' : 'transparent'
                }}
              >
                {type.title} - {type.description}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section">
        <h3>Subtypes</h3>
        <div className="input-group">
          <input 
            type="text" 
            value={currentSubtype.title} 
            onChange={(e) => setCurrentSubtype({ ...currentSubtype, title: e.target.value })} 
            placeholder="Subtype title" 
            disabled={selectedTypeIndex === null}
          />
          <textarea 
            value={currentSubtype.description} 
            onChange={(e) => setCurrentSubtype({ ...currentSubtype, description: e.target.value })} 
            placeholder="Subtype description" 
            disabled={selectedTypeIndex === null}
          />
          <button 
            onClick={handleAddSubtype}
            disabled={selectedTypeIndex === null}
          >
            Add Subtype
          </button>
        </div>
        <div className="preview">
          <ul>
            {selectedTypeIndex !== null && 
             categories[selectedCategoryIndex]?.types[selectedTypeIndex]?.subtypes?.map((subtype, index) => (
              <li key={index}>
                {subtype.title} - {subtype.description}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="actions">
        <button 
          onClick={handleSave}
          disabled={!frameworkName || categories.length === 0}
          className="save"
        >
          {initialData ? 'Save Changes' : 'Save Framework'}
        </button>
        <button onClick={onCancel} className="cancel">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default FrameworkCreator

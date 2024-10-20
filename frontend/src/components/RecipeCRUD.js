import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './RecipeCRUD.css';
import toastr from 'toastr'; // Import Toastr
import { FaHeart,FaRegHeart  } from "react-icons/fa6";

// Set up modal accessibility
Modal.setAppElement('#root');

const RecipeCRUD = () => {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingRecipeId, setDeletingRecipeId] = useState(null);
  const openDeleteConfirmation = (id) => {
    setDeletingRecipeId(id);
    setIsConfirmDeleteOpen(true);
  };
  const closeDeleteConfirmation = () => {
    setIsConfirmDeleteOpen(false);
    setDeletingRecipeId(null);
  };
  useEffect(() => {
    fetchRecipes();
    checkUserRole();
    if (isAddModalOpen || isEditModalOpen) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
  }, [[isAddModalOpen, isEditModalOpen]]);

  const fetchRecipes = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/auth/recipe', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRecipes(response.data);
  };

  const checkUserRole = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await axios.get('http://localhost:5000/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsAdmin(response.data.isAdmin); 

    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe({ ...newRecipe, [name]: value });
  };

  const handleImageChange = (e) => {    
    setNewRecipe({ ...newRecipe, image: e.target.files[0] });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!newRecipe.title) formErrors.title = 'Title is required';
    if (!newRecipe.description) formErrors.description = 'Description is required';
    if (!newRecipe.ingredients) formErrors.ingredients = 'Ingredients are required';
    if (!newRecipe.instructions) formErrors.instructions = 'Instructions are required';
    if (!newRecipe.image) formErrors.image = 'Image is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const openAddModal = () => {
    setNewRecipe({ title: '', description: '', ingredients: '', instructions: '', image: null });
    setErrors({});
    setAddModalOpen(true);
  };

  const closeAddModal = () => setAddModalOpen(false);

  const addRecipe = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', newRecipe.title);
    formData.append('description', newRecipe.description);
    formData.append('ingredients', newRecipe.ingredients.split(',').map((ingredient) => ingredient.trim()));
    formData.append('instructions', newRecipe.instructions);    
    formData.append('image', newRecipe.image);

    await axios.post('http://localhost:5000/api/auth/recipe', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    closeAddModal();
    toastr.success('Recipe added successfully!');
    fetchRecipes();
  };

  const openEditModal = (recipe) => {
    setNewRecipe({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients.join(', '),
      instructions: recipe.instructions,
      image: null,
    });
    setEditingRecipeId(recipe._id);
    setErrors({});
    setEditModalOpen(true);
  };

  const closeEditModal = () => setEditModalOpen(false);
  const toggleFavorite = async (isFavorite, id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/auth/recipe/${id}/toggle-favorite`,
        { isFavorite },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRecipes();
      if(isFavorite){
        toastr.success('Recipe removed from favorites successfully.');
      } else {
        toastr.success('Recipe added to favorites successfully.');
      }
      console.log('Favorite status updated successfully.');
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };
  
  const updateRecipe = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', newRecipe.title);
    formData.append('description', newRecipe.description);
    formData.append('ingredients', newRecipe.ingredients.split(',').map((ingredient) => ingredient.trim()));
    formData.append('instructions', newRecipe.instructions);
    if (newRecipe.image) {
      formData.append('image', newRecipe.image);
    }
    
    await axios.put(`http://localhost:5000/api/auth/recipe/${editingRecipeId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    closeEditModal();
    toastr.success('Recipe updated successfully!');
    fetchRecipes();
  };

  const deleteRecipe = async () => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/auth/recipe/${deletingRecipeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    closeDeleteConfirmation();
    toastr.success('Recipe deleted successfully!');
    fetchRecipes();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="recipe-crud-container">
      <div className="header-section">
        <h2>Manage Recipes</h2>
        <div className="search-add-container">
          <input
            type="text"
            placeholder="Search Recipes..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
          {isAdmin && (
            <div className='add-recipe-btn'>
              <button onClick={openAddModal} className="add-recipe-button">
              + Add Recipe
            </button>
            </div>
          )}
        </div>
      </div>
  
      {/* Add Recipe Modal */}
      <Modal isOpen={isAddModalOpen} onRequestClose={closeAddModal} className="modal">
        <h3>Add New Recipe</h3>
        <form onSubmit={addRecipe} className="recipe-form">
          <input
            type="text"
            name="title"
            placeholder="Recipe Title"
            value={newRecipe.title}
            onChange={handleInputChange}
            className="input-field"
          />
          {errors.title && <p className="error">{errors.title}</p>}
  
          <textarea
            name="description"
            placeholder="Recipe Description"
            value={newRecipe.description}
            onChange={handleInputChange}
            className="textarea-field"
          />
          {errors.description && <p className="error">{errors.description}</p>}
  
          <input
            type="text"
            name="ingredients"
            placeholder="Ingredients (comma separated)"
            value={newRecipe.ingredients}
            onChange={handleInputChange}
            className="input-field"
          />
          {errors.ingredients && <p className="error">{errors.ingredients}</p>}
  
          <textarea
            name="instructions"
            placeholder="Instructions"
            value={newRecipe.instructions}
            onChange={handleInputChange}
            className="textarea-field"
          />
          {errors.instructions && <p className="error">{errors.instructions}</p>}
  
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          {errors.image && <p className="error">{errors.image}</p>}
          <div className="form-actions">
            <button type="submit" className="submit-button">Add Recipe</button>
            <button type="button" onClick={closeAddModal} className="cancel-button">Cancel</button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={isConfirmDeleteOpen} onRequestClose={closeDeleteConfirmation} className="modal">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this Recipe?</p>
        <button onClick={deleteRecipe}>Confirm</button>
        <button onClick={closeDeleteConfirmation}>Cancel</button>
      </Modal>
      {/* Edit Recipe Modal */}
      <Modal isOpen={isEditModalOpen} onRequestClose={closeEditModal} className="modal">
        <h3>Edit Recipe</h3>
        <form onSubmit={updateRecipe} className="recipe-form">
          <input
            type="text"
            name="title"
            placeholder="Recipe Title"
            value={newRecipe.title}
            onChange={handleInputChange}
            className="input-field"
          />
          {errors.title && <p className="error">{errors.title}</p>}
  
          <textarea
            name="description"
            placeholder="Recipe Description"
            value={newRecipe.description}
            onChange={handleInputChange}
            className="textarea-field"
          />
          {errors.description && <p className="error">{errors.description}</p>}
  
          <input
            type="text"
            name="ingredients"
            placeholder="Ingredients (comma separated)"
            value={newRecipe.ingredients}
            onChange={handleInputChange}
            className="input-field"
          />
          {errors.ingredients && <p className="error">{errors.ingredients}</p>}
  
          <textarea
            name="instructions"
            placeholder="Instructions"
            value={newRecipe.instructions}
            onChange={handleInputChange}
            className="textarea-field"
          />
          {errors.instructions && <p className="error">{errors.instructions}</p>}
  
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
            {errors.image && <p className="error">{errors.image}</p>}

  
          <div className="form-actions">
            <button type="submit" className="submit-button">Update Recipe</button>
            <button type="button" onClick={closeEditModal} className="cancel-button">Cancel</button>
          </div>
        </form>
      </Modal>
  
      <h2>Recipe List</h2>
      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <div key={recipe._id} className="recipe-card">
            <h3>{recipe.title}</h3>
            {recipe.image && (
              <img src={recipe.image} alt={recipe.title} className="recipe-image" />
            )}
            <p className="recipe-description">{recipe.description}</p>
            <p>
              <strong>Ingredients:</strong> {recipe.ingredients.join(', ')}
            </p>
            <p>
              <strong>Instructions:</strong> {recipe.instructions}
            </p>
            <p>
              <strong>
                {recipe.isFavorite ? 'Remove from favorites: ' : 'Add to favorites: '}
              </strong>
              {recipe.isFavorite ? (
                <FaHeart 
                  style={{ color: "red", cursor: 'pointer' }} 
                  onClick={() => toggleFavorite(recipe.isFavorite, recipe._id)}
                />
              ) : (
                <FaRegHeart 
                  style={{ color: "black", cursor: 'pointer' }} 
                  onClick={() => toggleFavorite(recipe.isFavorite, recipe._id)}
                />
              )}
            </p>
            {isAdmin && (
              <div className="recipe-actions">
                <button onClick={() => openEditModal(recipe)} className="edit-button">Edit</button>
                <button onClick={() => openDeleteConfirmation(recipe._id)} className="delete-button">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
  };
  

export default RecipeCRUD;

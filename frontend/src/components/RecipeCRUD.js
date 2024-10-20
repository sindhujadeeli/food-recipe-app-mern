import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './RecipeCRUD.css';
import toastr from 'toastr'; // Import Toastr
import { FaHeart } from "react-icons/fa6";

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

  const deleteRecipe = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/auth/recipe/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toastr.success('Recipe added successfully!');
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
        <h2>Manage Recipes</h2>
        <input
          type="text"
          placeholder="Search Recipes..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
  
        {isAdmin && (
          <button onClick={openAddModal} className="add-recipe-button">Add Recipe</button>
        )}
  
        {/* Add Recipe Modal */}
        <Modal isOpen={isAddModalOpen} onRequestClose={closeAddModal} className="modal">
          <h3>Add New Recipe</h3>
          <form onSubmit={addRecipe}>
            <input
              type="text"
              name="title"
              placeholder="Recipe Title"
              value={newRecipe.title}
              onChange={handleInputChange}
            />
            {errors.title && <p className="error">{errors.title}</p>}
  
            <textarea
              name="description"
              placeholder="Recipe Description"
              value={newRecipe.description}
              onChange={handleInputChange}
            />
            {errors.description && <p className="error">{errors.description}</p>}
  
            <input
              type="text"
              name="ingredients"
              placeholder="Ingredients (comma separated)"
              value={newRecipe.ingredients}
              onChange={handleInputChange}
            />
            {errors.ingredients && <p className="error">{errors.ingredients}</p>}
  
            <textarea
              name="instructions"
              placeholder="Instructions"
              value={newRecipe.instructions}
              onChange={handleInputChange}
            />
            {errors.instructions && <p className="error">{errors.instructions}</p>}
  
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
  
            <button type="submit">Add Recipe</button>
            <button type="button" onClick={closeAddModal}>Cancel</button>
          </form>
        </Modal>
  
        {/* Edit Recipe Modal */}
        <Modal isOpen={isEditModalOpen} onRequestClose={closeEditModal} className="modal">
          <h3>Edit Recipe</h3>
          <form onSubmit={updateRecipe}>
            <input
              type="text"
              name="title"
              placeholder="Recipe Title"
              value={newRecipe.title}
              onChange={handleInputChange}
            />
            {errors.title && <p className="error">{errors.title}</p>}
  
            <textarea
              name="description"
              placeholder="Recipe Description"
              value={newRecipe.description}
              onChange={handleInputChange}
            />
            {errors.description && <p className="error">{errors.description}</p>}
  
            <input
              type="text"
              name="ingredients"
              placeholder="Ingredients (comma separated)"
              value={newRecipe.ingredients}
              onChange={handleInputChange}
            />
            {errors.ingredients && <p className="error">{errors.ingredients}</p>}
  
            <textarea
              name="instructions"
              placeholder="Instructions"
              value={newRecipe.instructions}
              onChange={handleInputChange}
            />
            {errors.instructions && <p className="error">{errors.instructions}</p>}
  
            {/* Display the current image file name */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
  
            <button type="submit">Update Recipe</button>
            <button type="button" onClick={closeEditModal}>Cancel</button>
          </form>
        </Modal>
  
        <h2>Recipe List</h2>
        <ul>
          {filteredRecipes.map((recipe) => (
            <li key={recipe._id} className="recipe-item">
              <h3>{recipe.title}</h3>
              {recipe.image && <img id="recipe-image" src={recipe.image} alt={recipe.title} className="recipe-image" />}
              <p>{recipe.description}</p>
              <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
              <p><strong>Instructions:</strong> {recipe.instructions}</p>
              {/* <FaHeart onClick={() => favRecipe(item)}
                                            style={{ color: (favItems.some(res => res._id === item._id)) ? "red" : "" }} /> */}
                                            <FaHeart 
                                             />
              {isAdmin && (
                <div className="recipe-actions">
                  <button onClick={() => openEditModal(recipe)}>Edit</button>
                  <button onClick={() => deleteRecipe(recipe._id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  

export default RecipeCRUD;

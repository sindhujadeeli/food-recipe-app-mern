import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import heart icons
import './FavoriteRecipes.css'; // Import CSS for styling
import axios from 'axios';
import toastr from 'toastr';
const RecipeList = ({ isAdmin }) => {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);

  // Function to fetch recipes from an API
  const fetchRecipes = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/recipe/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      setRecipes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(); // Fetch recipes when component mounts
  }, []);

  // Function to toggle favorite status
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


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
   <div>
     <h2>Favorite Recipes</h2>
    <div className="recipe-grid">
        {recipes.map((recipe) => (
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
            
          </div>
        ))}
      </div>
   </div>
  );
};

export default RecipeList;

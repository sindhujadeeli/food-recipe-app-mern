import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/auth/recipe',{
        headers: {
            'Authorization': `Bearer ${token}`
          }
    });
    setRecipes(response.data);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Search Recipes</h2>
      <input
        type="text"
        placeholder="Search by recipe title"
        value={searchTerm}
        onChange={handleSearch}
      />

      <ul>
        {filteredRecipes.map((recipe) => (
          <li key={recipe._id}>
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewRecipes;

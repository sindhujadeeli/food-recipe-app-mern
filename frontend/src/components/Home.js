import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home">
        <h1>Welcome to the Food Recipe App</h1>
        <p className="intro-text">
          Explore delicious recipes from around the world. Log in to access personalized recipes and save your favorites.
        </p>

        <div className="features">
          <h2>Features</h2>
          <ul>
            <li>🍽️ <strong>Browse a Variety of Recipes:</strong> Discover recipes from different cuisines and dietary preferences.</li>
            <li>💾 <strong>Save Your Favorites:</strong> Keep track of your preferred recipes for quick access later.</li>
            <li>🔍 <strong>Advanced Search:</strong> Easily find recipes using ingredients, dietary restrictions, or meal types.</li>
            <li>📅 <strong>Meal Planning:</strong> Plan your meals for the week and create shopping lists based on your selected recipes.</li>
            <li>👩‍🍳 <strong>Share Your Recipes:</strong> Contribute your own recipes and share them with the community.</li>
          </ul>
        </div>

        <div className="call-to-action">
          <h2>Get Started!</h2>
          <p>Log in or create an account to begin your culinary adventure!</p>
          <button onClick={() => window.location.href = '/login'} className="login-button">Log In</button>
          <button onClick={() => window.location.href = '/register'} className="signup-button">Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Home;

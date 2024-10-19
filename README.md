# food-recipe-app
BACKEND:
open backend-
change database name or connection string
npm install
node server.js

Test APIs:
---------------------------
1. POST - http://localhost:8000/api/auth/register
{
  "username": "vishnu",
  "email": "vishnu@example.com",
  "password": "password123"
}
return:
{
  "token": "jwt-token-here"
}

2. POST - http://localhost:8000/api/auth/login
{
  "email": "vishnu@example.com",
  "password": "password123"
}
return:
{
  "token": "jwt-token-here"
}
3. GET - http://localhost:8000/api/auth/protected
   
In Headers: Authorization - Bearer <token>

return:
{
  "message": "Welcome to the protected route!"
}

FRONTEND:
-------------------------
open frontend-
npm install
npm start

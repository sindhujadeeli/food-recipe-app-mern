// import React, { useState } from 'react';
// import Register from './components/Register';
// import Login from './components/Login';

// function App() {
//   const [token, setToken] = useState(localStorage.getItem('token'));

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//   };

//   return (
//     <div className="App">
//       <h1>JWT Auth Example</h1>
//       {token ? (
//         <div>
//           <h2>Logged in successfully!</h2>
//           <button onClick={logout}>Logout</button>
//         </div>
//       ) : (
//         <div>
//           <Register />
//           <Login setToken={setToken} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedAPI from './components/ProtectedAPI';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="App">
      <h1>JWT Auth Example</h1>
      {token ? (
        <div>
          <h2>Logged in successfully!</h2>
          <button onClick={logout}>Logout</button>
          <ProtectedAPI /> {/* This will test the protected API */}
        </div>
      ) : (
        <div>
          <Register />
          <Login setToken={setToken} />
        </div>
      )}
    </div>
  );
}

export default App;


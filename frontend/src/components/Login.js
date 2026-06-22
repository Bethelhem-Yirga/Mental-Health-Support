import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, createAnonymousUser } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(email, password);
    }
    
    if (result.success) {
      if (onSuccess) onSuccess();
    } else {
      setError(result.error);
    }
  };
  
  const handleAnonymous = async () => {
    const result = await createAnonymousUser();
    if (result.success && onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={!isLogin}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {!isLogin && (
            <input
              type="text"
              placeholder="Name (optional)"
              // name field not required in this simplified version
            />
          )}
          
          <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
        </form>
        
        <button onClick={() => setIsLogin(!isLogin)} className="switch-btn">
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
        
        <button onClick={handleAnonymous} className="anonymous-btn">
          Continue Anonymously
        </button>
      </div>
    </div>
  );
}

export default Login;
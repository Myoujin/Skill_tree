import { useState } from 'react';
import axios from '../api/axios';

interface Props {
  onAuth: () => void;
}

export default function LoginForm({ onAuth }: Props) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const handle = async (path: string) => {
    try {
      const { data } = await axios.post(path, { email, pw });
      localStorage.setItem('token', data.token);
      setError('');
      onAuth();
    } catch {
      setError('Authentication failed');
    }
  };

  return (
    <div className="p-4 space-y-2 max-w-xs mx-auto">
      <input
        className="border p-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex space-x-2">
        <button
          className="flex-1 bg-gray-200 p-2"
          type="button"
          onClick={() => handle('/api/auth/login')}
        >
          Login
        </button>
        <button
          className="flex-1 bg-gray-200 p-2"
          type="button"
          onClick={() => handle('/api/auth/register')}
        >
          Register
        </button>
      </div>
    </div>
  );
}

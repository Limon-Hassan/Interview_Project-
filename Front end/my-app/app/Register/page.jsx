'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4545/user/register', {
        name,
        email,
        password,
      });
      router.push('/Login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl w-96 p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Register
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border-gray-500 border placeholder:text-gray-500 text-gray-500 p-2 rounded w-full mb-4"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border-gray-500 border placeholder:text-gray-500 text-gray-500 p-2 rounded w-full mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border-gray-500 border placeholder:text-gray-500 text-gray-500 p-2 rounded w-full mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <a
            href="/Login"
            className="text-blue-500 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

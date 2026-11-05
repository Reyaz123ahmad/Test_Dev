import React from 'react'
import axios from 'axios';
import {useState} from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
export default function Signup() {
  const [formData, setFormData] = useState({
    name:'',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try{
            const response = await api.post('/auth/register', formData);
            setSuccess(response.data.message);
            
            setFormData({
                
                email:'',
                password:''
            })
            setLoading(false);
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);

        }catch(error){
            setError(error.response.data.message || 'An error occurred');
            setLoading(false);
        }finally{
            setLoading(false);
        }
    }


    return(
        <div className='min-h-screen bg-gray-700 flex flex-col items-center justify-center p-4'>
            <h2 className='text-center text-white font-medium py-2 font-bold'>Signup Here</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <form onSubmit={handleSubmit} className='flex flex-col gap-3 w-1/2'>
                <div flex flex-col gap-1>
                    <label htmlFor="name" className='text-white font-medium font-bold'>Full Name:</label>
                    <input
                        type="name"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Enter Your Full Name' 
                        required
                        className='w-full flex items-center px-2 py-1 border rounded-md font-medium text-white'
                    />
                </div>

                
                <div>
                    <label htmlFor="email" className='text-white font-medium font-bold'>Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Enter Your Email' 
                        required
                        className='w-full flex items-center px-2 py-1 border rounded-md font-medium text-white'
                    />
                </div>

                <div>
                    <label htmlFor="password" className='text-white font-medium font-bold'>Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='Enter Your Password' 
                        required
                        className='w-full flex items-center px-2 py-1 border rounded-md text-white'
                    />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Signing in...' : 'Signup'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    <Link to="/login" className="text-blue-600">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    )

}
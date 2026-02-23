import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const success = login(username, password);
        if (success) {
            navigate('/list');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black px-4">
            <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.4)] p-8 transform transition-all hover:translate-y-[-2px]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Please sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <div className="relative">
                            {/* <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <User size={18} />
                            </span> */}
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="pl-10 input-field"
                                placeholder="Enter Username"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            {/* <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <Lock size={18} />
                            </span> */}
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <button type="submit" className="w-full btn-primary py-3 text-lg">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>Demo: testuser / Test123</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

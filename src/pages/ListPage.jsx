import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTableData } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, BarChart2, Map as MapIcon, ChevronRight } from 'lucide-react';

const ListPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getTableData();
                console.log('API Result:', result);

                let rawData = [];
                if (result && result.TABLE_DATA && Array.isArray(result.TABLE_DATA.data)) {
                    rawData = result.TABLE_DATA.data;
                } else if (Array.isArray(result)) {
                    rawData = result;
                } else if (result && Array.isArray(result.data)) {
                    rawData = result.data;
                }

                // Map array-of-arrays to objects
                const employeeData = rawData.map(item => {
                    if (Array.isArray(item)) {
                        return {
                            name: item[0] || 'N/A',
                            designation: item[1] || 'Employee',
                            city: item[2] || 'Unknown',
                            salary: item[5] ? item[5].replace(/[$,]/g, '') : '0'
                        };
                    }
                    return item;
                });

                setData(employeeData);
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to fetch data');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-2xl font-bold text-indigo-600">Employee Portal</h1>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/graph')}
                                className="hidden sm:flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                                <BarChart2 size={20} className="mr-1" /> View Graph
                            </button>
                            <button
                                onClick={() => navigate('/map')}
                                className="hidden sm:flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                                <MapIcon size={20} className="mr-1" /> View Map
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                            >
                                <LogOut size={20} className="mr-1" /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">Employee List</h2>
                    <div className="flex sm:hidden w-full gap-2">
                        <button onClick={() => navigate('/graph')} className="flex-1 btn-primary py-2 px-2 text-sm flex items-center justify-center">
                            <BarChart2 size={16} className="mr-1" /> Graph
                        </button>
                        <button onClick={() => navigate('/map')} className="flex-1 btn-primary py-2 px-2 text-sm flex items-center justify-center">
                            <MapIcon size={16} className="mr-1" /> Map
                        </button>
                    </div>
                </div>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                ) : Array.isArray(data) && data.length > 0 ? (
                    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                        <ul className="divide-y divide-gray-200">
                            {data.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => navigate(`/details/${index}`, { state: { employee: item } })}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold uppercase">
                                                {item.name?.[0] || 'E'}
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-indigo-600 truncate">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.designation || item.role || 'Employee'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="text-right mr-4 hidden sm:block">
                                                <p className="text-sm text-gray-900 font-semibold">{item.salary ? `₹${item.salary}` : 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{item.city || 'Location N/A'}</p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500">No employee records found.</p>
                        <button onClick={() => window.location.reload()} className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium">
                            Try refreshing the page
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ListPage;

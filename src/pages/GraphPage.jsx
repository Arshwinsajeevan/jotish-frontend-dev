import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTableData } from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { ArrowLeft } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const GraphPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getTableData();
                let rawData = [];
                if (result && result.TABLE_DATA && Array.isArray(result.TABLE_DATA.data)) {
                    rawData = result.TABLE_DATA.data;
                } else if (Array.isArray(result)) {
                    rawData = result;
                } else if (result && Array.isArray(result.data)) {
                    rawData = result.data;
                }

                const employees = rawData.map(item => {
                    if (Array.isArray(item)) {
                        return {
                            name: item[0] || 'N/A',
                            salary: item[5] ? parseFloat(item[5].replace(/[$,]/g, '')) : 0
                        };
                    }
                    return item;
                });

                setData(employees.slice(0, 10));
                setLoading(false);
            } catch (err) {
                console.error('Graph fetch error:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartData = {
        labels: (Array.isArray(data) ? data : []).map(emp => emp.name || 'Unknown'),
        datasets: [
            {
                label: 'Salary (₹)',
                data: (Array.isArray(data) ? data : []).map(emp => emp.salary || 0),
                backgroundColor: 'rgba(79, 70, 229, 0.7)',
                borderColor: 'rgb(79, 70, 229)',
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Employee Salary Comparison (Top 10)',
                font: { size: 18, weight: 'bold' }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `₹${value.toLocaleString()}`
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/list')}
                    className="flex items-center text-gray-600 hover:text-indigo-600 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to List
                </button>

                <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl">
                    {loading ? (
                        <div className="h-96 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : (
                        <div className="h-[500px]">
                            <Bar data={chartData} options={options} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GraphPage;

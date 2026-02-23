import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTableData } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, MapPin } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Mock coordinates for cities if the API doesn't provide them
    // The API likely returns city names. We'll map common ones or use a fallback.
    const cityCoords = {
        'Mumbai': [19.0760, 72.8777],
        'Delhi': [28.6139, 77.2090],
        'Bangalore': [12.9716, 77.5946],
        'Hyderabad': [17.3850, 78.4867],
        'Ahmedabad': [23.0225, 72.5714],
        'Chennai': [13.0827, 80.2707],
        'Kolkata': [22.5726, 88.3639],
        'Pune': [18.5204, 73.8567],
        'Jaipur': [26.9124, 75.7873],
        'Lucknow': [26.8467, 80.9462],
    };

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
                            designation: item[1] || 'Employee',
                            city: item[2] || 'Unknown'
                        };
                    }
                    return item;
                });

                setData(employees);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="p-4 sm:p-8 flex items-center justify-between bg-white border-b sticky top-0 z-[1001]">
                <button
                    onClick={() => navigate('/list')}
                    className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to List
                </button>
                <h1 className="text-xl font-bold text-gray-800 flex items-center">
                    <MapPin className="text-indigo-600 mr-2" size={24} /> Employee Locations
                </h1>
                <div className="w-24"></div> {/* Spacer */}
            </div>

            <div className="flex-1 relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <MapContainer
                        center={[20.5937, 78.9629]}
                        zoom={5}
                        className="h-full w-full"
                        style={{ minHeight: 'calc(100vh - 88px)' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {Array.isArray(data) && data.map((emp, index) => {
                            const coords = cityCoords[emp.city] || [
                                20.5937 + (Math.random() - 0.5) * 10,
                                78.9629 + (Math.random() - 0.5) * 10
                            ];
                            return (
                                <Marker key={index} position={coords}>
                                    <Popup>
                                        <div className="p-1">
                                            <h3 className="font-bold text-indigo-600">{emp.name}</h3>
                                            <p className="text-sm text-gray-600">{emp.designation}</p>
                                            <p className="text-xs font-semibold mt-1">📍 {emp.city}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                )}
            </div>
        </div>
    );
};

export default MapPage;

import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';

const PhotoPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const capturedImage = location.state?.capturedImage;

    if (!capturedImage) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-gray-600 mb-6">No image captured yet</p>
                <button onClick={() => navigate('/list')} className="btn-primary">Go to List</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="text-green-600" size={32} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Photo Captured!</h1>

                <div className="bg-white p-4 rounded-2xl shadow-2xl mb-10 overflow-hidden transform transition-all hover:rotate-1">
                    <img
                        src={capturedImage}
                        alt="Captured Employee"
                        className="w-full h-auto rounded-xl shadow-inner border"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-indigo-200"
                    >
                        <RefreshCw className="mr-2" size={20} /> Retake Photo
                    </button>
                    <button
                        onClick={() => navigate('/list')}
                        className="flex items-center justify-center bg-white border-2 border-gray-200 hover:border-indigo-600 text-gray-700 hover:text-indigo-600 font-bold py-3 px-8 rounded-xl transition-all"
                    >
                        <ArrowLeft className="mr-2" size={20} /> Back to List
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PhotoPage;

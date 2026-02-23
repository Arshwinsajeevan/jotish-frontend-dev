import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, RefreshCw } from 'lucide-react';

const DetailsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [employee, setEmployee] = useState(location.state?.employee || null);
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState('');

    const startCamera = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError("Your browser does not support camera access or it's restricted to secure contexts (HTTPS).");
            setShowCamera(true);
            return;
        }
        try {
            const constraints = {
                video: { facingMode: 'user' },
                audio: false
            };
            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
            setShowCamera(true);
            setError('');
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please ensure permissions are granted.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCamera(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/png');
            stopCamera();
            navigate('/photo', { state: { capturedImage: imageData } });
        }
    };

    if (!employee) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <p className="text-gray-600 mb-4">No employee data found</p>
                <button onClick={() => navigate('/list')} className="btn-primary">Back to List</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/list')}
                    className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to List
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 h-32 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]"></div>
                    </div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-6">
                            <div className="h-32 w-32 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-700 shadow-xl transition-transform hover:scale-105 duration-300">
                                {employee.name?.[0] || 'E'}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{employee.name}</h1>
                                <p className="text-lg text-indigo-600 font-medium mb-6">{employee.designation || employee.role || 'Senior Employee'}</p>

                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Salary</span>
                                        <span className="text-xl text-gray-800 font-bold">₹{employee.salary || 'N/A'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</span>
                                        <span className="text-lg text-gray-700">{employee.city || 'Not Specified'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-end">
                                {!showCamera ? (
                                    <button
                                        onClick={startCamera}
                                        className="w-full btn-primary flex items-center justify-center py-4 text-lg"
                                    >
                                        <Camera className="mr-2" /> Capture Photo
                                    </button>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="relative rounded-lg overflow-hidden bg-black aspect-video border-2 border-indigo-500 shadow-inner">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                className="w-full h-full object-cover"
                                            />
                                            {error && (
                                                <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/60">
                                                    <p className="text-white text-center text-sm">{error}</p>
                                                </div>
                                            )}
                                        </div>
                                        <canvas ref={canvasRef} className="hidden" />
                                        <div className="flex gap-4">
                                            <button
                                                onClick={capturePhoto}
                                                className="flex-1 btn-primary py-3"
                                                disabled={!!error}
                                            >
                                                Snap Photo
                                            </button>
                                            <button
                                                onClick={stopCamera}
                                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;

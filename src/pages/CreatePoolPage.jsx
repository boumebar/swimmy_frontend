import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../utils/useAuth';
import api from '../utils/api';
import { uploadToCloudinary } from '../utils/cloudinary';

export default function CreatePoolPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    latitude: 0,
    longitude: 0,
    capacity: 1,
    pricePerHour: 0,
    pricePerDay: 0,
    pricePerWeek: null,
    photos: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('price') || name.includes('capacity') || name.includes('latitude') || name.includes('longitude') 
        ? parseFloat(value) 
        : value,
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const photoUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, photoUrl],
      }));
    } catch (err) {
      setError('Photo upload failed');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/pools', formData);
      navigate(`/pools/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create pool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🏊 SWIMMY</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.name}!</span>
            
            <a href="/"
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Browse Pools
            </a>
            
            <a href="/profile"
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Profile
            </a>
            <button
              onClick={() => {
                logout();
                window.location.href = '/auth';
              }}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Create Pool</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          {/* Basic Info */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Pool Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Olympic Pool in Algiers"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your pool..."
              rows="4"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g., Downtown Algiers"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Latitude</label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                step="0.0001"
                placeholder="36.7372"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Longitude</label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                step="0.0001"
                placeholder="3.0869"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Pool Details */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Capacity (people) *</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              placeholder="50"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Price/Hour (DZD)</label>
              <input
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleChange}
                min="0"
                placeholder="500"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Price/Day (DZD) *</label>
              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                min="0"
                placeholder="5000"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Price/Week (DZD)</label>
              <input
                type="number"
                name="pricePerWeek"
                value={formData.pricePerWeek || ''}
                onChange={handleChange}
                min="0"
                placeholder="30000"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Photos</label>
            <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="hidden"
                id="photo-input"
              />
              <label htmlFor="photo-input" className="cursor-pointer">
                <p className="text-gray-600">
                  {uploadingPhoto ? 'Uploading...' : 'Click to upload or drag photos'}
                </p>
              </label>
            </div>

            {/* Photo Thumbnails */}
            {formData.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Pool photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Pool'}
          </button>
        </form>
      </div>
    </div>
  );
}

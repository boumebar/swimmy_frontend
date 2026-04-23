import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../utils/useAuth';
import api from '../utils/api';
import { uploadToCloudinary } from '../utils/cloudinary';

export default function EditPoolPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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

  useEffect(() => {
    const fetchPool = async () => {
      try {
        const res = await api.get(`/pools/${id}`);
        setPool(res.data);
        setFormData({
          title: res.data.title,
          description: res.data.description,
          address: res.data.address,
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          capacity: res.data.capacity,
          pricePerHour: res.data.pricePerHour,
          pricePerDay: res.data.pricePerDay,
          pricePerWeek: res.data.pricePerWeek,
          photos: res.data.photos || [],
        });
      } catch (err) {
        console.error('Error fetching pool:', err);
        setError('Pool not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPool();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading pool...
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Pool not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Pools
          </button>
        </div>
      </div>
    );
  }

  if (pool.ownerId !== user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">You can only edit your own pools</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Pools
          </button>
        </div>
      </div>
    );
  }

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
    setSubmitting(true);
    setError('');

    try {
      await api.patch(`/pools/${id}`, formData);
      navigate(`/pools/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update pool');
    } finally {
      setSubmitting(false);
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
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-700 font-bold"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-bold mb-6">Edit Pool</h2>

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
            disabled={submitting}
            className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
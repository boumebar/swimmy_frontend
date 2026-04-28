import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../utils/useAuth';
import api from '../utils/api';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import BookingForm from '../components/BookingForm';
import BookingConfirmation from '../components/BookingConfirmation';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    notes: '',
  });

  const [summary, setSummary] = useState({
    nights: 0,
    totalPrice: 0,
  });

  const errorRef = useRef(null);

  // Auto-scroll to error message
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  useEffect(() => {
    const fetchPool = async () => {
      try {
        const res = await api.get(`/pools/${id}`);
        setPool(res.data);
      } catch (err) {
        console.error('Error fetching pool:', err);
        setError('Pool not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPool();
  }, [id]);

  const handleDateSelect = (startDate, endDate) => {
    // Check if endDate is before startDate
    if (endDate < startDate) {
      setFormData((prev) => ({
        ...prev,
        startDate: '',
        endDate: '',
      }));
      setSummary({ nights: 0, totalPrice: 0 });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }));

    // Calculate summary
    let nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    nights = nights === 0 ? 1 : nights; // Minimum 1 night
    const totalPrice = pool ? pool.pricePerDay * nights : 0;
    setSummary({ nights, totalPrice });
  };

  const handleStartDateChange = (value) => {
    setFormData((prev) => ({ ...prev, startDate: value }));
    updateSummary({ ...formData, startDate: value });
  };

  const handleEndDateChange = (value) => {
    setFormData((prev) => ({ ...prev, endDate: value }));
    updateSummary({ ...formData, endDate: value });
  };


  const updateSummary = (data) => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      // Check if endDate is before startDate
      if (end < start) {
        setSummary({ nights: 0, totalPrice: 0 });
        return;
      }

      let nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      nights = nights === 0 ? 1 : nights; // Minimum 1 night
      const totalPrice = pool ? pool.pricePerDay * nights : 0;
      setSummary({ nights, totalPrice });
    }
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setError('');

    try {
      const bookingData = {
        poolId: id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime || null,
        endTime: formData.endTime || null,
        notes: formData.notes || null,
      };

      await api.post('/bookings', bookingData);
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
      setShowConfirmation(false);
    } finally {
      setSubmitting(false);
    }
  };

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

  if (pool.ownerId === user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">You cannot book your own pool</p>
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

            <a href="/my-bookings"
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              My Bookings
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

      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-700 font-bold"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-6">Book: {pool.title}</h1>

        {error && (
          <div
            ref={errorRef}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="col-span-2">
            <AvailabilityCalendar
              poolId={id}
              onDateSelect={handleDateSelect}
            />

            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-xl font-bold mb-4">Booking Details</h3>
              <BookingForm
                startDate={formData.startDate}
                endDate={formData.endDate}
                startTime={formData.startTime}
                endTime={formData.endTime}
                notes={formData.notes}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                onStartTimeChange={(value) =>
                  setFormData((prev) => ({ ...prev, startTime: value }))
                }
                onEndTimeChange={(value) =>
                  setFormData((prev) => ({ ...prev, endTime: value }))
                }
                onNotesChange={(value) =>
                  setFormData((prev) => ({ ...prev, notes: value }))
                }
              />

              <button
                onClick={async () => {
                  // Validate dates before showing modal
                  if (!formData.startDate || !formData.endDate) {
                    setError('Please select both dates');
                    return;
                  }

                  const start = new Date(formData.startDate);
                  const end = new Date(formData.endDate);

                  // Check if endDate is before startDate
                  if (end < start) {
                    setError('Check-out date must be after check-in date');
                    return;
                  }

                  // If all validations pass, show modal
                  setError('');
                  setShowConfirmation(true);
                }}
                className="w-full mt-6 bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700"
              >
                Continue to Confirmation
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow p-6 sticky top-6 h-fit">
            <h3 className="text-xl font-bold mb-4">Booking Summary</h3>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm">Pool</p>
                <p className="font-bold">{pool.title}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Address</p>
                <p className="font-bold text-sm">{pool.address}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-gray-600 text-sm">Check-in</p>
                <p className="font-bold">
                  {formData.startDate
                    ? new Date(formData.startDate).toLocaleDateString()
                    : '-'}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Check-out</p>
                <p className="font-bold">
                  {formData.endDate
                    ? new Date(formData.endDate).toLocaleDateString()
                    : '-'}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-gray-600 text-sm">Nights</p>
                <p className="text-2xl font-bold text-blue-600">
                  {summary.nights}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Price/Night</p>
                <p className="font-bold">
                  {pool.pricePerDay.toLocaleString()} DZD
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-gray-600 text-sm mb-2">Total Price</p>
              <p className="text-3xl font-bold text-green-600">
                {summary.totalPrice.toLocaleString()} DZD
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <BookingConfirmation
          pool={pool}
          startDate={formData.startDate}
          endDate={formData.endDate}
          startTime={formData.startTime}
          endTime={formData.endTime}
          notes={formData.notes}
          onConfirm={handleConfirmBooking}
          onCancel={() => setShowConfirmation(false)}
          loading={submitting}
        />
      )}
    </div>
  );
}
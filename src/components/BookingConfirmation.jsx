export default function BookingConfirmation({
  pool,
  startDate,
  endDate,
  startTime,
  endTime,
  notes,
  onConfirm,
  onCancel,
  loading,
}) {
  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const totalPrice = pool ? pool.pricePerDay * nights : 0;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '24px',
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            Confirm Booking
          </h2>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Pool Info */}
          <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
              {pool?.title}
            </h3>
            <p style={{ color: '#4b5563', marginBottom: '16px' }}>
              {pool?.address}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Capacity</p>
                <p style={{ fontWeight: 'bold' }}>{pool?.capacity} people</p>
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Price/Night</p>
                <p style={{ fontWeight: 'bold' }}>
                  {pool?.pricePerDay.toLocaleString()} DZD
                </p>
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Price/Hour</p>
                <p style={{ fontWeight: 'bold' }}>
                  {pool?.pricePerHour.toLocaleString()} DZD
                </p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '24px' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Booking Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Check-in</p>
                <p style={{ fontWeight: 'bold' }}>
                  {startDate ? new Date(startDate).toLocaleDateString() : '-'}
                </p>
                {startTime && (
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>{startTime}</p>
                )}
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Check-out</p>
                <p style={{ fontWeight: 'bold' }}>
                  {endDate ? new Date(endDate).toLocaleDateString() : '-'}
                </p>
                {endTime && (
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>{endTime}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '24px' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Notes</h4>
              <p style={{ color: '#374151' }}>{notes}</p>
            </div>
          )}

          {/* Price */}
          <div style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '4px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6b7280' }}>
                  {pool?.pricePerDay.toLocaleString()} DZD × {nights} nights
                </span>
                <span style={{ fontWeight: 'bold' }}>
                  {totalPrice.toLocaleString()} DZD
                </span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total Price</span>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>
                  {totalPrice.toLocaleString()} DZD
                </span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fcd34d',
            color: '#92400e',
            padding: '16px',
            borderRadius: '4px',
          }}>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>💰 Payment Methods (MVP)</p>
            <ul style={{ fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
              <li>Cash on arrival</li>
              <li>Bank transfer (details provided after confirmation)</li>
            </ul>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
            <button
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: '#d1d5db',
                color: '#1f2937',
                padding: '12px 24px',
                borderRadius: '4px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '4px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
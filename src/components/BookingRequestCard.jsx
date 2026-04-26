import { useState } from 'react';
import api from '../utils/api';

export default function BookingRequestCard({ booking, onUpdate }) {
    const [updating, setUpdating] = useState(false);

    const handleStatusChange = async (status) => {
        setUpdating(true);
        try {
            await api.patch(`/bookings/${booking.id}`, { status });
            onUpdate();
        } catch (err) {
            console.error('Error updating booking:', err);
        } finally {
            setUpdating(false);
        }
    };

    const nights = Math.ceil(
        (new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)
    );

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            marginBottom: '16px',
            border: booking.status === 'pending' ? '2px solid #fbbf24' : 'none',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e5e7eb',
            }}>
                <div>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        margin: '0 0 8px 0',
                    }}>
                        {booking.pool?.title}
                    </h3>
                    <p style={{
                        color: '#6b7280',
                        margin: '0',
                        fontSize: '14px',
                    }}>
                        {booking.pool?.address}
                    </p>
                </div>
                <div style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: booking.status === 'pending' ? '#fef3c7' :
                        booking.status === 'confirmed' ? '#dcfce7' : '#fee2e2',
                    color: booking.status === 'pending' ? '#92400e' :
                        booking.status === 'confirmed' ? '#166534' : '#991b1b',
                }}>
                    {booking.status.toUpperCase()}
                </div>
            </div>

            {/* Renter Info */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '24px',
            }}>
                <div>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        margin: '0 0 4px 0',
                    }}>Renter</p>
                    <p style={{
                        fontWeight: 'bold',
                        margin: '0 0 4px 0',
                    }}>
                        {booking.renter?.name}
                    </p>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        margin: '0',
                    }}>
                        {booking.renter?.email}
                    </p>
                    {booking.renter?.phone && (
                        <p style={{
                            color: '#6b7280',
                            fontSize: '14px',
                            margin: '4px 0 0 0',
                        }}>
                            {booking.renter.phone}
                        </p>
                    )}
                </div>

                {/* Dates */}
                <div>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        margin: '0 0 4px 0',
                    }}>Dates</p>
                    <p style={{
                        fontWeight: 'bold',
                        margin: '0',
                    }}>
                        {new Date(booking.startDate).toLocaleDateString()}
                    </p>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        margin: '0',
                    }}>
                        to {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        margin: '4px 0 0 0',
                    }}>
                        ({nights} nights)
                    </p>
                </div>
            </div>

            {/* Pricing */}
            <div style={{
                backgroundColor: '#f3f4f6',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                }}>
                    <span style={{ color: '#6b7280' }}>
                        {booking.pool?.pricePerDay.toLocaleString()} DZD × {nights} nights
                    </span>
                    <span style={{ fontWeight: 'bold' }}>
                        {booking.totalPrice.toLocaleString()} DZD
                    </span>
                </div>
            </div>

            {/* Notes */}
            {booking.notes && (
                <div style={{
                    backgroundColor: '#eff6ff',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    borderLeft: '4px solid #3b82f6',
                }}>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        margin: '0 0 4px 0',
                    }}>Notes from renter:</p>
                    <p style={{
                        margin: '0',
                        color: '#1f2937',
                    }}>
                        {booking.notes}
                    </p>
                </div>
            )}

            {/* Actions */}
            {booking.status === 'pending' && (
                <div style={{
                    display: 'flex',
                    gap: '12px',
                }}>
                    <button
                        onClick={() => handleStatusChange('confirmed')}
                        disabled={updating}
                        style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            opacity: updating ? 0.5 : 1,
                        }}
                    >
                        ✓ Accept
                    </button>
                    <button
                        onClick={() => handleStatusChange('cancelled')}
                        disabled={updating}
                        style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            opacity: updating ? 0.5 : 1,
                        }}
                    >
                        ✕ Decline
                    </button>
                </div>
            )}
        </div>
    );
}
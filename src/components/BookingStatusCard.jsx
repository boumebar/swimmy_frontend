export default function BookingStatusCard({ booking }) {
    const nights = Math.ceil(
        (new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)
    );

    const statusConfig = {
        confirmed: {
            color: '#10b981',
            bgColor: '#d1fae5',
            icon: '✓',
            label: 'Confirmed',
        },
        cancelled: {
            color: '#ef4444',
            bgColor: '#fee2e2',
            icon: '✕',
            label: 'Cancelled',
        },
        pending: {
            color: '#f59e0b',
            bgColor: '#fef3c7',
            icon: '⏳',
            label: 'Pending',
        },
    };

    const config = statusConfig[booking.status] || statusConfig.pending;

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            marginBottom: '16px',
            borderLeft: `4px solid ${config.color}`,
        }}>
            {/* Header with Status */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
            }}>
                <div>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        margin: '0 0 4px 0',
                    }}>
                        {booking.pool?.title}
                    </h3>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        margin: '0',
                    }}>
                        {booking.pool?.address}
                    </p>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: config.bgColor,
                    borderRadius: '20px',
                    color: config.color,
                    fontWeight: 'bold',
                    fontSize: '14px',
                }}>
                    <span style={{ fontSize: '18px' }}>{config.icon}</span>
                    {config.label}
                </div>
            </div>

            {/* Key Info Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '16px',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e5e7eb',
            }}>
                {/* Dates */}
                <div>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        margin: '0 0 4px 0',
                    }}>Check-in</p>
                    <p style={{
                        fontWeight: 'bold',
                        margin: '0',
                        fontSize: '16px',
                    }}>
                        {new Date(booking.startDate).toLocaleDateString()}
                    </p>
                    {booking.startTime && (
                        <p style={{
                            color: '#6b7280',
                            fontSize: '12px',
                            margin: '4px 0 0 0',
                        }}>
                            {booking.startTime}
                        </p>
                    )}
                </div>

                <div>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        margin: '0 0 4px 0',
                    }}>Check-out</p>
                    <p style={{
                        fontWeight: 'bold',
                        margin: '0',
                        fontSize: '16px',
                    }}>
                        {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    {booking.endTime && (
                        <p style={{
                            color: '#6b7280',
                            fontSize: '12px',
                            margin: '4px 0 0 0',
                        }}>
                            {booking.endTime}
                        </p>
                    )}
                </div>

                <div>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        margin: '0 0 4px 0',
                    }}>Duration</p>
                    <p style={{
                        fontWeight: 'bold',
                        margin: '0',
                        fontSize: '16px',
                    }}>
                        {nights} night{nights !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Contact Info */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e5e7eb',
            }}>
                <div>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        margin: '0 0 4px 0',
                    }}>
                        {booking.renterId === booking.ownerId ? 'Owner' : 'Contact Person'}
                    </p>
                    <p style={{
                        fontWeight: 'bold',
                        margin: '0 0 2px 0',
                    }}>
                        {booking.renterId === booking.ownerId ? booking.owner?.name : booking.renter?.name}
                    </p>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        margin: '0',
                    }}>
                        {booking.renterId === booking.ownerId ? booking.owner?.email : booking.renter?.email}
                    </p>
                </div>

                {/* Price */}
                <div>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        margin: '0 0 4px 0',
                    }}>Total Price</p>
                    <p style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#10b981',
                        margin: '0',
                    }}>
                        {booking.totalPrice.toLocaleString()} DZD
                    </p>
                </div>
            </div>

            {/* Notes */}
            {booking.notes && (
                <div style={{
                    backgroundColor: '#f0f9ff',
                    padding: '12px',
                    borderRadius: '6px',
                    borderLeft: '4px solid #3b82f6',
                }}>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        margin: '0 0 4px 0',
                    }}>📝 Notes:</p>
                    <p style={{
                        margin: '0',
                        color: '#1f2937',
                        fontSize: '14px',
                    }}>
                        {booking.notes}
                    </p>
                </div>
            )}
        </div>
    );
}
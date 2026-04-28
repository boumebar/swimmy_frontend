import useAuth from '../utils/useAuth';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
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


                    <a href="/owner-dashboard"
                        className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-600"
                    >
                        My Pools
                    </a>


                    <a href="/renter-dashboard"
                        className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
                    >
                        My Bookings
                    </a>


                    <a href="/inbox"
                        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Messages
                    </a >


                    <a href="/profile"
                        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Profile
                    </a >

                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/auth';
                        }}
                        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div >
            </div >
        </nav >
    );
}
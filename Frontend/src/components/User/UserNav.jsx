import { useState } from 'react';
import { Menu, X, User, History, LayoutDashboard, LogOut, CirclePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function UserNav() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const handleDash = () => {
        navigate('/driver')
    }
    const handleProf = () => {
        navigate('/driver')
    }
    const handleHist = () => {
        navigate('/driver')
    }
    const handleDriv = () => {
        navigate('/driver')
    }
    const logout = () => {
        localStorage.clear()
        navigate("/");
    }

  const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, handle: handleDash },
        { name: 'Profile', icon: User,  handle: handleProf },
        { name: 'History', icon: History,  handle: handleHist },
        { name: 'Join as Driver', icon: CirclePlus,  handle: handleDriv },
    ];

        return (
            <nav className="bg-black shadow-xl border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="text-white text-2xl sm:text-3xl font-bold ">
                                RideZ
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                {navItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <button
                                            key={item.name}
                                            className="text-[#068fff] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out flex items-center space-x-2 group"
                                        onClick={item.handle}>
                                            <IconComponent size={18} className="group-hover:scale-110 transition-transform duration-200" />
                                            <span>{item.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out flex items-center space-x-2 shadow-lg hover:shadow-red-500/25 hover:scale-105" onClick={logout}>
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200"
                            >
                                {isMobileMenuOpen ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </button>
                        </div>
                    </div>
                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t border-gray-800 mt-2">
                            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/50 rounded-lg mt-2 backdrop-blur-sm">
                                {navItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <button
                                            key={item.name}
                                            className="text-[#068fff] block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 w-full text-left flex items-center space-x-3"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <IconComponent size={20} />
                                            <span>{item.name}</span>
                                        </button>
                                    );
                                })}
                                <div className="pt-2 border-t border-gray-700">
                                    <button
                                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 w-full flex items-center justify-center space-x-2 shadow-lg"
                                        onClick={logout}
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        );
    }

    export default UserNav;
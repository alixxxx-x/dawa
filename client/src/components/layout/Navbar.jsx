import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import api from "@/api/api";
import { ACCESS_TOKEN } from "@/constants";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import logoIcon from "@/assets/logo.png";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                if (token) {
                    const res = await api.get('/api/auth/me/');
                    setUserInfo(res.data);
                } else {
                    setUserInfo(null);
                }
            } catch {
                setUserInfo(null);
            }
        };
        fetchProfile();
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.clear();
        setUserInfo(null);
        navigate("/login");
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Find Medicine", path: "/search/medicine" },
        { name: "Products", path: "/search/products" },
        { name: "About", path: "/about" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                    <img src={logoIcon} alt="Dawa" className="h-16 w-auto object-contain outline-none" />
                </Link>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-3 py-2 rounded-md font-bold text-[13px] transition-colors ${
                                location.pathname === link.path
                                    ? "text-primary bg-slate-50/50"
                                    : "text-slate-600 hover:text-primary"
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="h-4 w-px bg-slate-200 mx-1" />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full w-9 h-9 text-slate-500 hover:text-primary hover:bg-slate-50 transition-all shadow-none"
                    >
                        {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    <div className="h-4 w-px bg-slate-200 mx-1" />

                    {userInfo ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-auto flex items-center gap-2.5 pl-1 pr-3.5 hover:bg-slate-50 rounded-full group transition-all duration-200">
                                    <Avatar className="h-8 w-8 border border-white shadow-sm ring-1 ring-slate-100 group-hover:ring-primary/20 transition-all">
                                        <AvatarFallback className="bg-secondary text-white text-[10px] font-medium uppercase">
                                            {(userInfo.name || userInfo.phone || 'U').charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-left hidden lg:block pr-1">
                                        <p className="text-xs font-semibold text-slate-900 leading-none mb-1">{userInfo.name || userInfo.phone}</p>
                                        <p className="text-[10px] text-primary font-medium capitalize">{userInfo.role || 'Patient'}</p>
                                    </div>
                                    <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-primary transition-colors" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mt-2 rounded-2xl p-2 shadow-2xl border-slate-100 bg-white" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal px-3 py-3">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-bold text-slate-900 leading-none">{userInfo.name || 'User'}</p>
                                        <p className="text-xs text-slate-500 truncate">{userInfo.phone}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-50" />
                                {userInfo.role === 'pharmacist' && (
                                    <DropdownMenuItem asChild>
                                        <Link to="/pharmacist/dashboard" className="cursor-pointer font-medium text-sm text-slate-700 p-2.5 rounded-xl flex items-center hover:bg-slate-50 transition-colors w-full">
                                            <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link to="/profile" className="cursor-pointer font-medium text-sm text-slate-700 p-2.5 rounded-xl flex items-center hover:bg-slate-50 transition-colors w-full">
                                        <User className="mr-3 h-4 w-4 text-primary" />
                                        My Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-50" />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer font-semibold text-sm text-red-600 p-2.5 rounded-xl flex items-center hover:bg-red-50 focus:bg-red-50 transition-colors w-full">
                                    <LogOut className="mr-3 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <Button variant="ghost" className="text-[13px] font-medium text-slate-600 hover:text-primary transition-colors px-4 h-9 shadow-none">
                                    Log In
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-secondary hover:bg-secondary/90 text-white text-[13px] font-bold rounded-full px-6 h-9 shadow-lg shadow-secondary/20 active:scale-95 transition-all border-none">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile button */}
                <button
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-100 p-6 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`block py-3.5 px-4 rounded-xl text-[13px] font-bold transition-all ${
                                location.pathname === link.path ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"
                            }`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="h-px bg-slate-100 my-4" />

                    {userInfo ? (
                        <div className="space-y-4 px-2">
                            <div className="flex items-center gap-4 py-2">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-secondary text-white font-medium">
                                        {(userInfo.name || userInfo.phone || 'U').charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{userInfo.name || userInfo.phone}</p>
                                    <p className="text-xs text-primary font-medium capitalize">{userInfo.role || 'Patient'}</p>
                                </div>
                            </div>
                            {userInfo.role === 'pharmacist' && (
                                <Link to="/pharmacist/dashboard" className="block py-3.5 px-2 text-[13px] font-bold text-primary" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                            )}
                            <Link to="/profile" className="block py-3.5 px-2 text-[13px] font-bold text-primary" onClick={() => setMenuOpen(false)}>My Profile</Link>
                            <button onClick={handleLogout} className="block w-full text-left py-3.5 px-2 text-[13px] font-bold text-red-600">Logout</button>
                        </div>
                    ) : (
                        <div className="space-y-3 pt-2">
                            <Link to="/login" className="block w-full text-center py-3.5 border border-slate-100 hover:bg-slate-50 rounded-xl font-medium text-[13px] text-slate-900 transition-all" onClick={() => setMenuOpen(false)}>Log In</Link>
                            <Link to="/signup" className="block w-full text-center py-3.5 bg-secondary hover:bg-secondary/95 rounded-xl font-bold text-[13px] text-white shadow-xl shadow-secondary/10 transition-all" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

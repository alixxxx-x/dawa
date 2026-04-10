import { Link } from "react-router-dom";
import logoIcon from "@/assets/logo.png";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">

                    <div className="space-y-4">
                        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                            <img src={logoIcon} alt="Dawa" className="h-10 w-auto object-contain outline-none" />
                        </Link>
                        <p className="leading-relaxed text-gray-400">
                            Algeria's trusted platform for finding medicines and parapharmacy products at pharmacies near you — in real time.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold uppercase tracking-wider mb-6 text-xs">Explore</h3>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="/search/medicine" className="hover:text-primary transition-colors">Find a Medicine</Link></li>
                            <li><Link to="/search/products" className="hover:text-primary transition-colors">Parapharmacy Products</Link></li>
                            <li><Link to="/about" className="hover:text-primary transition-colors">How it Works</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold uppercase tracking-wider mb-6 text-xs">Account</h3>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="/signup" className="hover:text-primary transition-colors">Create an Account</Link></li>
                            <li><Link to="/login" className="hover:text-primary transition-colors">Patient Login</Link></li>
                            <li><Link to="/pharmacist/login" className="hover:text-primary transition-colors">Pharmacist Portal</Link></li>
                            <li><Link to="/profile" className="hover:text-primary transition-colors">My Profile</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold uppercase tracking-wider mb-6 text-xs">Contact Us</h3>
                        <ul className="space-y-3 text-gray-400">
                            <li>Email: <a href="mailto:support@dawa.dz" className="hover:text-primary transition-colors">support@dawa.dz</a></li>
                            <li>Phone: <span>+213 555 000 000</span></li>
                            <li>Address: <span>Constantine, Algeria</span></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
                    <p>© 2026 Dawa Platform. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

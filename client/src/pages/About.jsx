import {
    Users, Target, Award, Rocket,
    ArrowRight, Heart, Brain, Zap, Briefcase, MapPin, Pill, ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const team = [
    {
        name: "Dr. Yacine Merzouk",
        role: "Founder & CEO",
        initials: "YM",
        bio: "Pharmacist turned entrepreneur, driven by the vision of making every medicine findable in Algeria within seconds.",
        tag: "Founder"
    },
    {
        name: "Amina Benkhelifa",
        role: "Head of Product",
        initials: "AB",
        bio: "Building intuitive experiences that connect patients with the right pharmacy, every single time.",
        tag: "Product"
    },
    {
        name: "Riad Touati",
        role: "Lead Engineer",
        initials: "RT",
        bio: "Architecting the real-time availability engine powering Dawa's stock network across all 58 wilayas.",
        tag: "Engineering"
    }
];

const stats = [
    { label: "Partner Pharmacies", value: "800+", icon: ShieldCheck },
    { label: "Medicines Tracked",  value: "1 000+", icon: Pill },
    { label: "Active Patients",    value: "25k+", icon: Users },
    { label: "Wilayas Covered",    value: "58", icon: MapPin }
];

export default function About() {
    return (
        <div className="flex flex-col w-full">

            {/* ── Hero ── */}
            <section className="relative py-24 bg-secondary overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(93,224,230,0.12),transparent)]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <Badge variant="outline" className="text-primary border-primary/30 mb-6 px-4 py-1 bg-primary/10">
                        Our Story
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                        Medicine — found, <br />
                        <span className="text-primary italic">instantly.</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Dawa is more than a search engine — it's a lifeline for Algerian patients and the pharmacists who serve them,
                        bringing real-time stock visibility to every corner of the country.
                    </p>
                </div>
            </section>

            {/* ── Stats ── */}
            <section className="py-12 bg-primary relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-white mb-1 tracking-tighter">{stat.value}</div>
                                <div className="text-primary-foreground/70 text-[10px] font-bold uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Mission & Vision ── */}
            <section className="py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                                <Target className="text-primary" />
                                Our Mission
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                                Dawa was founded in 2025 with one goal: to eliminate the exhausting search for medicine.
                                We provide a centralised, community-powered platform where patients instantly know
                                which nearby pharmacy has their prescription in stock — before they leave home.
                            </p>
                            <Separator className="bg-border" />
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="h-2 w-12 bg-primary rounded-full" />
                                    <p className="font-black text-foreground uppercase text-xs tracking-widest">Accessibility</p>
                                    <p className="text-sm text-muted-foreground">Real-time stock data from every wilaya, available to every patient.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-12 bg-muted-foreground/30 rounded-full" />
                                    <p className="font-black text-foreground uppercase text-xs tracking-widest">Trust</p>
                                    <p className="text-sm text-muted-foreground">Community-verified reports and pharmacist-managed catalogues.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative rounded-[2.5rem] overflow-hidden bg-secondary p-12 flex flex-col justify-center text-white min-h-[400px] shadow-2xl">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Rocket size={120} className="text-primary" />
                            </div>
                            <h2 className="text-3xl font-black mb-6 tracking-tight">Our Vision</h2>
                            <p className="text-lg text-white/60 mb-8 leading-relaxed italic">
                                "To become the definitive medicine availability network for the Maghreb region,
                                ensuring that no patient ever has to visit three pharmacies to find what they need."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
                                    <Heart className="text-primary h-5 w-5 fill-primary" />
                                </div>
                                <span className="font-bold text-sm tracking-widest uppercase">Driven by Care</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Team ── */}
            <section className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-foreground tracking-tight">The Team Behind Dawa</h2>
                            <p className="text-muted-foreground text-lg max-w-xl font-medium">
                                A small, focused team of pharmacists, engineers, and designers building the platform
                                Algeria's patients and pharmacists deserve.
                            </p>
                        </div>
                        <Link to="/signup">
                            <Button variant="outline" className="rounded-full font-bold px-8 group border-border shadow-none">
                                Join Our Mission
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, i) => (
                            <Card key={i} className="border-none shadow-2xl shadow-foreground/5 hover:-translate-y-2 transition-all duration-300 rounded-[2.5rem] group overflow-hidden bg-background">
                                <CardHeader className="p-8 pb-4">
                                    <Avatar className="h-20 w-20 mb-6 ring-4 ring-offset-4 ring-primary/10">
                                        <AvatarImage src="" />
                                        <AvatarFallback className="bg-secondary text-white font-black text-xl tracking-tighter">
                                            {member.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none px-3 font-bold text-[10px] mb-2 uppercase tracking-widest">
                                            {member.tag}
                                        </Badge>
                                        <CardTitle className="text-xl font-black text-foreground tracking-tight">{member.name}</CardTitle>
                                        <CardDescription className="text-primary font-bold text-xs uppercase tracking-widest">
                                            {member.role}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 pt-2">
                                    <p className="text-muted-foreground leading-relaxed text-sm italic font-medium">
                                        "{member.bio}"
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 max-w-7xl mx-auto px-6 w-full">
                <div className="bg-secondary rounded-[3.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-secondary/20">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-primary rounded-full blur-[140px]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10 tracking-tighter">
                        Ready to find your medicine?
                    </h2>
                    <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed font-medium">
                        Join thousands of Algerian patients already using Dawa to locate medicines in seconds — not hours.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 relative z-10">
                        <Link to="/signup">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-14 rounded-full font-black text-lg shadow-xl shadow-primary/30 transition-all active:scale-95 border-none">
                                Get Started
                            </Button>
                        </Link>
                        <Link to="/search/medicine">
                            <Button variant="outline" size="lg" className="border-white/20 bg-transparent text-white hover:bg-white/10 px-10 h-14 rounded-full font-black text-lg transition-all active:scale-95">
                                Search Medicine
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}

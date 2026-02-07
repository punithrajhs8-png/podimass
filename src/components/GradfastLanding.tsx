import React, { useState } from 'react';
import './GradfastLanding.css';

// ==================== HEADER ====================
const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="container header-container">
                <a href="/" className="logo">
                    <span className="logo-text">GRADFAST</span>
                </a>

                <nav className={`nav ${mobileMenuOpen ? 'nav--open' : ''}`}>
                    <div className="nav-group">
                        <div className="nav-dropdown">
                            <button className="nav-link">Programs <span className="nav-arrow">▼</span></button>
                            <div className="dropdown-menu">
                                <a href="/programs/graduation" className="dropdown-item">
                                    <span className="dropdown-title">All Programs</span>
                                    <span className="dropdown-desc">B.Tech, MBA, BBA, B.Com, MCA & more</span>
                                </a>
                                <a href="/programs/graduation/btech" className="dropdown-item">
                                    <span className="dropdown-title">B.Tech</span>
                                    <span className="dropdown-desc">Engineering & Technology programs</span>
                                </a>
                                <a href="/programs/graduation/mba" className="dropdown-item">
                                    <span className="dropdown-title">MBA</span>
                                    <span className="dropdown-desc">Accelerated MBA for professionals</span>
                                </a>
                                <a href="/programs/graduation/bba" className="dropdown-item">
                                    <span className="dropdown-title">BBA</span>
                                    <span className="dropdown-desc">Bachelor of Business Administration</span>
                                </a>
                                <a href="/programs/graduation/mca" className="dropdown-item">
                                    <span className="dropdown-title">MCA</span>
                                    <span className="dropdown-desc">Master of Computer Applications</span>
                                </a>
                            </div>
                        </div>

                        <div className="nav-dropdown">
                            <button className="nav-link">Universities <span className="nav-arrow">▼</span></button>
                            <div className="dropdown-menu">
                                <a href="/distance-education/institutes-national-importance" className="dropdown-item">
                                    <span className="dropdown-title">Institutes of National Importance</span>
                                    <span className="dropdown-desc">Premier institutes recognized by GOI</span>
                                </a>
                                <a href="/distance-education/central-universities" className="dropdown-item">
                                    <span className="dropdown-title">Central Govt Universities</span>
                                    <span className="dropdown-desc">Strictly under the central government</span>
                                </a>
                                <a href="/distance-education/state-universities" className="dropdown-item">
                                    <span className="dropdown-title">State Govt Universities</span>
                                    <span className="dropdown-desc">State-funded universities</span>
                                </a>
                                <a href="/distance-education/private-universities" className="dropdown-item">
                                    <span className="dropdown-title">Private Universities</span>
                                    <span className="dropdown-desc">UGC-approved private institutions</span>
                                </a>
                            </div>
                        </div>

                        <a href="/process" className="nav-link">Process</a>
                        <a href="/testimonials" className="nav-link">Success Stories</a>
                        <a href="/blog" className="nav-link">Blog</a>
                    </div>
                </nav>

                <div className="header-actions">
                    <a href="/eligibility" className="btn btn-secondary">Check Eligibility</a>
                    <a href="/contact" className="btn btn-primary">Contact Us</a>
                </div>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    );
};

// ==================== HERO ====================
const Hero: React.FC = () => {
    return (
        <section className="hero">
            <div className="hero-bg">
                <div className="hero-glow hero-glow--1"></div>
                <div className="hero-glow hero-glow--2"></div>
                <div className="hero-grid"></div>
            </div>

            <div className="container hero-container">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        <span>Fast-Track Graduation & Study Abroad</span>
                    </div>

                    <h1 className="hero-title">
                        Accelerate Your
                        <span className="gradient-text"> Degree Journey</span>
                    </h1>

                    <p className="hero-subtitle">
                        Complete your accredited degree faster through credit transfer and
                        university-verified pathways. Designed for ambitious learners who want
                        to turn their study dreams into a worldwide experience.
                    </p>

                    <div className="hero-cta">
                        <a href="/eligibility" className="btn btn-primary btn-lg">
                            <span>Check Eligibility</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                        <a href="/programs/graduation" className="btn btn-outline btn-lg">
                            Explore Programs
                        </a>
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-value">10,000+</span>
                            <span className="stat-label">Graduates</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-value">50+</span>
                            <span className="stat-label">Universities</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-value">15+</span>
                            <span className="stat-label">Countries</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ==================== PROGRAMS ====================
interface ProgramCardProps {
    title: string;
    description: string;
    features: string[];
    icon: string;
    link: string;
    gradient: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ title, description, features, icon, link, gradient }) => (
    <div className="program-card">
        <div className="program-icon" style={{ background: gradient }}>
            <span>{icon}</span>
        </div>
        <h3 className="program-title">{title}</h3>
        <p className="program-description">{description}</p>
        <ul className="program-features">
            {features.map((feature, index) => (
                <li key={index}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                </li>
            ))}
        </ul>
        <a href={link} className="program-link">
            Learn More
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </a>
    </div>
);

const Programs: React.FC = () => {
    const graduationPrograms: ProgramCardProps[] = [
        {
            title: 'Accelerated BA',
            description: "Complete your bachelor's degree in less time with our intensive, accredited programs.",
            features: ['2-3 Year Completion', 'Fully Accredited', 'Flexible Schedule'],
            icon: '🎓',
            link: '/programs/graduation/ba',
            gradient: 'var(--gradient-primary)'
        },
        {
            title: 'Credit Transfer Pathways',
            description: 'Move your existing credits seamlessly to accelerate your degree completion.',
            features: ['Easy Credit Evaluation', 'Partner Universities', 'Maximum Transfer'],
            icon: '🔄',
            link: '/credit-transfer',
            gradient: 'var(--gradient-secondary)'
        },
        {
            title: 'Online-to-Campus Blend',
            description: 'Start your journey online and graduate with an on-campus experience.',
            features: ['Hybrid Learning', 'Campus Immersion', 'Global Network'],
            icon: '💻',
            link: '/programs/online-to-campus',
            gradient: 'var(--gradient-gold)'
        }
    ];

    const studyAbroadPrograms: ProgramCardProps[] = [
        {
            title: 'United Kingdom',
            description: 'Access world-renowned universities with our comprehensive UK admission support.',
            features: ['Top-Tier Universities', 'Quick Visa Support', 'Post-Study Work Visa'],
            icon: '🇬🇧',
            link: '/study-abroad/uk',
            gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
        },
        {
            title: 'Canada',
            description: 'Discover co-op programs and work-study pathways in Canada\'s top institutions.',
            features: ['Co-op Programs', 'PR Pathways', 'Affordable Tuition'],
            icon: '🇨🇦',
            link: '/study-abroad/canada',
            gradient: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)'
        },
        {
            title: 'Australia',
            description: 'Experience streamlined enrollment and quality education in Australia.',
            features: ['Streamlined Process', 'Work Rights', 'Quality Living'],
            icon: '🇦🇺',
            link: '/study-abroad/australia',
            gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)'
        },
        {
            title: 'Visa & SOP Assistance',
            description: 'Get personalized document preparation and visa application support.',
            features: ['SOP Writing', 'Visa Guidance', 'Interview Prep'],
            icon: '📄',
            link: '/visa-assistance',
            gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)'
        }
    ];

    return (
        <section className="programs section" id="programs">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">Our Programs</span>
                    <h2 className="section-title">
                        Accelerate Your Academic Journey
                        <span className="gradient-text"> A Simpler Way to Become and Discover</span>
                    </h2>
                    <p className="section-subtitle">
                        Choose from our range of accredited fast-track programs designed for ambitious learners.
                        Discover top study destinations with comprehensive support from application to arrival.
                    </p>
                </div>

                <div className="programs-tabs">
                    <h3 className="programs-tab-title">
                        <span className="tab-icon">🎓</span>
                        Fast-Track Graduation
                    </h3>
                    <div className="programs-grid">
                        {graduationPrograms.map((program, index) => (
                            <ProgramCard key={index} {...program} />
                        ))}
                    </div>
                </div>

                <div className="programs-tabs">
                    <h3 className="programs-tab-title">
                        <span className="tab-icon">✈️</span>
                        Study Abroad
                    </h3>
                    <div className="programs-grid programs-grid--4">
                        {studyAbroadPrograms.map((program, index) => (
                            <ProgramCard key={index} {...program} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ==================== PROCESS ====================
interface ProcessStepProps {
    number: number;
    title: string;
    description: string;
    icon: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ number, title, description, icon }) => (
    <div className="process-step">
        <div className="process-step-number">{number}</div>
        <div className="process-step-icon">{icon}</div>
        <h4 className="process-step-title">{title}</h4>
        <p className="process-step-description">{description}</p>
    </div>
);

const Process: React.FC = () => {
    const graduationSteps: ProcessStepProps[] = [
        { number: 1, title: 'Apply Online', description: 'Submit your application with transcripts and documents through our easy portal.', icon: '📝' },
        { number: 2, title: 'Academic Evaluation', description: 'Our team reviews your credits and creates a personalized acceleration plan.', icon: '🔍' },
        { number: 3, title: 'Enroll', description: 'Complete enrollment and begin your accelerated academic journey.', icon: '✅' },
        { number: 4, title: 'Graduate', description: 'Earn your accredited degree and step into your future with confidence.', icon: '🎓' }
    ];

    const studyAbroadSteps: ProcessStepProps[] = [
        { number: 1, title: 'Course Consultation', description: 'Discuss your goals and get personalized university recommendations.', icon: '💬' },
        { number: 2, title: 'University Admission', description: 'We handle your applications, SOPs, and secure admission offers.', icon: '🏫' },
        { number: 3, title: 'Visa Processing', description: 'Complete visa documentation and interview preparation support.', icon: '📋' },
        { number: 4, title: 'Fly Abroad', description: "Pre-departure briefing and you're ready to begin your global journey!", icon: '✈️' }
    ];

    return (
        <section className="process section">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">How It Works</span>
                    <h2 className="section-title">
                        Your Path to Graduation
                        <span className="gradient-text"> From Dream to Destination</span>
                    </h2>
                    <p className="section-subtitle">
                        A streamlined process designed to get you to graduation faster.
                        We guide you every step of the way to your international education.
                    </p>
                </div>

                <div className="process-tracks">
                    <div className="process-track">
                        <h3 className="process-track-title">
                            <span>🎓</span> Fast-Track Graduation
                        </h3>
                        <div className="process-steps">
                            {graduationSteps.map((step) => (
                                <ProcessStep key={step.number} {...step} />
                            ))}
                        </div>
                    </div>

                    <div className="process-track">
                        <h3 className="process-track-title">
                            <span>✈️</span> Study Abroad
                        </h3>
                        <div className="process-steps">
                            {studyAbroadSteps.map((step) => (
                                <ProcessStep key={step.number} {...step} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ==================== TESTIMONIALS ====================
interface TestimonialProps {
    quote: string;
    name: string;
    program?: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, name, program }) => (
    <div className="testimonial-card">
        <div className="testimonial-stars">
            {[...Array(5)].map((_, i) => <span key={i}>⭐</span>)}
        </div>
        <blockquote className="testimonial-quote">"{quote}"</blockquote>
        <div className="testimonial-author">
            <div className="testimonial-avatar">{name.charAt(0)}</div>
            <div className="testimonial-info">
                <span className="testimonial-name">{name}</span>
                {program && <span className="testimonial-program">{program}</span>}
            </div>
        </div>
    </div>
);

const Testimonials: React.FC = () => {
    const testimonials: TestimonialProps[] = [
        {
            quote: "Gradfast shortened my degree path without losing quality. I graduated a full year early!",
            name: "Priya Sharma",
            program: "Accelerated BA Graduate"
        },
        {
            quote: "The credit transfer process was seamless. I saved time and money while getting a quality education.",
            name: "Rahul Kumar",
            program: "Credit Transfer"
        },
        {
            quote: "Online-to-campus blend gave me the flexibility I needed. The campus experience was worth the wait!",
            name: "Ananya Mehta",
            program: "Hybrid Program"
        },
        {
            quote: "Gradfast secured my Canada admission and visa in record time. Now I'm living my dream!",
            name: "Aarav Malhotra",
            program: "Study Abroad - Canada"
        },
        {
            quote: "The UK visa process seemed daunting, but Gradfast made it effortless. Highly recommend!",
            name: "Neha Kapoor",
            program: "Study Abroad - UK"
        },
        {
            quote: "From SOP to visa stamp, the team was with me every step. Australia here I am!",
            name: "Vikram Singh",
            program: "Study Abroad - Australia"
        }
    ];

    return (
        <section className="testimonials section">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">Success Stories</span>
                    <h2 className="section-title">
                        What Our Students Say
                    </h2>
                    <p className="section-subtitle">
                        Real stories from students who accelerated their academic dreams
                        and achieved their global education goals.
                    </p>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// ==================== CTA ====================
const CTA: React.FC = () => {
    return (
        <section className="cta section">
            <div className="container">
                <div className="cta-card">
                    <div className="cta-content">
                        <h2 className="cta-title">
                            Ready to Fast-Track Your Degree?
                            <span className="gradient-text"> Go Global with Gradfast</span>
                        </h2>
                        <p className="cta-subtitle">
                            Take the first step towards your accelerated graduation today.
                            Personalized study-abroad planning for students and families.
                        </p>
                        <div className="cta-buttons">
                            <a href="/contact" className="btn btn-primary btn-lg">
                                <span>Book Free Consultation</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                            <a href="/universities" className="btn btn-outline btn-lg">
                                See Partner Universities
                            </a>
                        </div>
                    </div>
                    <div className="cta-decoration">
                        <div className="cta-glow"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ==================== FOOTER ====================
const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <a href="/" className="logo">
                            <span className="logo-text">GRADFAST</span>
                        </a>
                        <p className="footer-tagline">
                            Accelerating dreams, one graduate at a time. Your pathway to
                            fast-track graduation and global education opportunities.
                        </p>
                        <div className="footer-contact">
                            <a href="https://wa.me/919966207111" className="contact-link">
                                <span>📞</span> +91 99662 07111
                            </a>
                            <a href="https://wa.me/919966307111" className="contact-link">
                                <span>📞</span> +91 99663 07111
                            </a>
                            <a href="#" className="contact-link">
                                <span>📍</span> Hyderabad, Telangana
                            </a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>About</h4>
                        <ul>
                            <li><a href="/about">About Gradfast</a></li>
                            <li><a href="/team">Our Team</a></li>
                            <li><a href="/accreditations">Accreditations</a></li>
                            <li><a href="/careers">Careers</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Programs</h4>
                        <ul>
                            <li><a href="/programs/graduation/ba">Accelerated BA</a></li>
                            <li><a href="/credit-transfer">Credit Transfer</a></li>
                            <li><a href="/programs/online-to-campus">Online-to-Campus</a></li>
                            <li><a href="/study-abroad">Study Abroad</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="/help-center">Help Center</a></li>
                            <li><a href="/faq">FAQs</a></li>
                            <li><a href="/contact">Contact Us</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Connect</h4>
                        <ul>
                            <li><a href="#">Facebook</a></li>
                            <li><a href="#">Instagram</a></li>
                            <li><a href="#">LinkedIn</a></li>
                            <li><a href="#">Twitter</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 Gradfast. All rights reserved.</p>
                    <div className="footer-legal">
                        <a href="/terms">Terms of Service</a>
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/cookies">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// ==================== MAIN LANDING PAGE ====================
const GradfastLanding: React.FC = () => {
    return (
        <div className="gradfast-app">
            <Header />
            <main>
                <Hero />
                <Programs />
                <Process />
                <Testimonials />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default GradfastLanding;

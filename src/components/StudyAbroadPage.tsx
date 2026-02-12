import React, { useEffect, useRef, useState } from 'react';
import './GradfastLanding.css';
import Stack from './Stack';

// ==================== SCROLL ANIMATION HOOK ====================
const useScrollReveal = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
};

// ==================== ANIMATED SECTION WRAPPER ====================
interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '' }) => {
    const { ref, isVisible } = useScrollReveal();

    return (
        <div
            ref={ref}
            className={`animated-section ${isVisible ? 'is-visible' : ''} ${className}`}
        >
            {children}
        </div>
    );
};

// ==================== BENTO CARD COMPONENT ====================
interface BentoCardProps {
    title: string;
    description: string;
    features: string[];
    icon: string;
    gradient: string;
    size?: 'small' | 'medium' | 'large';
    delay?: number;
}

const BentoCard: React.FC<BentoCardProps> = ({ title, description, features, icon, gradient, size = 'medium', delay = 0 }) => {
    const { ref, isVisible } = useScrollReveal();

    return (
        <div
            ref={ref}
            className={`bento-card bento-card--${size} ${isVisible ? 'is-visible' : ''}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="bento-card-glow" style={{ background: gradient }} />
            <div className="bento-card-content">
                <div className="bento-icon" style={{ background: gradient }}>
                    <span>{icon}</span>
                </div>
                <h3 className="bento-title">{title}</h3>
                <p className="bento-description">{description}</p>
                <ul className="bento-features">
                    {features.map((feature, index) => (
                        <li key={index}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {feature}
                        </li>
                    ))}
                </ul>
                <a href="#" className="bento-link">
                    Learn more
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    );
};

// ==================== TIMELINE STEP COMPONENT ====================
interface TimelineStepProps {
    number: number;
    title: string;
    description: string;
    icon: string;
    delay: number;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ number, title, description, icon, delay }) => {
    const { ref, isVisible } = useScrollReveal();

    return (
        <div
            ref={ref}
            className={`timeline-step ${isVisible ? 'is-visible' : ''}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="timeline-number">{number}</div>
            <div className="timeline-content">
                <div className="timeline-icon">{icon}</div>
                <h4 className="timeline-title">{title}</h4>
                <p className="timeline-description">{description}</p>
            </div>
        </div>
    );
};

// ==================== TESTIMONIAL CARD ====================
interface TestimonialCardProps {
    quote: string;
    name: string;
    program: string;
    delay: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, program, delay }) => {
    const { ref, isVisible } = useScrollReveal();

    return (
        <div
            ref={ref}
            className={`testimonial-card ${isVisible ? 'is-visible' : ''}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="testimonial-quote-mark">"</div>
            <blockquote className="testimonial-quote">{quote}</blockquote>
            <div className="testimonial-author">
                <div className="testimonial-avatar">
                    <span>{name.charAt(0)}</span>
                </div>
                <div className="testimonial-info">
                    <span className="testimonial-name">{name}</span>
                    <span className="testimonial-program">{program}</span>
                </div>
            </div>
        </div>
    );
};

// ==================== STUDY ABROAD HERO ====================
const StudyAbroadHero: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
    return (
        <section className="hero">
            <div className="container hero-container">
                <AnimatedSection className="hero-content">
                    <h1 className="hero-title">
                        Your Gateway to
                        <br />
                        <span className="hero-title-gradient">Global Education</span>
                    </h1>

                    <p className="hero-subtitle">
                        Study at world-renowned universities in UK, Canada, Australia and more.
                        Get comprehensive support from application to visa to arrival.
                    </p>

                    <div className="hero-cta">
                        <a href="#countries" className="btn btn-primary btn-lg btn-glow">
                            <span>Explore Destinations</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                        <button onClick={onSwitch} className="btn btn-outline btn-lg">
                            🎓 Fast Track Degree
                        </button>
                    </div>
                </AnimatedSection>

                <AnimatedSection className="hero-stats">
                    <div className="stat-card">
                        <span className="stat-value">15+</span>
                        <span className="stat-label">Countries</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">200+</span>
                        <span className="stat-label">Universities</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">98%</span>
                        <span className="stat-label">Visa Success</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">5000+</span>
                        <span className="stat-label">Students Placed</span>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};

// ==================== STUDY ABROAD COUNTRIES ====================
const StudyAbroadCountries: React.FC = () => {
    return (
        <section className="programs section" id="countries">
            <div className="section-glow section-glow--left" />

            <div className="container">
                <AnimatedSection className="section-header">
                    <span className="section-tag">
                        <span className="tag-dot" />
                        Study Destinations
                    </span>
                    <h2 className="section-title">
                        Choose Your
                        <span className="gradient-text"> Dream Destination</span>
                    </h2>
                    <p className="section-subtitle">
                        Explore top study destinations with comprehensive support from university
                        selection to visa approval and pre-departure assistance.
                    </p>
                </AnimatedSection>

                <div className="bento-section">
                    <div className="bento-grid bento-grid--abroad">
                        <BentoCard
                            title="United Kingdom"
                            description="Access world-renowned universities with comprehensive UK admission support. Study at Oxford, Cambridge, and more."
                            features={['Top Universities', 'Quick Visa Process', 'Post-Study Work Visa', '2-Year Stay Back']}
                            icon="UK"
                            gradient="linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)"
                            size="medium"
                            delay={0}
                        />
                        <BentoCard
                            title="Canada"
                            description="Discover co-op programs and work-study pathways in Canada's top institutions. Excellent PR opportunities."
                            features={['Co-op Programs', 'PR Pathways', 'Affordable Education', '3-Year Work Permit']}
                            icon="🇨🇦"
                            gradient="linear-gradient(135deg, #dc2626 0%, #f87171 100%)"
                            size="medium"
                            delay={100}
                        />
                        <BentoCard
                            title="Australia"
                            description="Experience streamlined enrollment and quality education in Australia's globally ranked universities."
                            features={['Easy Process', 'Work Rights', 'Quality Life', 'Scholarship Options']}
                            icon="🇦🇺"
                            gradient="linear-gradient(135deg, #059669 0%, #34d399 100%)"
                            size="medium"
                            delay={200}
                        />
                    </div>
                </div>

                {/* Services Section */}
                <div className="bento-section" style={{ marginTop: '4rem' }}>
                    <AnimatedSection className="bento-header">
                        <div className="bento-header-icon">📋</div>
                        <div>
                            <h3 className="bento-header-title">Our Services</h3>
                            <p className="bento-header-subtitle">End-to-end support for your study abroad journey</p>
                        </div>
                    </AnimatedSection>

                    <div className="bento-grid bento-grid--graduation">
                        <BentoCard
                            title="University Selection"
                            description="Get personalized university recommendations based on your profile, budget, and career goals."
                            features={['Profile Analysis', 'Best-Fit Universities', 'Course Matching']}
                            icon="🎯"
                            gradient="var(--gradient-cyan)"
                            size="large"
                            delay={0}
                        />
                        <BentoCard
                            title="SOP & Documents"
                            description="Professional SOP writing and document preparation that gets you noticed."
                            features={['Expert SOP Writing', 'LOR Guidance', 'Document Review']}
                            icon="✍️"
                            gradient="var(--gradient-primary)"
                            size="medium"
                            delay={100}
                        />
                        <BentoCard
                            title="Visa Assistance"
                            description="Complete visa guidance with mock interviews and documentation support."
                            features={['Visa Filing', 'Mock Interviews', 'Financial Guidance']}
                            icon="🛂"
                            gradient="var(--gradient-gold)"
                            size="medium"
                            delay={200}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

// ==================== STUDY ABROAD PROCESS ====================
const StudyAbroadProcess: React.FC = () => {
    const steps = [
        { title: 'Free Counseling', description: 'Schedule a free session to discuss your goals, budget, and preferred destinations.', icon: '💬' },
        { title: 'Profile Evaluation', description: 'Our experts analyze your academic background and recommend suitable universities.', icon: '📊' },
        { title: 'University Application', description: 'We handle the complete application process including SOP, LOR, and documentation.', icon: '📝' },
        { title: 'Admission Offer', description: 'Receive offer letters and choose from your accepted universities.', icon: '🎉' },
        { title: 'Visa Processing', description: 'Complete visa filing with document preparation and mock interviews.', icon: '🛂' },
        { title: 'Pre-Departure', description: 'Get briefed on accommodation, travel, and what to expect at your destination.', icon: '✈️' },
    ];

    return (
        <section className="process section" id="process">
            <div className="section-glow section-glow--right" />

            <div className="container">
                <AnimatedSection className="section-header">
                    <span className="section-tag">
                        <span className="tag-dot" />
                        How It Works
                    </span>
                    <h2 className="section-title">
                        Your Journey to
                        <span className="gradient-text"> Studying Abroad</span>
                    </h2>
                    <p className="section-subtitle">
                        From your first inquiry to landing at your dream university,
                        we guide you through every step of the way.
                    </p>
                </AnimatedSection>

                <div className="process-single">
                    <div className="timeline">
                        <div className="timeline-line" />
                        {steps.map((step, index) => (
                            <TimelineStep
                                key={index}
                                number={index + 1}
                                title={step.title}
                                description={step.description}
                                icon={step.icon}
                                delay={index * 100}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ==================== STUDY ABROAD SUCCESS STORIES ====================
const StudyAbroadTestimonials: React.FC = () => {
    const testimonials = [
        { quote: "Gradfast secured my Canada admission and visa in record time. Now I'm living my dream at University of Toronto!", name: "Aarav Malhotra", program: "Canada - MS Computer Science" },
        { quote: "The UK visa process seemed daunting, but Gradfast made it effortless. Now studying at King's College London!", name: "Neha Kapoor", program: "UK - MBA Finance" },
        { quote: "From SOP to visa stamp, the team was with me every step. Australia here I am at University of Melbourne!", name: "Vikram Singh", program: "Australia - MS Data Science" },
        { quote: "I got into TU Munich with their help! The entire process was seamless and stress-free.", name: "Priya Reddy", program: "Germany - MS Engineering" },
        { quote: "5 university admits in 2 months! Gradfast made my study abroad dream come true.", name: "Rohit Sharma", program: "Canada - MS Management" },
        { quote: "The SOP they helped me write was exceptional. Got into my dream university in London!", name: "Anita Patel", program: "UK - MA Communications" },
    ];

    return (
        <section className="testimonials section" id="stories">
            <div className="container">
                <AnimatedSection className="section-header">
                    <span className="section-tag">
                        <span className="tag-dot" />
                        Success Stories
                    </span>
                    <h2 className="section-title">
                        Students Living Their
                        <span className="gradient-text"> Global Dreams</span>
                    </h2>
                    <p className="section-subtitle">
                        Hear from students who successfully made it to their dream universities abroad.
                    </p>
                </AnimatedSection>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            quote={testimonial.quote}
                            name={testimonial.name}
                            program={testimonial.program}
                            delay={index * 100}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

// ==================== STUDY ABROAD CTA ====================
const StudyAbroadCTA: React.FC = () => {
    return (
        <section className="cta section">
            <div className="container">
                <AnimatedSection className="cta-card">
                    <div className="cta-glow cta-glow--1" />
                    <div className="cta-glow cta-glow--2" />

                    <div className="cta-content">
                        <span className="cta-tag">Start Your Journey</span>
                        <h2 className="cta-title">Ready to Study Abroad?</h2>
                        <p className="cta-subtitle">
                            Book a free counseling session today and take the first step
                            towards your international education journey.
                        </p>
                        <div className="cta-buttons">
                            <a href="https://wa.me/919966207111" className="btn btn-primary btn-xl btn-glow">
                                <span>Get Free Counseling</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                            <a href="tel:+919966207111" className="btn btn-outline btn-xl">
                                📞 Call Now
                            </a>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};

// ==================== STUDY ABROAD GALLERY ====================
const StudyAbroadGallery: React.FC = () => {
    const images = [
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&auto=format",
        "https://images.unsplash.com/photo-1562774053-701939374585?w=500&auto=format",
        "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=500&auto=format"
    ];

    return (
        <section className="stack-gallery section" id="gallery">
            <div className="container">
                <AnimatedSection className="section-header">
                    <span className="section-tag">
                        <span className="tag-dot" />
                        Campus Life
                    </span>
                    <h2 className="section-title">
                        Your Future
                        <span className="gradient-text"> Campus</span>
                    </h2>
                    <p className="section-subtitle">
                        Explore universities worldwide. Drag or click the cards to browse.
                    </p>
                </AnimatedSection>

                <div className="stack-section">
                    <div className="stack-wrapper">
                        <Stack
                            randomRotation={false}
                            sensitivity={200}
                            sendToBackOnClick={true}
                            cards={images.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={`University campus ${i + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ))}
                            autoplay={true}
                            autoplayDelay={3000}
                            pauseOnHover={true}
                        />
                    </div>
                    <div className="stack-content">
                        <h3>World-Class Universities</h3>
                        <p>
                            Study at prestigious universities in Canada, UK, Australia, and more.
                            Experience world-class education with cutting-edge facilities and
                            diverse campus communities.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ==================== MAIN STUDY ABROAD PAGE ====================
interface StudyAbroadPageProps {
    onSwitch: () => void;
}

const StudyAbroadPage: React.FC<StudyAbroadPageProps> = ({ onSwitch }) => {
    return (
        <>
            <StudyAbroadHero onSwitch={onSwitch} />
            <StudyAbroadCountries />
            <StudyAbroadProcess />
            <StudyAbroadGallery />
            <StudyAbroadTestimonials />
            <StudyAbroadCTA />
        </>
    );
};

export default StudyAbroadPage;

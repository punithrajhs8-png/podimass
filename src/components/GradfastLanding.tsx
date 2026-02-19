import React, { useEffect, useRef, useState } from 'react';
import './GradfastLanding.css';
import ClickSpark from './ClickSpark';
import StudyAbroadPage from './StudyAbroadPage';
import Particles from './Particles';
import BlurText from './BlurText';
import InteractiveBackground from './InteractiveBackground';
import './InteractiveBackground.css';


// ==================== SCROLL ANIMATION HOOK ====================
const useScrollReveal = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
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
    delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '', delay = 0 }) => {
    const { ref, isVisible } = useScrollReveal();

    return (
        <div
            ref={ref}
            className={`animated-section ${isVisible ? 'is-visible' : ''} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// ==================== HEADER ====================
const Header: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress((window.scrollY / totalHeight) * 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
            <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
            <div className="container header-container">
                <a href="/" className="logo">
                    <span className="logo-text">GRADFAST</span>
                </a>

                <nav className="nav">
                    <a href="#programs" className="nav-link">Programs</a>
                    <a href="#process" className="nav-link">Process</a>
                    <a href="#testimonials" className="nav-link">Stories</a>
                    <a href="#contact" className="nav-link">Contact</a>
                </nav>

                <div className="header-actions">
                    <a href="/eligibility" className="btn btn-ghost">Check Eligibility</a>
                    <a href="/contact" className="btn btn-primary">
                        <span>Get Started</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </header>
    );
};



// ==================== COUNT-UP STAT CARD ====================
interface CountUpStatProps {
    end: number;
    suffix: string;
    label: string;
    delay?: number;
    accentColor: string;
}

const CountUpStat: React.FC<CountUpStatProps> = ({ end, suffix, label, delay = 0, accentColor }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    // Start count-up after stagger delay
                    setTimeout(() => {
                        const duration = 1000;
                        const startTime = performance.now();

                        const animate = (currentTime: number) => {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);

                            // Ease out expo for smooth deceleration
                            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                            setCount(Math.floor(eased * end));

                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            }
                        };

                        requestAnimationFrame(animate);
                    }, delay);
                }
            },
            { threshold: 0.3 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [end, delay, hasAnimated]);

    return (
        <div
            ref={cardRef}
            className={`stat-card ${hasAnimated ? 'stat-card--visible' : ''} ${isHovered ? 'stat-card--hovered' : ''}`}
            style={{
                '--accent-color': accentColor,
                '--stagger-delay': `${delay}ms`,
            } as React.CSSProperties}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            <span className="stat-value">
                {count}{suffix}
            </span>
            <span className="stat-label">{label}</span>
            <div className="stat-card-glow" />
        </div>
    );
};

// ==================== HERO ====================
const Hero: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
    return (
        <section className="hero">
            <Particles
                particleCount={150}
                particleSpread={15}
                speed={0.15}
                particleColors={["#ff9500", "#ff7b00", "#ff5500"]}
                moveParticlesOnHover={true}
                particleHoverFactor={2}
                alphaParticles={false}
                particleBaseSize={400}
                sizeRandomness={0.8}
                cameraDistance={12}
                disableRotation={false}
            />
            <div className="container hero-container">
                <div className="hero-content">
                    <div className="hero-title">
                        <BlurText
                            text="Accelerate Your"
                            delay={80}
                            animateBy="words"
                            direction="top"
                            stepDuration={0.15}
                            className="hero-title-orange"
                        />
                        <BlurText
                            text="Degree Journey"
                            delay={80}
                            animateBy="words"
                            direction="top"
                            stepDuration={0.15}
                            className="hero-title-default"
                        />
                    </div>

                    <p className="hero-subtitle">
                        Complete your accredited degree faster through credit transfer and
                        university-verified pathways. Turn your study dreams into a worldwide experience.
                    </p>

                    <div className="hero-cta">
                        <a href="#programs" className="btn btn-primary btn-lg btn-glow">
                            <span>Explore Programs</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                        <button onClick={onSwitch} className="btn btn-outline btn-lg">
                            ✈️ Study Abroad
                        </button>
                    </div>
                </div>

                <div className="hero-stats">
                    <CountUpStat end={10} suffix="K+" label="Graduates" delay={0} accentColor="#f97316" />
                    <CountUpStat end={50} suffix="+" label="Universities" delay={80} accentColor="#ea580c" />
                    <CountUpStat end={15} suffix="+" label="Countries" delay={160} accentColor="#f59e0b" />
                    <CountUpStat end={98} suffix="%" label="Success Rate" delay={240} accentColor="#ef4444" />
                </div>
            </div>
        </section>
    );
};



// ==================== BENTO GRID PROGRAMS ====================
// SVG Icon Component for Bento Cards
const BentoSvgIcon: React.FC<{ type: string }> = ({ type }) => {
    switch (type) {
        case 'accelerated':
            return (
                <div className="bento-icon-svg bento-icon--accelerated">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="24,2 28,18 44,18 31,28 35,44 24,34 13,44 17,28 4,18 20,18" stroke="currentColor" strokeWidth="2" fill="none" className="bi-bolt-outer" />
                        <path d="M22 14L18 26H24L20 38L32 22H24L28 14H22Z" fill="currentColor" className="bi-bolt" />
                    </svg>
                </div>
            );
        case 'credit':
            return (
                <div className="bento-icon-svg bento-icon--credit">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="4" y="10" width="40" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" className="bi-card" />
                        <line x1="4" y1="20" x2="44" y2="20" stroke="currentColor" strokeWidth="2.5" className="bi-stripe" />
                        <rect x="8" y="28" width="12" height="4" rx="1" fill="currentColor" opacity="0.3" className="bi-chip" />
                        <path d="M30 26L34 30L42 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="bi-check" />
                    </svg>
                </div>
            );
        case 'online':
            return (
                <div className="bento-icon-svg bento-icon--online">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="6" width="36" height="26" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" className="bi-screen" />
                        <line x1="18" y1="38" x2="30" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="bi-stand" />
                        <line x1="24" y1="32" x2="24" y2="38" stroke="currentColor" strokeWidth="2.5" className="bi-neck" />
                        <circle cx="24" cy="19" r="6" stroke="currentColor" strokeWidth="2" fill="none" className="bi-globe" />
                        <path d="M18 19C18 19 20.5 15 24 15C27.5 15 30 19 30 19" stroke="currentColor" strokeWidth="1.5" className="bi-globe-line" />
                        <line x1="24" y1="13" x2="24" y2="25" stroke="currentColor" strokeWidth="1.5" className="bi-globe-vert" />
                        <line x1="18" y1="19" x2="30" y2="19" stroke="currentColor" strokeWidth="1.5" className="bi-globe-horiz" />
                    </svg>
                </div>
            );
        default:
            return null;
    }
};

interface BentoCardProps {
    title: string;
    description: string;
    features: string[];
    iconType: string;
    gradient: string;
    size?: 'small' | 'medium' | 'large';
    delay?: number;
}

const BentoCard: React.FC<BentoCardProps> = ({
    title, description, features, iconType, gradient, size = 'medium', delay = 0
}) => {
    const { ref, isVisible } = useScrollReveal();

    return (
        <div
            ref={ref}
            className={`bento-card bento-card--${size} bento-card--${iconType} ${isVisible ? 'is-visible' : ''}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="bento-card-glow" style={{ background: gradient }} />
            <div className="bento-card-content">
                <BentoSvgIcon type={iconType} />
                <h3 className="bento-title">{title}</h3>
                <p className="bento-description">{description}</p>
                <ul className="bento-features">
                    {features.map((feature, index) => (
                        <li key={index}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {feature}
                        </li>
                    ))}
                </ul>
                <a href="#" className="bento-link">
                    Learn More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    );
};

const Programs: React.FC = () => {
    return (
        <section className="programs section" id="programs">
            {/* Section Glow */}
            <div className="section-glow section-glow--left" />

            <div className="container">
                <AnimatedSection className="section-header">
                    <span className="section-tag">
                        <span className="tag-dot" />
                        Fast Track Programs
                    </span>
                    <h2 className="section-title">
                        A Simpler Way to
                        <span className="gradient-text"> Accelerate Your Degree</span>
                    </h2>
                    <p className="section-subtitle">
                        Choose from accredited fast-track programs with credit transfer
                        and university-verified pathways to graduate faster.
                    </p>
                </AnimatedSection>

                {/* Fast-Track Graduation Section */}
                <div className="bento-section">
                    <AnimatedSection className="bento-header">
                        <div className="bento-header-icon">🎓</div>
                        <div>
                            <h3 className="bento-header-title">Fast-Track Graduation</h3>
                            <p className="bento-header-subtitle">Accelerate your path to a degree</p>
                        </div>
                    </AnimatedSection>

                    <div className="bento-grid bento-grid--graduation">
                        <BentoCard
                            title="Accelerated BA"
                            description="Complete your bachelor's degree in less time with our intensive, accredited programs."
                            features={['2-3 Year Completion', 'Fully Accredited', 'Flexible Schedule']}
                            iconType="accelerated"
                            gradient="var(--gradient-cyan)"
                            size="large"
                            delay={0}
                        />
                        <BentoCard
                            title="Credit Transfer"
                            description="Move your existing credits seamlessly to accelerate completion."
                            features={['Easy Evaluation', 'Partner Universities', 'Maximum Transfer']}
                            iconType="credit"
                            gradient="var(--gradient-primary)"
                            size="medium"
                            delay={100}
                        />
                        <BentoCard
                            title="Online-to-Campus"
                            description="Start online and graduate with an on-campus experience."
                            features={['Hybrid Learning', 'Campus Immersion', 'Global Network']}
                            iconType="online"
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

// ==================== PROCESS ====================
// SVG Icon Components for Process Steps
const ProcessIcon: React.FC<{ type: string }> = ({ type }) => {
    switch (type) {
        case 'apply':
            return (
                <div className="process-icon-wrapper process-icon--apply">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="10" y="6" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" className="icon-doc" />
                        <line x1="16" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="icon-line icon-line-1" />
                        <line x1="16" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="icon-line icon-line-2" />
                        <line x1="16" y1="28" x2="24" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="icon-line icon-line-3" />
                        <path d="M30 32L34 36L42 26" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="icon-check" />
                    </svg>
                </div>
            );
        case 'evaluate':
            return (
                <div className="process-icon-wrapper process-icon--evaluate">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2.5" fill="none" className="icon-lens" />
                        <line x1="29" y1="29" x2="40" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="icon-handle" />
                        <circle cx="20" cy="20" r="5" fill="currentColor" opacity="0.15" className="icon-glow" />
                        <path d="M15 18C16.5 14 19.5 13 23 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="icon-shine" />
                    </svg>
                </div>
            );
        case 'enroll':
            return (
                <div className="process-icon-wrapper process-icon--enroll">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5" fill="none" className="icon-circle" />
                        <path d="M14 24L21 31L34 17" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="icon-tick" />
                    </svg>
                </div>
            );
        case 'graduate':
            return (
                <div className="process-icon-wrapper process-icon--graduate">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="24,4 44,16 24,28 4,16" stroke="currentColor" strokeWidth="2.5" fill="none" className="icon-cap-top" />
                        <line x1="36" y1="20" x2="36" y2="34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="icon-tassel" />
                        <circle cx="36" cy="36" r="2.5" fill="currentColor" className="icon-tassel-ball" />
                        <path d="M12 20V32C12 32 18 38 24 38C30 38 36 32 36 32V20" stroke="currentColor" strokeWidth="2" fill="none" className="icon-cap-band" />
                    </svg>
                </div>
            );
        default:
            return null;
    }
};

const Process: React.FC = () => {
    const graduationSteps = [
        { title: 'Apply Online', description: 'Submit your application with transcripts through our easy portal.', iconType: 'apply' },
        { title: 'Academic Evaluation', description: 'We review your credits and create a personalized acceleration plan.', iconType: 'evaluate' },
        { title: 'Enroll', description: 'Complete enrollment and begin your accelerated academic journey.', iconType: 'enroll' },
        { title: 'Graduate', description: 'Earn your accredited degree and step into your future with confidence.', iconType: 'graduate' },
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
                        Your Path to
                        <span className="gradient-text"> Success</span>
                    </h2>
                    <p className="section-subtitle">
                        A streamlined process designed to get you to graduation faster
                        and guide you every step of the way.
                    </p>
                </AnimatedSection>

                <div className="process-rectangles">
                    {graduationSteps.map((step, index) => (
                        <AnimatedSection key={index} delay={index * 100} className="process-rectangle-card">
                            <div className="process-rectangle-number">{index + 1}</div>
                            <ProcessIcon type={step.iconType} />
                            <h4 className="process-rectangle-title">{step.title}</h4>
                            <p className="process-rectangle-description">{step.description}</p>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ==================== TESTIMONIALS ====================
const Testimonials: React.FC = () => {
    return (
        <section className="testimonials section" id="testimonials">
            <div className="container">
                <AnimatedSection className="section-header">
                    <span className="section-tag">
                        <span className="tag-dot" />
                        Success Stories
                    </span>
                    <h2 className="section-title">
                        What Our Students
                        <span className="gradient-text"> Say</span>
                    </h2>
                    <p className="section-subtitle">
                        Real stories from students who accelerated their academic dreams
                        and achieved their global education goals.
                    </p>
                </AnimatedSection>

                <div className="testimonials-grid">
                    <AnimatedSection delay={100}>
                        <div className="testimonial-card">
                            <div className="testimonial-quote-mark">"</div>
                            <p className="testimonial-quote">Gradfast shortened my degree path without losing quality. I graduated a full year early!</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">P</div>
                                <div className="testimonial-info">
                                    <span className="testimonial-name">Priya Sharma</span>
                                    <span className="testimonial-program">Accelerated BA</span>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={200}>
                        <div className="testimonial-card">
                            <div className="testimonial-quote-mark">"</div>
                            <p className="testimonial-quote">The credit transfer process was seamless. I saved time and money while getting quality education.</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">R</div>
                                <div className="testimonial-info">
                                    <span className="testimonial-name">Rahul Kumar</span>
                                    <span className="testimonial-program">Credit Transfer</span>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={300}>
                        <div className="testimonial-card">
                            <div className="testimonial-quote-mark">"</div>
                            <p className="testimonial-quote">Online-to-campus blend gave me the flexibility I needed. The campus experience was worth it!</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">A</div>
                                <div className="testimonial-info">
                                    <span className="testimonial-name">Ananya Mehta</span>
                                    <span className="testimonial-program">Hybrid Program</span>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

// ==================== CTA ====================
const CTA: React.FC = () => {
    return (
        <section className="cta-banner" id="contact">
            {/* Animated background shimmer */}
            <div className="cta-banner-shimmer" />

            {/* Floating particles */}
            <div className="cta-banner-particles">
                <div className="cta-particle cta-particle--1" />
                <div className="cta-particle cta-particle--2" />
                <div className="cta-particle cta-particle--3" />
                <div className="cta-particle cta-particle--4" />
                <div className="cta-particle cta-particle--5" />
                <div className="cta-particle cta-particle--6" />
            </div>

            <AnimatedSection>
                {/* Decorative graduation cap circles — LEFT */}
                <div className="cta-banner-decor cta-banner-decor--left">
                    <div className="cta-banner-circle cta-banner-circle--lg">
                        <div className="cta-banner-circle cta-banner-circle--md">
                            <div className="cta-banner-circle cta-banner-circle--sm">
                                <span className="cta-banner-cap">🎓</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative circles — RIGHT */}
                <div className="cta-banner-decor cta-banner-decor--right">
                    <div className="cta-banner-circle cta-banner-circle--lg">
                        <div className="cta-banner-circle cta-banner-circle--md">
                            <div className="cta-banner-circle cta-banner-circle--sm" />
                        </div>
                    </div>
                </div>

                <div className="cta-banner-content">
                    <h2 className="cta-banner-title">
                        Ready to Fast-Track Your Degree?
                    </h2>
                    <p className="cta-banner-subtitle">
                        Take the first step towards your accelerated graduation today.
                    </p>
                    <div className="cta-banner-buttons">
                        <a href="/contact" className="cta-btn cta-btn--primary">
                            <span>Start Your Journey</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                        <a href="/contact" className="cta-btn cta-btn--outline">
                            Talk to Advisor
                        </a>
                    </div>
                </div>
            </AnimatedSection>
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
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                +91 99662 07111
                            </a>
                            <a href="https://wa.me/919966307111" className="contact-link">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                +91 99663 07111
                            </a>
                            <a href="mailto:hello@gradfast.in" className="contact-link">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="M22 4L12 13L2 4" />
                                </svg>
                                hello@gradfast.in
                            </a>
                            <span className="contact-link">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                Hyderabad, Telangana
                            </span>
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
                            <li><a href="/faq">FAQs</a></li>
                            <li><a href="/contact">Contact Us</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                            <li><a href="/terms">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 Gradfast. All rights reserved.</p>
                    <div className="footer-social">
                        <a href="#" aria-label="Facebook" className="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Instagram" className="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                        <a href="#" aria-label="LinkedIn" className="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Twitter" className="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// ==================== MAIN LANDING PAGE ====================
const GradfastLanding: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<'fasttrack' | 'abroad'>('fasttrack');

    const switchToAbroad = () => {
        setCurrentPage('abroad');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const switchToFastTrack = () => {
        setCurrentPage('fasttrack');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <ClickSpark
            sparkColor="#dda15e"
            sparkSize={12}
            sparkRadius={20}
            sparkCount={10}
            duration={500}
            easing="ease-out"
            extraScale={1.2}
        >
            <div className={`gradfast-app ${currentPage === 'fasttrack' ? 'gradfast-app--fasttrack' : ''}`}>
                <Header />
                <main>
                    {currentPage === 'fasttrack' ? (
                        <>
                            <Hero onSwitch={switchToAbroad} />
                            <InteractiveBackground>
                                <Programs />
                                <Process />
                                <Testimonials />
                            </InteractiveBackground>
                            <CTA />
                        </>
                    ) : (
                        <StudyAbroadPage onSwitch={switchToFastTrack} />
                    )}
                </main>
                <Footer />
            </div>
        </ClickSpark>
    );
};

export default GradfastLanding;

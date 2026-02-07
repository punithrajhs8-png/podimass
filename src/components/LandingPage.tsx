import React from 'react';
import './LandingPage.css';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
    <div className="feature-card">
        <span className="feature-icon">{icon}</span>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-desc">{description}</p>
    </div>
);

const LandingPage: React.FC = () => {
    return (
        <div className="landing-container">
            <header className="hero-section">
                <h1 className="hero-title">
                    Build the Future <span>with Speed & Style</span>
                </h1>
                <p className="hero-subtitle">
                    Experience the next generation of web development.
                    Blazing fast performance, stunning aesthetics, and a developer experience like no other.
                </p>
                <button className="cta-button" onClick={() => alert('Welcome aboard!')}>
                    Get Started Now
                </button>
            </header>

            <section className="features-grid">
                <FeatureCard
                    title="Lightning Fast"
                    description="Built on Vite for instant server start and lightning fast HMR."
                    icon="⚡"
                />
                <FeatureCard
                    title="Modern Stack"
                    description="React 18 + TypeScript for robust and scalable applications."
                    icon="⚛️"
                />
                <FeatureCard
                    title="Beautiful Design"
                    description="Crafted with a premium aesthetic and smooth micro-interactions."
                    icon="🎨"
                />
            </section>

            <footer style={{ marginTop: '6rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                <p>© 2026 Future Web Inc. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;

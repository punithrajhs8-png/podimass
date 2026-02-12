import React, { useState } from 'react';
import './SuccessStoriesModal.css';

interface Testimonial {
    quote: string;
    name: string;
    program: string;
}

const testimonials: Testimonial[] = [
    { quote: "Gradfast shortened my degree path without losing quality. I graduated a full year early!", name: "Priya Sharma", program: "Accelerated BA" },
    { quote: "The credit transfer process was seamless. I saved time and money while getting quality education.", name: "Rahul Kumar", program: "Credit Transfer" },
    { quote: "Online-to-campus blend gave me the flexibility I needed. The campus experience was worth it!", name: "Ananya Mehta", program: "Hybrid Program" },
];

const SuccessStoriesModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const handleCardClick = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="success-stories-wrapper">
            <button 
                className="folder-icon-trigger"
                onClick={() => setIsOpen(true)}
            >
                <span className="folder-icon">📁</span>
                <span className="folder-label">Success Stories</span>
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-icon">📁</span>
                            <h3>Success Stories</h3>
                            <button className="modal-close" onClick={() => setIsOpen(false)}>✕</button>
                        </div>

                        <div className="modal-body">
                            {testimonials.map((testimonial, index) => (
                                <div 
                                    key={index}
                                    className={`modal-card ${expandedIndex === index ? 'expanded' : ''}`}
                                    onClick={() => handleCardClick(index)}
                                >
                                    <div className="card-preview">
                                        <div className="card-avatar">
                                            <span>{testimonial.name.charAt(0)}</span>
                                        </div>
                                        <div className="card-info">
                                            <span className="card-name">{testimonial.name}</span>
                                            <span className="card-program">{testimonial.program}</span>
                                        </div>
                                        <span className="expand-icon">{expandedIndex === index ? '−' : '+'}</span>
                                    </div>

                                    {expandedIndex === index && (
                                        <div className="card-expanded">
                                            <div className="quote-box">
                                                <span className="quote-mark">"</span>
                                                <p>{testimonial.quote}</p>
                                                <span className="quote-mark end">"</span>
                                            </div>
                                            <div className="author-section">
                                                <div className="author-avatar">
                                                    <span>{testimonial.name.charAt(0)}</span>
                                                </div>
                                                <div className="author-info">
                                                    <span className="author-name">{testimonial.name}</span>
                                                    <span className="author-program">{testimonial.program}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuccessStoriesModal;

import React, { useState } from 'react';
import './TestimonialFolder.css';

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

const TestimonialFolder: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const handleCardClick = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handleHeaderClick = () => {
        setIsOpen(!isOpen);
        setExpandedIndex(null);
    };

    return (
        <div className="testimonial-folder">
            <div 
                className={`testimonial-folder-header ${isOpen ? 'open' : ''}`}
                onClick={handleHeaderClick}
            >
                <span className="folder-icon">{isOpen ? '📂' : '📁'}</span>
                <span className="folder-label">
                    {isOpen ? 'Click to Close' : '3 Success Stories - Click to Open'}
                </span>
                <span className="folder-arrow">{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <div className="testimonial-folder-content">
                    {testimonials.map((testimonial, index) => (
                        <div 
                            key={index}
                            className={`testimonial-card-item ${expandedIndex === index ? 'expanded' : ''}`}
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
                                <span className="card-expand-icon">{expandedIndex === index ? '−' : '+'}</span>
                            </div>

                            {expandedIndex === index && (
                                <div className="card-expanded">
                                    <div className="card-quote">
                                        <span className="quote-mark">"</span>
                                        <p>{testimonial.quote}</p>
                                        <span className="quote-mark end">"</span>
                                    </div>
                                    <div className="card-author">
                                        <div className="author-avatar">
                                            <span>{testimonial.name.charAt(0)}</span>
                                        </div>
                                        <div className="author-details">
                                            <span className="author-name">{testimonial.name}</span>
                                            <span className="author-program">{testimonial.program}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestimonialFolder;

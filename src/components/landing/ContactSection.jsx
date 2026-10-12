import { Phone, Mail, MapPin } from 'lucide-react';

function ContactSection({ }) {
    return <section className="section contact" id="contact">
        <div className="container">
            <div className="section-heading">
                <div className="eyebrow">GET IN TOUCH</div>
                <h2>Contact <span>Us</span></h2>
                <p>We are ready to discuss your fire safety requirements.</p>
            </div>
            <div className="contact-grid"><div>
                <div className="contact-icon">
                    <MapPin />
                </div>
                <h3>Office Location</h3>
                <p>Abanti, Suite#A-3, H#37, R#27, Blk#A, Banani, Dhaka-1213</p>
            </div><div><div className="contact-icon">
                <Phone />
            </div>
                    <h3>Call Our Team</h3>
                    <p>+8801711527601</p>
                    <p>+8801716754600</p>
                </div>
                <div>
                    <div className="contact-icon">
                        <Mail />
                    </div>
                    <h3>Email Us</h3>
                    <p>emeisltd@gmail.com</p>
                </div>
            </div>
        </div>
    </section>
}
export default ContactSection;

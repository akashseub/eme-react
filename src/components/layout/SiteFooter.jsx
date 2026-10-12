import { Link } from 'react-router-dom';

import Logo from '@/components/common/Logo';
function SiteFooter({go}){return <footer className="footer"><div className="container footer-grid"><div><Logo compact/><p>Inspection, engineering drawings and fire safety support for safer operations.</p></div><div><strong>Quick Links</strong><button onClick={()=>go('about')}>About Us</button><button onClick={()=>go('services')}>Our Services</button><button onClick={()=>go('quote')}>Get Quote</button></div><div><strong>Company</strong><button onClick={()=>go('contact')}>Contact Us</button><Link to="/login">Staff Login</Link></div></div><div className="container footer-bottom">© {new Date().getFullYear()} EME Inspection Services Ltd. All rights reserved. <span>Built for safety and progress.</span></div></footer>}
export default SiteFooter;

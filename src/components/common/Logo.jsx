import { Link } from 'react-router-dom';

const LOGO='/eme-logo.png';
function Logo({compact=false}){return <Link to="/" className={'brand '+(compact?'brand-small':'')}><img src={LOGO} alt="EME Inspection Services logo"/><span><strong>EME</strong><small>INSPECTION SERVICES LTD.</small></span></Link>}
export default Logo;

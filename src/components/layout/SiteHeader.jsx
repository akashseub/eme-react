import { Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react';

import Logo from '@/components/common/Logo';
function SiteHeader({menu,setMenu,go}){return <>  <div className="topbar"><div className="container topbar-inner"><span><Phone size={13}/> Professional Fire Safety & Engineering Support</span><span>EME Inspection Services Ltd.</span></div></div>
  <header className="site-header"><div className="container nav-wrap"><Logo/><nav className={menu?'site-nav nav-open':'site-nav'}>{[['home','Home'],['about','About Us'],['services','Our Services'],['contact','Contact Us']].map(([id,label])=><button key={id} onClick={()=>go(id)}>{label}</button>)}<button onClick={()=>go('quote')} className="btn btn-primary nav-quote">Get Quote <ArrowUpRight size={16}/></button><Link className="btn btn-outline" to="/login">Login</Link></nav><button className="mobile-toggle" aria-label="Toggle menu" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div></header></>} 
export default SiteHeader;

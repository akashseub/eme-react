import { useState } from 'react';
import { post } from '@/lib/api';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import HeroSection from '@/components/landing/HeroSection';
import AboutSection from '@/components/landing/AboutSection';
import ServicesSection from '@/components/landing/ServicesSection';
import QuoteSection from '@/components/landing/QuoteSection';
import ContactSection from '@/components/landing/ContactSection';
const blank={organization:'',contact:'',phone:'',email:'',location:'',service:'',details:''};
export default function Landing(){
 const [menu,setMenu]=useState(false);const [sent,setSent]=useState(false);const [error,setError]=useState('');const [form,setForm]=useState(blank);
 const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false)};
 async function submit(e){e.preventDefault();setError('');setSent(false);try{await post('/quotes',form);setSent(true);setForm(blank)}catch(e){setError(e.message)}}
 return <div className="website"><SiteHeader menu={menu} setMenu={setMenu} go={go}/><main><HeroSection go={go}/><AboutSection go={go}/><ServicesSection go={go} form={form} setForm={setForm}/>{error&&<div className="form-error" style={{margin:'12px auto',maxWidth:1100}}>{error}</div>}<QuoteSection sent={sent} submit={submit} form={form} setForm={setForm}/><ContactSection/></main><SiteFooter go={go}/></div>
}

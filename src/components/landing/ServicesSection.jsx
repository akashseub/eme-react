import { ArrowUpRight } from 'lucide-react';

import { services } from '@/config/services';
function ServicesSection({go,setForm,form}){return <section className="section services" id="services"><div className="container"><div className="section-heading"><div className="eyebrow">WHAT WE DO</div><h2>Our Professional <span>Services</span></h2><p>Focused solutions across inspection, life safety, engineering drawings and documentation.</p></div><div className="service-grid">{services.map((s,i)=><article className="service-card" key={s.title}><span className="service-index">0{i+1}</span><div className="service-icon"><s.icon size={29}/></div><h3>{s.title}</h3><p>{s.desc}</p><button onClick={()=>{setForm({...form,service:s.title});go('quote')}}>Request this service <ArrowUpRight size={15}/></button></article>)}</div></div></section>}
export default ServicesSection;

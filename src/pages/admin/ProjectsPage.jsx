import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus, Search } from 'lucide-react';
import { statuses, money } from '@/data/store';
import Field from '@/components/common/Field';
import Logo from '@/components/common/Logo';
import Pill from '@/components/common/StatusPill';
import Titlebar from '@/components/common/PageTitle';

function Projects({projects}){const [query,setQuery]=useState(''),[status,setStatus]=useState('All');const filtered=projects.filter(p=>(p.name+' '+p.client+' '+p.id).toLowerCase().includes(query.toLowerCase())&&(status==='All'||p.status===status));return <><Titlebar eyebrow="PROJECT MANAGEMENT" title="All Projects" description="Browse, search and open your project records." action={<Link className="btn btn-primary" to="/admin/projects/new"><Plus size={18}/> Create Project</Link>}/><div className="panel"><div className="filterbar"><div className="search-field"><Search size={18}/><input placeholder="Search projects or clients..." value={query} onChange={e=>setQuery(e.target.value)}/></div><select value={status} onChange={e=>setStatus(e.target.value)}><option>All</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></div><div className="table-wrap"><table><thead><tr><th>PROJECT / CLIENT</th><th>LOCATION</th><th>WORK VALUE</th><th>STATUS</th><th>ASSIGNED</th><th></th></tr></thead><tbody>{filtered.map(p=><tr key={p.id}><td><b>{p.name}</b><small>{p.id} · {p.client}</small></td><td>{p.address}</td><td>{money(p.value)}</td><td><Pill status={p.status}/></td><td>{p.team}</td><td><Link className="table-open" to={'/admin/projects/'+p.id}>Open <ArrowUpRight size={16}/></Link></td></tr>)}</tbody></table>{filtered.length===0&&<div className="empty">No projects match these filters.</div>}</div></div></>}
export default Projects;

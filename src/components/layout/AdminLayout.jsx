import { useState } from 'react';
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShieldCheck, ChevronRight, LayoutDashboard, FolderKanban, Plus, CreditCard, LogOut, AlertCircle, MessageSquareText, UsersRound } from 'lucide-react';
import Logo from '@/components/common/Logo';
import Dashboard from '@/pages/admin/DashboardPage';
import Projects from '@/pages/admin/ProjectsPage';
import NewProject from '@/pages/admin/NewProjectPage';
import ProjectDetails from '@/pages/admin/ProjectDetailsPage';
import Payments from '@/pages/admin/PaymentsPage';
import Quotes from '@/pages/admin/QuotesPage';
import AccessManagement from '@/pages/admin/AccessManagementPage';

function Admin({user,onLogout,projects,quotes,refresh,apiError}){const [sidebar,setSidebar]=useState(false);const navigate=useNavigate();if(!user)return <Navigate to="/login" replace/>;const can=p=>user.permissions?.includes(p);const menuItems=[
 ...(can('dashboard.view')?[{to:'/admin',icon:LayoutDashboard,label:'Dashboard',end:true}]:[]),
 ...(can('projects.view')?[{to:'/admin/projects',icon:FolderKanban,label:'All Projects'}]:[]),
 ...(can('projects.create')?[{to:'/admin/projects/new',icon:Plus,label:'New Project'}]:[]),
 ...(can('payments.view')?[{to:'/admin/payments',icon:CreditCard,label:'Payments'}]:[]),
 ...(can('quotes.view')?[{to:'/admin/quotes',icon:MessageSquareText,label:'Quote Requests'}]:[]),
 ...(can('users.manage')?[{to:'/admin/access',icon:UsersRound,label:'Users & Roles'}]:[])
];return <div className="admin-app"><aside className={'admin-sidebar '+(sidebar?'sidebar-open':'')}><div className="sidebar-top"><Logo compact/><button className="sidebar-close" onClick={()=>setSidebar(false)}><X size={20}/></button></div><div className="sidebar-label">WORKSPACE</div><nav className="admin-menu">{menuItems.map(item=><NavLink onClick={()=>setSidebar(false)} key={item.to} end={item.end} to={item.to} className={({isActive})=>'admin-link '+(isActive?'active':'')}><item.icon size={19}/>{item.label}<ChevronRight className="link-chevron" size={15}/></NavLink>)}</nav><div className="sidebar-bottom"><div className="help-card"><ShieldCheck size={26}/><b>EME Project Hub</b><small>Track work, collaborate and keep everything in one place.</small></div><button className="signout" onClick={()=>{onLogout();navigate('/login')}}><LogOut size={19}/> Log out</button></div></aside>{sidebar&&<div className="sidebar-overlay" onClick={()=>setSidebar(false)}/>}<div className="admin-main"><header className="admin-header"><div className="admin-header-left"><button className="sidebar-open-btn" onClick={()=>setSidebar(true)} aria-label="Open sidebar"><Menu/></button><span className="breadcrumb">EME Workspace <ChevronRight size={15}/> Admin Panel</span></div><div className="admin-header-right"><span className="role-chip">{user.role}</span><span className="avatar">{user.name[0]?.toUpperCase()}</span><div className="header-user"><strong>{user.name}</strong><small>{user.role}</small></div></div></header><main className="admin-content">{apiError&&<div className="form-error">{apiError}</div>}<Routes><Route index element={can('dashboard.view')?<Dashboard user={user} projects={projects} quotes={quotes}/>:<Navigate to="projects" replace/>}/><Route path="projects" element={<Projects projects={projects}/>}/><Route path="projects/new" element={can('projects.create')?<NewProject user={user} refresh={refresh}/>:<Navigate to="/admin" replace/>}/><Route path="projects/:id" element={<ProjectDetails user={user} projects={projects} refresh={refresh}/>}/><Route path="payments" element={<Payments user={user} projects={projects} refresh={refresh}/>}/><Route path="quotes" element={can('quotes.view')?<Quotes quotes={quotes}/>:<Navigate to="/admin" replace/>}/><Route path="access" element={can('users.manage')?<AccessManagement/>:<Navigate to="/admin" replace/>}/><Route path="*" element={<Navigate to="/admin" replace/>}/></Routes></main></div></div>}
export default Admin;

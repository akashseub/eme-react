import { useCallback, useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { api } from '@/lib/api';
import LandingPage from '@/pages/public/LandingPage';
import LoginPage from '@/pages/public/LoginPage';
import AdminLayout from '@/components/layout/AdminLayout';

export default function App(){
 const [user,setUser]=useState(null);
 const userPermissions=useRef([]);
 const assignUser=u=>{userPermissions.current=u?.permissions||[];setUser(u)};
 const [loading,setLoading]=useState(true);
 const [projects,setProjects]=useState([]);
 const [quotes,setQuotes]=useState([]);
 const [error,setError]=useState('');
 const refresh=useCallback(async()=>{
  try { const [p,q]=await Promise.all([userPermissions.current.includes('projects.view')?api('/projects'):[],userPermissions.current.includes('quotes.view')?api('/quotes'):[]]);setProjects(p);setQuotes(q);setError(''); }
  catch(e){setError(e.message);if(/sign in|expired/i.test(e.message))assignUser(null);}
 },[]);
 useEffect(()=>{api('/auth/me').then(r=>assignUser(r.user)).catch(()=>assignUser(null)).finally(()=>setLoading(false));},[]);
 useEffect(()=>{if(user)refresh();else {setProjects([]);setQuotes([]);}},[user,refresh]);
 const logout=async()=>{await api('/auth/logout',{method:'POST'}).catch(()=>{});assignUser(null);};
 if(loading)return <div className="panel padded" style={{margin:'8rem auto',maxWidth:360}}>Loading workspace…</div>;
 return <Routes>
  <Route path="/" element={<LandingPage/>}/>
  <Route path="/login" element={<LoginPage user={user} onLogin={assignUser}/>}/>
  <Route path="/admin/*" element={<AdminLayout user={user} onLogout={logout} projects={projects} quotes={quotes} refresh={refresh} apiError={error}/>}/>
  <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes>;
}

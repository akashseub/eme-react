import { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, LockKeyhole } from 'lucide-react';
import { post } from '@/lib/api';
import Field from '@/components/common/Field';
import Logo from '@/components/common/Logo';

export default function Login({onLogin,user}){
 const navigate=useNavigate(); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 if(user)return <Navigate to="/admin" replace/>;
 async function submit(e){e.preventDefault();setBusy(true);setError('');try{const result=await post('/auth/login',{email,password});onLogin(result.user);navigate('/admin');}catch(err){setError(err.message);}finally{setBusy(false)}}
 return <div className="login-page"><div className="login-side"><Logo/><div><div className="eyebrow light">EME WORKSPACE</div><h1>Manage projects.<br/><em>Deliver with confidence.</em></h1><p>A shared workspace for project tracking, daily activities, documents and actual payment receipts.</p></div><div className="login-side-foot"><ShieldCheck/> Internal project management workspace</div></div><div className="login-right"><Link to="/" className="back-link">← Back to website</Link><div className="login-box"><div className="login-symbol"><LockKeyhole size={29}/></div><h2>Welcome back</h2><p>Sign in with your EME account.</p>{error&&<div className="form-error">{error}</div>}<form onSubmit={submit}><Field label="Email"><input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></Field><Field label="Password"><input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></Field><button className="btn btn-primary login-submit" disabled={busy}>{busy?'Signing in…':'Sign in'} <ArrowRight size={18}/></button></form><div className="demo-foot">Development account setup is explained in README.md.</div></div></div></div>
}

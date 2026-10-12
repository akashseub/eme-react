import { useEffect, useState } from 'react';
import { UserPlus, Shield, Pencil, Trash2, KeyRound } from 'lucide-react';
import Titlebar from '@/components/common/PageTitle';
import { api, post, patch } from '@/lib/api';

const labels={
 'dashboard.view':'View dashboard','projects.view':'View projects','projects.create':'Create projects',
 'projects.edit':'Update project status','projects.assign':'Reassign project teams',
 'updates.create':'Post daily work updates','documents.upload':'Upload documents',
 'payments.view':'View payments','payments.create':'Record payment receipts',
 'payments.approve':'Approve received payments','quotes.view':'View quote requests',
 'users.manage':'Manage users','roles.manage':'Manage roles'
};
const restricted=['users.manage','roles.manage','payments.approve'];
const emptyRole={name:'',description:'',permissions:[]};
const emptyUser={name:'',email:'',password:'',roleId:''};
export default function AccessManagementPage(){
 const [roles,setRoles]=useState([]),[users,setUsers]=useState([]),[permissions,setPermissions]=useState([]);
 const [tab,setTab]=useState('users'),[role,setRole]=useState(emptyRole),[user,setUser]=useState(emptyUser);
 const [editRole,setEditRole]=useState(''),[editUser,setEditUser]=useState('');
 const [message,setMessage]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const load=async()=>{const [r,u,p]=await Promise.all([api('/roles'),api('/users'),api('/permissions')]);setRoles(r);setUsers(u);setPermissions(p)};
 useEffect(()=>{load().catch(e=>setError(e.message))},[]);
 const execute=async fn=>{setError('');setMessage('');setBusy(true);try{await fn();await load();setMessage('Saved successfully.');}catch(e){setError(e.message)}finally{setBusy(false)}};
 const saveRole=e=>{e.preventDefault();execute(async()=>{if(editRole)await patch('/roles/'+editRole,role);else await post('/roles',role);setRole(emptyRole);setEditRole('')})};
 const saveUser=e=>{e.preventDefault();execute(async()=>{if(editUser)await patch('/users/'+editUser,{name:user.name,roleId:user.roleId});else await post('/users',user);setUser(emptyUser);setEditUser('')})};
 const resetPassword=entry=>{const password=window.prompt(`New password for ${entry.name} (minimum 12 characters):`);if(password===null)return;execute(()=>post(`/users/${entry.id}/reset-password`,{password}))};
 const removeRole=entry=>{if(!window.confirm(`Delete role ${entry.name}?`))return;execute(()=>api('/roles/'+entry.id,{method:'DELETE'}))};
 const beginRole=r=>{setEditRole(r.id);setRole({name:r.name,description:r.description,permissions:[...r.permissions]});setTab('roles');setMessage('');setError('');window.scrollTo({top:0,behavior:'smooth'})};
 const beginUser=u=>{setEditUser(u.id);setUser({name:u.name,email:u.email,password:'',roleId:u.roleId});setTab('users');setError('')};
 return <>
  <Titlebar eyebrow="ADMINISTRATION / SECURITY" title="Users & Roles" description="Create accounts and control what each role can do. Access permissions are checked by the backend."/>
  <div className="access-tabs"><button className={'btn '+(tab==='users'?'btn-primary':'btn-soft')} onClick={()=>setTab('users')}><UserPlus size={17}/> Users</button><button className={'btn '+(tab==='roles'?'btn-primary':'btn-soft')} onClick={()=>setTab('roles')}><Shield size={17}/> Roles & Permissions</button></div>
  {error&&<div className="form-error" role="alert">{error}</div>}{message&&<div className="access-success">{message}</div>}
  {tab==='users'?<div className="access-grid">
    <div className="panel form-panel"><h3>{editUser?'Edit User':'Create New User'}</h3><p className="access-subtitle">Only Super Admin can create and assign accounts.</p><form onSubmit={saveUser} className="access-form">
      <label>Full Name<input required maxLength={120} value={user.name} onChange={e=>setUser({...user,name:e.target.value})} placeholder="e.g. Engineering Officer"/></label>
      {!editUser&&<><label>Email Address<input required type="email" value={user.email} onChange={e=>setUser({...user,email:e.target.value})} placeholder="user@company.com"/></label><label>Initial Password<input required type="password" minLength={12} autoComplete="new-password" value={user.password} onChange={e=>setUser({...user,password:e.target.value})} placeholder="At least 12 characters"/></label></>}
      <label>Assign Role<select required value={user.roleId} onChange={e=>setUser({...user,roleId:e.target.value})}><option value="">Select role</option>{roles.filter(r=>r.name!=='Super Admin').map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
      <button disabled={busy} className="btn btn-primary" type="submit">{editUser?'Save Changes':'Create User'}</button>{editUser&&<button type="button" className="btn btn-soft" onClick={()=>{setEditUser('');setUser(emptyUser)}}>Cancel</button>}
    </form></div>
    <div className="panel form-panel"><h3>Existing Users ({users.length})</h3><div className="access-table-wrap"><table className="access-table"><thead><tr><th>Name / Email</th><th>Role</th><th>Actions</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td><strong>{u.name}</strong><small>{u.email}</small></td><td>{u.role}</td><td>{u.role==='Super Admin'?'Protected':<div className="access-actions"><button title="Edit" className="btn btn-soft" onClick={()=>beginUser(u)}><Pencil size={16}/></button><button title="Reset password" className="btn btn-soft" onClick={()=>resetPassword(u)}><KeyRound size={16}/></button></div>}</td></tr>)}</tbody></table></div></div>
  </div>:<div className="access-grid">
    <div className="panel form-panel"><h3>{editRole?'Edit Role':'Create Custom Role'}</h3><p className="access-subtitle">Choose the permissions this role should receive.</p><form onSubmit={saveRole} className="access-form">
      <label>Role Name<input required disabled={!!editRole && roles.some(r=>r.id===editRole && r.system)} maxLength={60} value={role.name} onChange={e=>setRole({...role,name:e.target.value})} placeholder="e.g. Senior Engineer"/></label>
      <label>Description<textarea rows={2} maxLength={250} value={role.description} onChange={e=>setRole({...role,description:e.target.value})}/></label>
      <strong>Allowed Activities</strong><div className="access-permissions">{permissions.filter(p=>!restricted.includes(p)).map(p=><label key={p} className="access-check"><input type="checkbox" checked={role.permissions.includes(p)} onChange={e=>setRole({...role,permissions:e.target.checked?[...role.permissions,p]:role.permissions.filter(x=>x!==p)})}/>{labels[p]||p}</label>)}</div>
      <small>User administration, role administration and payment approval are reserved for Super Admin.</small>
      <button type="submit" disabled={busy} className="btn btn-primary">{editRole?'Save Role':'Create Role'}</button>{editRole&&<button type="button" className="btn btn-soft" onClick={()=>{setEditRole('');setRole(emptyRole)}}>Cancel</button>}
    </form></div>
    <div className="panel form-panel"><h3>Configured Roles ({roles.length})</h3><div className="access-role-list">{roles.map(r=><div className="access-role" key={r.id}><div><strong>{r.name}</strong> {r.system?<small>Default</small>:null}<p>{r.description}</p><small>{r.userCount} user(s) · {r.permissions.length} permission(s)</small></div>{r.name==='Super Admin'?<small>Protected</small>:<div className="access-actions"><button type="button" title="Edit role" className="btn btn-soft" onClick={()=>beginRole(r)}><Pencil size={16}/></button>{!r.system&&<button type="button" title="Delete role" className="btn btn-soft" onClick={()=>removeRole(r)}><Trash2 size={16}/></button>}</div>}</div>)}</div></div>
  </div>}
 </>
}

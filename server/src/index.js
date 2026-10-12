import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { randomBytes } from 'node:crypto';
import { mkdirSync, unlinkSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { db, seedDevUsers, seedRoles, userWithPermissions, PERMISSIONS, passwordHash, passwordMatches, hashToken, id } from './db.js';

seedRoles();
seedDevUsers();
const app=express();
app.disable('x-powered-by');
app.use(express.json({limit:'80kb'}));
const origin=process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
const statuses=['New','In Progress','Pending Documents','Under Review','Completed','On Hold'];
const teams=['Marketing','Engineering'];
const sessionMaxAge=7*24*3600*1000;
const cookieName='eme_session';
function error(res,code,message){return res.status(code).json({error:message});}
function validText(t,max=500){return typeof t==='string' && t.trim().length>0 && t.length<=max;}
const clean=(t)=>typeof t==='string'?t.trim():'';
const validDate=t=>typeof t==='string' && /^\d{4}-\d{2}-\d{2}$/.test(t) && !Number.isNaN(Date.parse(t+'T00:00:00Z'));
const userView=u=>userWithPermissions(u);
const routes=express.Router();
routes.use((req,res,next)=>{
 if(['POST','PATCH','PUT','DELETE'].includes(req.method)) {
   const sent=req.get('origin');
   if(sent && sent!==origin)return error(res,403,'Invalid request origin');
 }
 next();
});
function cookie(req){return (req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1);}
function auth(req,res,next){const token=cookie(req);if(!token)return error(res,401,'Please sign in');const u=db.prepare('SELECT u.id,u.name,u.email,u.role,u.role_id FROM sessions s JOIN users u ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>?').get(hashToken(token),Date.now());if(!u)return error(res,401,'Session expired; please sign in');req.user=userView(u);next();}
const allow=(permission)=>(req,res,next)=>req.user?.permissions?.includes(permission)?next():error(res,403,'Insufficient permissions');
routes.post('/auth/login',(req,res)=>{
 const email=clean(req.body?.email).toLowerCase();const password=req.body?.password;
 if(!email||typeof password!=='string')return error(res,400,'Email and password required');
 const u=db.prepare('SELECT * FROM users WHERE email=?').get(email);
 if(!u || !passwordMatches(password,u.pass_hash))return error(res,401,'Incorrect email or password');
 const token=randomBytes(32).toString('hex'); db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(hashToken(token),u.id,Date.now()+sessionMaxAge);
 res.cookie(cookieName,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',maxAge:sessionMaxAge,path:'/api'}).json({user:userView(u)});
});
routes.get('/auth/me',auth,(req,res)=>res.json({user:req.user}));
routes.post('/auth/logout',auth,(req,res)=>{db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hashToken(cookie(req)));res.clearCookie(cookieName,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/api'}).json({ok:true});});
routes.get('/permissions',auth,allow('roles.manage'),(req,res)=>res.json(PERMISSIONS));
routes.get('/roles',auth,allow('users.manage'),(req,res)=>{
 const roles=db.prepare('SELECT * FROM roles ORDER BY system DESC,name').all();
 res.json(roles.map(role=>({...role,permissions:db.prepare('SELECT permission FROM role_permissions WHERE role_id=?').all(role.id).map(p=>p.permission),userCount:db.prepare('SELECT COUNT(*) as count FROM users WHERE role_id=?').get(role.id).count})));
});
routes.post('/roles',auth,allow('roles.manage'),(req,res)=>{
 const name=clean(req.body?.name),description=clean(req.body?.description),permissions=req.body?.permissions;
 if(!validText(name,60)||!Array.isArray(permissions)||permissions.some(p=>!PERMISSIONS.includes(p))||new Set(permissions).size!==permissions.length)return error(res,400,'Invalid role or permissions');
 if(permissions.includes('users.manage')||permissions.includes('roles.manage')||permissions.includes('payments.approve'))return error(res,403,'Sensitive permissions are reserved for Super Admin');
 const key=id();try{db.prepare('INSERT INTO roles(id,name,description) VALUES (?,?,?)').run(key,name,description.slice(0,250));}catch(e){return error(res,409,'Role name already exists');}
 for(const permission of permissions)db.prepare('INSERT INTO role_permissions(role_id,permission) VALUES (?,?)').run(key,permission);
 res.status(201).json({id:key});
});
routes.patch('/roles/:roleId',auth,allow('roles.manage'),(req,res)=>{
 const role=db.prepare('SELECT * FROM roles WHERE id=?').get(req.params.roleId);if(!role)return error(res,404,'Role not found');if(role.name==='Super Admin')return error(res,403,'Super Admin role cannot be modified');
 const name=clean(req.body?.name),description=clean(req.body?.description),permissions=req.body?.permissions;
 if(!validText(name,60)||!Array.isArray(permissions)||permissions.some(p=>!PERMISSIONS.includes(p))||new Set(permissions).size!==permissions.length)return error(res,400,'Invalid role or permissions');
 if(permissions.some(p=>['users.manage','roles.manage','payments.approve'].includes(p)))return error(res,403,'Sensitive permissions are reserved for Super Admin');
 if(role.system && name!==role.name)return error(res,400,'Default role names cannot be changed');
 try{db.exec('BEGIN');db.prepare('UPDATE roles SET name=?,description=? WHERE id=?').run(name,description.slice(0,250),role.id);db.prepare('DELETE FROM role_permissions WHERE role_id=?').run(role.id);for(const perm of permissions)db.prepare('INSERT INTO role_permissions(role_id,permission) VALUES (?,?)').run(role.id,perm);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');return error(res,409,'Role name already exists');}res.json({ok:true});
});
routes.delete('/roles/:roleId',auth,allow('roles.manage'),(req,res)=>{
 const role=db.prepare('SELECT * FROM roles WHERE id=?').get(req.params.roleId);if(!role)return error(res,404,'Role not found');if(role.system)return error(res,403,'Cannot delete default roles');
 if(db.prepare('SELECT COUNT(*) AS n FROM users WHERE role_id=?').get(role.id).n)return error(res,409,'Reassign users before deleting this role');
 db.prepare('DELETE FROM roles WHERE id=?').run(role.id);res.json({ok:true});
});
routes.get('/users',auth,allow('users.manage'),(req,res)=>res.json(db.prepare('SELECT id,name,email,role,role_id,created_at FROM users ORDER BY created_at DESC').all().map(userView)));
routes.post('/users',auth,allow('users.manage'),(req,res)=>{
 const name=clean(req.body?.name),email=clean(req.body?.email).toLowerCase(),password=req.body?.password,roleId=req.body?.roleId;
 const role=db.prepare('SELECT * FROM roles WHERE id=?').get(roleId);
 if(!validText(name,120)||!/^\S+@\S+\.\S+$/.test(email)||email.length>180||typeof password!=='string'||password.length<12||password.length>200||!role)return error(res,400,'Provide a name, valid email, 12+ character password and role');
 if(role.name==='Super Admin')return error(res,403,'Additional Super Admin accounts must be provisioned separately');
 const base=role.name==='Marketing'?'Marketing':'Engineering';
 const key=id();try{db.prepare('INSERT INTO users(id,name,email,role,pass_hash,role_id) VALUES (?,?,?,?,?,?)').run(key,name,email,base,passwordHash(password),roleId);}catch(e){return error(res,409,'Email is already registered');}
 res.status(201).json(userView(db.prepare('SELECT * FROM users WHERE id=?').get(key)));
});
routes.patch('/users/:userId',auth,allow('users.manage'),(req,res)=>{
 const existing=db.prepare('SELECT * FROM users WHERE id=?').get(req.params.userId);if(!existing)return error(res,404,'User not found');
 if(existing.role==='Super Admin')return error(res,403,'Super Admin account cannot be reassigned');
 const name=clean(req.body?.name),roleId=req.body?.roleId,role=db.prepare('SELECT * FROM roles WHERE id=?').get(roleId);
 if(!validText(name,120)||!role||role.name==='Super Admin')return error(res,400,'Invalid name or role');
 const base=role.name==='Marketing'?'Marketing':'Engineering';
 db.prepare('UPDATE users SET name=?,role=?,role_id=? WHERE id=?').run(name,base,roleId,existing.id);
 res.json(userView(db.prepare('SELECT * FROM users WHERE id=?').get(existing.id)));
});
routes.post('/users/:userId/reset-password',auth,allow('users.manage'),(req,res)=>{
 const existing=db.prepare('SELECT * FROM users WHERE id=?').get(req.params.userId),password=req.body?.password;
 if(!existing)return error(res,404,'User not found');if(existing.role==='Super Admin')return error(res,403,'Cannot reset a Super Admin password through this screen');
 if(typeof password!=='string'||password.length<12||password.length>200)return error(res,400,'Password must contain at least 12 characters');
 db.prepare('UPDATE users SET pass_hash=? WHERE id=?').run(passwordHash(password),existing.id);
 db.prepare('DELETE FROM sessions WHERE user_id=?').run(existing.id);res.json({ok:true});
});
routes.post('/quotes',(req,res)=>{const q=req.body||{};if(!validText(q.organization,160)||!validText(q.contact,120)||!validText(q.phone,40))return error(res,400,'Organization, contact and phone required'); const key=id();db.prepare('INSERT INTO quotes(id,organization,contact,phone,email,location,service,details) VALUES(?,?,?,?,?,?,?,?)').run(key,clean(q.organization),clean(q.contact),clean(q.phone),clean(q.email).slice(0,150),clean(q.location).slice(0,250),clean(q.service).slice(0,120),clean(q.details).slice(0,2000));res.status(201).json({id:key});});
routes.get('/quotes',auth,allow('quotes.view'),(req,res)=>res.json(db.prepare("SELECT *, substr(created_at,1,10) AS created FROM quotes ORDER BY created_at DESC").all()));
function projectDetails(p){
 const payments=db.prepare('SELECT p.*,u.name AS author FROM payments p LEFT JOIN users u ON p.created_by=u.id WHERE p.project_id=? ORDER BY p.created_at DESC,p.rowid DESC').all(p.id).map(x=>({...x,date:x.received_date}));
 const updates=db.prepare('SELECT w.*,u.name AS author FROM updates w LEFT JOIN users u ON w.author_id=u.id WHERE w.project_id=? ORDER BY w.created_at DESC,w.rowid DESC').all(p.id);
 const documents=db.prepare('SELECT d.id,d.name,d.size,d.mime,d.created_at,substr(d.created_at,1,10) uploaded,u.name AS author FROM documents d LEFT JOIN users u ON d.author_id=u.id WHERE d.project_id=? ORDER BY d.created_at DESC,d.rowid DESC').all(p.id);
 return {...p,payments,updates,documents};
}
routes.get('/projects',auth,allow('projects.view'),(req,res)=>res.json(db.prepare('SELECT * FROM projects ORDER BY created_at DESC,rowid DESC').all().map(projectDetails)));
routes.get('/projects/:projectId',auth,allow('projects.view'),(req,res)=>{const p=db.prepare('SELECT * FROM projects WHERE id=?').get(req.params.projectId);if(!p)return error(res,404,'Project not found');res.json(projectDetails(p));});
routes.post('/projects',auth,allow('projects.create'),(req,res)=>{
 const p=req.body||{};const value=Number(p.value);
 if(!validText(p.name,180)||!validText(p.client,160)||!validText(p.address,300)||!Number.isFinite(value)||value<=0||value>1e12)return error(res,400,'Provide a valid project name, client, address and value');
 if(p.status && !statuses.includes(p.status))return error(res,400,'Invalid status');if(p.team && !teams.includes(p.team))return error(res,400,'Invalid team');
 if(p.start && !validDate(p.start) || p.due && !validDate(p.due))return error(res,400,'Invalid date');
 const key='EME-'+Date.now().toString(36).toUpperCase()+'-'+id().slice(0,5).toUpperCase();
 db.prepare('INSERT INTO projects(id,name,client,address,value,status,team,start,due,notes,created_by) VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(key,clean(p.name),clean(p.client),clean(p.address),value,p.status||'New',p.team||'Engineering',p.start||null,p.due||null,clean(p.notes).slice(0,5000),req.user.id);
 res.status(201).json(projectDetails(db.prepare('SELECT * FROM projects WHERE id=?').get(key)));
});
routes.patch('/projects/:projectId',auth,allow('projects.edit'),(req,res)=>{
 const p=db.prepare('SELECT * FROM projects WHERE id=?').get(req.params.projectId);if(!p)return error(res,404,'Project not found');
 const {status,team}=req.body||{};
 if(status!==undefined && !statuses.includes(status))return error(res,400,'Invalid status');
 if(team!==undefined && (!teams.includes(team)||!req.user.permissions.includes('projects.assign')))return error(res,403,'Only Super Admin can reassign teams');
 if(status===undefined&&team===undefined)return error(res,400,'No fields to update');
 db.prepare('UPDATE projects SET status=?,team=? WHERE id=?').run(status||p.status,team||p.team,p.id);
 res.json(projectDetails(db.prepare('SELECT * FROM projects WHERE id=?').get(p.id)));
});
routes.post('/projects/:projectId/updates',auth,allow('updates.create'),(req,res)=>{
 const project=db.prepare('SELECT id FROM projects WHERE id=?').get(req.params.projectId);if(!project)return error(res,404,'Project not found');
 const {summary,progress,team,date}=req.body||{}; const n=Number(progress);
 if(!validText(summary,5000)||!Number.isInteger(n)||n<0||n>100||!validDate(date)||!teams.includes(team))return error(res,400,'Invalid work update');
 if(!req.user.permissions.includes('projects.assign') && req.user.role!==team)return error(res,403,'You may update only your own team');
 db.prepare('INSERT INTO updates(id,project_id,date,team,author_id,summary,progress) VALUES(?,?,?,?,?,?,?)').run(id(),project.id,date,team,req.user.id,clean(summary),n);
 res.status(201).json({ok:true});
});
routes.post('/projects/:projectId/payments',auth,allow('payments.create'),(req,res)=>{
 const p=db.prepare('SELECT id,value FROM projects WHERE id=?').get(req.params.projectId);if(!p)return error(res,404,'Project not found');
 const {amount,date,remarks}=req.body||{};const n=Number(amount);
 if(!Number.isFinite(n)||n<=0||!validDate(date)||typeof remarks!=='string'||remarks.length>1500)return error(res,400,'Enter a valid amount, date and remarks');
 const existing=db.prepare("SELECT COALESCE(SUM(amount),0) AS sum FROM payments WHERE project_id=? AND status!='Rejected'").get(p.id).sum;
 if(Math.round((existing+n)*100)>Math.round(p.value*100))return error(res,400,'Reported payments cannot exceed contract value');
 const key=id();db.prepare('INSERT INTO payments(id,project_id,amount,received_date,remarks,created_by) VALUES(?,?,?,?,?,?)').run(key,p.id,Math.round(n*100)/100,date,clean(remarks),req.user.id);
 res.status(201).json({id:key,status:'Pending'});
});
routes.patch('/payments/:paymentId',auth,allow('payments.approve'),(req,res)=>{
 const status=req.body?.status;if(!['Confirmed','Rejected'].includes(status))return error(res,400,'Invalid decision');
 const p=db.prepare('SELECT * FROM payments WHERE id=?').get(req.params.paymentId);if(!p)return error(res,404,'Payment not found');
 if(p.status!=='Pending')return error(res,409,'This payment was already reviewed');
 db.prepare('UPDATE payments SET status=?,confirmed_by=?,confirmed_at=CURRENT_TIMESTAMP WHERE id=?').run(status,req.user.id,p.id);
 res.json({ok:true,status});
});
const uploadsDir=resolve(process.cwd(),'uploads');mkdirSync(uploadsDir,{recursive:true});
const uploader=multer({storage:multer.diskStorage({destination:uploadsDir,filename:(req,file,cb)=>cb(null,id())}),limits:{fileSize:10*1024*1024},fileFilter(req,file,cb){const allowed=['application/pdf','image/png','image/jpeg','image/webp','text/plain','application/zip','application/x-zip-compressed','application/octet-stream','application/acad','image/vnd.dwg'];if(allowed.includes(file.mimetype))cb(null,true);else cb(new Error('Unsupported document type'));}});
routes.post('/projects/:projectId/documents',auth,allow('documents.upload'),(req,res,next)=>{if(!db.prepare('SELECT id FROM projects WHERE id=?').get(req.params.projectId))return error(res,404,'Project not found');next();},uploader.single('file'),(req,res)=>{
 if(!req.file)return error(res,400,'File required');const key=id();const filename=req.file.filename;const original=basename(req.file.originalname).slice(0,250);
 try{db.prepare('INSERT INTO documents(id,project_id,name,filename,mime,size,author_id) VALUES(?,?,?,?,?,?,?)').run(key,req.params.projectId,original,filename,req.file.mimetype,req.file.size,req.user.id);res.status(201).json({id:key});}catch(err){unlinkSync(req.file.path);throw err;}
});
routes.get('/documents/:documentId/download',auth,allow('projects.view'),(req,res)=>{const d=db.prepare('SELECT * FROM documents WHERE id=?').get(req.params.documentId);if(!d)return error(res,404,'Document not found');res.download(resolve(uploadsDir,d.filename),d.name);});
app.use('/api',routes);
app.use((err,req,res,next)=>{console.error(err);if(err instanceof multer.MulterError)return error(res,400,err.message);return error(res,err.status||500,err.status?err.message:'Server error');});
const port=Number(process.env.PORT)||4000;
app.listen(port,()=>console.log(`EME API listening on http://localhost:${port}`));

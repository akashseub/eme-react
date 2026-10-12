import { DatabaseSync } from 'node:sqlite';
import { scryptSync, randomBytes, timingSafeEqual, createHash } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const dbFile = resolve(process.cwd(), process.env.DB_PATH || 'data/eme.sqlite');
mkdirSync(dirname(dbFile), { recursive: true });
export const db = new DatabaseSync(dbFile);
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
db.exec(`
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, role TEXT NOT NULL CHECK(role IN ('Super Admin','Marketing','Engineering')), pass_hash TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, name TEXT NOT NULL, client TEXT NOT NULL, address TEXT NOT NULL, value REAL NOT NULL CHECK(value>0), status TEXT NOT NULL DEFAULT 'New', team TEXT NOT NULL DEFAULT 'Engineering', start TEXT, due TEXT, notes TEXT DEFAULT '', created_by TEXT REFERENCES users(id), created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS payments (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, amount REAL NOT NULL CHECK(amount>0), received_date TEXT NOT NULL, remarks TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending','Confirmed','Rejected')), created_by TEXT NOT NULL REFERENCES users(id), confirmed_by TEXT REFERENCES users(id), confirmed_at TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS updates (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, date TEXT NOT NULL, team TEXT NOT NULL, author_id TEXT REFERENCES users(id), summary TEXT NOT NULL, progress INTEGER NOT NULL CHECK(progress>=0 AND progress<=100), created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, name TEXT NOT NULL, filename TEXT NOT NULL, mime TEXT, size INTEGER NOT NULL, author_id TEXT REFERENCES users(id), created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS quotes (id TEXT PRIMARY KEY, organization TEXT NOT NULL, contact TEXT NOT NULL, phone TEXT NOT NULL, email TEXT DEFAULT '', location TEXT DEFAULT '', service TEXT DEFAULT '', details TEXT DEFAULT '', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_payment_project ON payments(project_id);
CREATE INDEX IF NOT EXISTS idx_update_project ON updates(project_id);
CREATE INDEX IF NOT EXISTS idx_doc_project ON documents(project_id);
`);
// Configurable roles and module-level permissions. Existing accounts remain valid.
db.exec(`
CREATE TABLE IF NOT EXISTS roles (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE COLLATE NOCASE, description TEXT NOT NULL DEFAULT '', system INTEGER NOT NULL DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS role_permissions (role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE, permission TEXT NOT NULL, PRIMARY KEY(role_id,permission));
`);
const cols=db.prepare('PRAGMA table_info(users)').all().map(x=>x.name);
if (!cols.includes('role_id')) db.exec('ALTER TABLE users ADD COLUMN role_id TEXT REFERENCES roles(id)');
export const PERMISSIONS = [
 'dashboard.view','projects.view','projects.create','projects.edit','projects.assign',
 'updates.create','documents.upload','payments.view','payments.create','payments.approve',
 'quotes.view','users.manage','roles.manage'
];
export function seedRoles(){
 const defaults={
  'Super Admin':PERMISSIONS,
  'Marketing':['dashboard.view','projects.view','projects.create','projects.edit','updates.create','documents.upload','payments.view','payments.create','quotes.view'],
  'Engineering':['dashboard.view','projects.view','projects.edit','updates.create','documents.upload','payments.view']
 };
 for(const [name,permissions] of Object.entries(defaults)){
  const key='system-'+name.toLowerCase().replace(/ /g,'-');
  const result=db.prepare('INSERT OR IGNORE INTO roles(id,name,description,system) VALUES (?,?,?,1)').run(key,name,`${name} default role`);
  // Seed permissions only once, so admin edits persist after backend restarts.
  if(result.changes) for(const permission of permissions) db.prepare('INSERT OR IGNORE INTO role_permissions(role_id,permission) VALUES (?,?)').run(key,permission);
 }
 db.prepare("UPDATE users SET role_id='system-super-admin' WHERE role='Super Admin' AND role_id IS NULL").run();
 db.prepare("UPDATE users SET role_id='system-marketing' WHERE role='Marketing' AND role_id IS NULL").run();
 db.prepare("UPDATE users SET role_id='system-engineering' WHERE role='Engineering' AND role_id IS NULL").run();
}
export function userWithPermissions(user){
 if(!user) return null;
 const role=db.prepare('SELECT id,name FROM roles WHERE id=?').get(user.role_id);
 const permissions=role ? db.prepare('SELECT permission FROM role_permissions WHERE role_id=?').all(role.id).map(p=>p.permission) : [];
 return {id:user.id,name:user.name,email:user.email,role:role?.name||user.role,roleId:user.role_id,permissions};
}
export function passwordHash(password,salt=randomBytes(16).toString('hex')) { return `${salt}:${scryptSync(password,salt,64).toString('hex')}`; }
export function passwordMatches(password,hash) { const [salt,expected] = hash.split(':'); if(!salt||!expected)return false; const supplied=scryptSync(password,salt,64); const known=Buffer.from(expected,'hex'); return known.length===supplied.length && timingSafeEqual(supplied,known); }
export const id=()=>randomBytes(16).toString('hex');
export const hashToken=token=>createHash('sha256').update(token).digest('hex');
export function seedDevUsers(){
  seedRoles();
  if (process.env.DEMO_SEED !== 'true') return;
  // Provision only the initial administrator. Other accounts are created from Users & Roles.
  const accounts=[['Administrator','admin@eme.local','Super Admin',process.env.ADMIN_PASSWORD]];
  for(const [name,email,role,password] of accounts) {
    if(!password || password.length<12) throw Error(`Set a 12+ character password for ${email} in server/.env`);
    db.prepare('INSERT OR IGNORE INTO users(id,name,email,role,pass_hash,role_id) VALUES (?,?,?,?,?,?)').run(id(),name,email,role,passwordHash(password),'system-'+role.toLowerCase().replace(/ /g,'-'));
    db.prepare('UPDATE users SET role_id=? WHERE email=? AND role_id IS NULL').run('system-'+role.toLowerCase().replace(/ /g,'-'),email);
  }
}

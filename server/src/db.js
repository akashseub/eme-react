import mongoose from 'mongoose';
import { scryptSync, randomBytes, timingSafeEqual, createHash } from 'node:crypto';
const options = { _id:false, strict:true, versionKey:false };
const schema = (fields, collection) => mongoose.model(collection, new mongoose.Schema({id:{type:String,required:true,unique:true},...fields,created_at:{type:String,default:()=>new Date().toISOString()}},options),collection);
export const User=schema({name:String,email:{type:String,unique:true},role:String,role_id:String,pass_hash:String},'users');
export const Role=schema({name:{type:String,unique:true},description:{type:String,default:''},system:{type:Boolean,default:false},permissions:[String]},'roles');
export const Session=schema({token_hash:{type:String,unique:true},user_id:String,expires_at:Number},'sessions');
export const Project=schema({name:String,client:String,address:String,value:Number,status:{type:String,default:'New'},team:{type:String,default:'Engineering'},start:String,due:String,notes:String,created_by:String},'projects');
export const Payment=schema({project_id:String,amount:Number,received_date:String,remarks:String,status:{type:String,default:'Pending'},created_by:String,confirmed_by:String,confirmed_at:String},'payments');
export const Update=schema({project_id:String,date:String,team:String,author_id:String,summary:String,progress:Number},'updates');
export const Document=schema({project_id:String,name:String,filename:String,mime:String,size:Number,author_id:String},'documents');
export const Quote=schema({organization:String,contact:String,phone:String,email:String,location:String,service:String,details:String},'quotes');
export const PERMISSIONS=['dashboard.view','projects.view','projects.create','projects.edit','projects.assign','updates.create','documents.upload','payments.view','payments.create','payments.approve','quotes.view','users.manage','roles.manage'];
export const id=()=>randomBytes(16).toString('hex');
export const hashToken=t=>createHash('sha256').update(t).digest('hex');
export function passwordHash(password,salt=randomBytes(16).toString('hex')){return `${salt}:${scryptSync(password,salt,64).toString('hex')}`;}
export function passwordMatches(password,hash){if(!hash)return false;const [salt,expected]=hash.split(':');if(!salt||!expected)return false;const a=scryptSync(password,salt,64),b=Buffer.from(expected,'hex');return a.length===b.length&&timingSafeEqual(a,b);}
export const plain = doc => doc?.toObject ? doc.toObject() : doc;
export async function userWithPermissions(user){if(!user)return null;const role=await Role.findOne({id:user.role_id}).lean();return {id:user.id,name:user.name,email:user.email,role:role?.name||user.role,roleId:user.role_id,permissions:role?.permissions||[]};}
export async function initializeDatabase(){
 if(!process.env.MONGODB_URI)throw Error('MONGODB_URI is required in server/.env');
 await mongoose.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:10000});
 const defaults={'Super Admin':PERMISSIONS,Marketing:['dashboard.view','projects.view','projects.create','projects.edit','updates.create','documents.upload','payments.view','payments.create','quotes.view'],Engineering:['dashboard.view','projects.view','projects.edit','updates.create','documents.upload','payments.view']};
 for(const [name,permissions] of Object.entries(defaults)){const key='system-'+name.toLowerCase().replaceAll(' ','-');await Role.updateOne({id:key},{$setOnInsert:{id:key,name,description:`${name} default role`,system:true,permissions}},{upsert:true});}
 if(process.env.DEMO_SEED==='true'){
 const password=process.env.ADMIN_PASSWORD;if(!password||password.length<12)throw Error('ADMIN_PASSWORD must be at least 12 characters');
 await User.updateOne({email:'admin@eme.local'},{$setOnInsert:{id:id(),name:'Administrator',email:'admin@eme.local',role:'Super Admin',role_id:'system-super-admin',pass_hash:passwordHash(password)}},{upsert:true});
 }
}

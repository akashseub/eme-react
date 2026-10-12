import {useState} from 'react';
import {patch} from '@/lib/api';
import {money} from '@/data/store';
import Pill from '@/components/common/StatusPill';
export default function PaymentHistoryTable({projects,user,refresh,showProject=false}){
 const [busy,setBusy]=useState('');const [error,setError]=useState('');
 const rows=projects.flatMap(project=>(project.payments||[]).map(payment=>({project,payment})));
 async function decide(paymentId,status){setError('');setBusy(paymentId);try{await patch('/payments/'+encodeURIComponent(paymentId),{status});await refresh()}catch(err){setError(err.message)}finally{setBusy('')}}
 return <div className="panel"><div className="panel-heading" style={{padding:'20px 22px'}}><div><h3>Payment History</h3><p>Manual receipts, remarks and approval status</p></div></div>{error&&<div className="form-error">{error}</div>}<div className="table-wrap"><table><thead><tr>{showProject&&<th>PROJECT</th>}<th>DATE</th><th>AMOUNT (BDT)</th><th>REMARKS</th><th>RECORDED BY</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{rows.map(({project,payment:p})=><tr key={p.id}>{showProject&&<td>{project.name}</td>}<td>{p.date}</td><td><b>{money(p.amount)}</b></td><td>{p.remarks||'—'}</td><td>{p.author||'—'}</td><td><Pill status={p.status}/></td><td>{p.status==='Pending'&&user.permissions?.includes('payments.approve')?<div style={{display:'flex',gap:6,flexWrap:'wrap'}}><button disabled={busy===p.id} className="btn btn-mini" onClick={()=>decide(p.id,'Confirmed')}>Confirm</button><button disabled={busy===p.id} className="btn btn-mini btn-soft" onClick={()=>decide(p.id,'Rejected')}>Reject</button></div>:p.status==='Pending'?'Awaiting approval':'—'}</td></tr>)}</tbody></table>{rows.length===0&&<div className="empty">No payment receipts recorded yet.</div>}</div></div>
}


import Field from '@/components/common/Field';
import Logo from '@/components/common/Logo';
import Pill from '@/components/common/StatusPill';
import Titlebar from '@/components/common/PageTitle';

function Quotes({quotes}){return <><Titlebar eyebrow="LEADS & INQUIRIES" title="Quote Requests" description="Quotation inquiries saved on the server."/><div className="panel"><div className="table-wrap"><table><thead><tr><th>ORGANIZATION</th><th>CONTACT</th><th>SERVICE</th><th>DATE</th></tr></thead><tbody>{quotes.map(q=><tr key={q.id}><td><b>{q.organization}</b><small>{q.location||'Location not provided'}</small></td><td>{q.contact}<small>{q.phone} · {q.email}</small></td><td>{q.service||'Not selected'}<small>{q.details}</small></td><td>{q.created}</td></tr>)}</tbody></table>{quotes.length===0&&<div className="empty">No requests yet. Submit a quotation request on the landing page to see it here.</div>}</div></div></>}
export default Quotes;

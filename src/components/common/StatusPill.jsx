

const StatusPill=({status})=><span className={'status-pill status-'+status.toLowerCase().replaceAll(' ','-')}>{status}</span>;
export default StatusPill;

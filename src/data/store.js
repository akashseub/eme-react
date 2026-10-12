// Display helpers and enum values. Records are persisted by the backend SQLite database.
export const statuses=['New','In Progress','Pending Documents','Under Review','Completed','On Hold'];
export const roles=['Super Admin','Marketing','Engineering'];
export const money=value=>'৳'+Number(value||0).toLocaleString('en-BD',{minimumFractionDigits:0,maximumFractionDigits:2});
export const today=()=>new Date().toLocaleDateString('en-CA');

import Titlebar from '@/components/common/PageTitle';
import PaymentHistoryTable from '@/components/projects/PaymentHistoryTable';
export default function Payments({user,projects,refresh}) {return <><Titlebar eyebrow="FINANCIAL TRACKING" title="Payment Management" description="Actual receipts, dates, remarks and Super Admin approvals — without installments or payment terms."/><PaymentHistoryTable projects={projects} user={user} refresh={refresh} showProject/></>}

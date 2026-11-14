import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const allAppliedJobs = useSelector(store => store.job.allAppliedJobs);
    const appliedJobs = Array.isArray(allAppliedJobs) ? allAppliedJobs : [];
    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        appliedJobs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className='h-24 text-center text-slate-500'>
                                    You haven&apos;t applied any job yet.
                                </TableCell>
                            </TableRow>
                        ) : appliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id}>
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{appliedJob?.job?.title || 'Job no longer available'}</TableCell>
                                <TableCell>{appliedJob?.job?.company?.name || 'N/A'}</TableCell>
                                <TableCell className="text-right"><Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob?.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>{(appliedJob?.status || 'pending').toUpperCase()}</Badge></TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable
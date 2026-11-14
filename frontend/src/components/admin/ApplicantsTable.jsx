import { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { setAllApplicants } from '@/redux/applicationSlice';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();
    const [openApplicantId, setOpenApplicantId] = useState(null);
    const [updatingApplicantId, setUpdatingApplicantId] = useState(null);

    const statusHandler = async (status, applicationId) => {
        setOpenApplicantId(null);
        setUpdatingApplicantId(applicationId);
        try {
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${applicationId}/update`,
                { status },
                { withCredentials: true }
            );
            if (res.data.success) {
                dispatch(setAllApplicants({
                    ...applicants,
                    applications: applicants.applications.map(application =>
                        application._id === applicationId
                            ? { ...application, status: status.toLowerCase() }
                            : application
                    )
                }));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to update applicant status.');
        } finally {
            setUpdatingApplicantId(null);
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell >
                                    {
                                        item.applicant?.profile?.resume ? <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a> : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.applicant?.createdAt ? item.applicant.createdAt.split("T")[0] : 'N/A'}</TableCell>
                                <TableCell className="text-right">
                                    {['accepted', 'rejected'].includes(item?.status?.toLowerCase()) ? (
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${item.status.toLowerCase() === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {item.status}
                                        </span>
                                    ) : (
                                        <Popover
                                            open={openApplicantId === item._id}
                                            onOpenChange={(isOpen) => setOpenApplicantId(isOpen ? item._id : null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    disabled={updatingApplicantId === item._id}
                                                    aria-label={`Set status for ${item?.applicant?.fullname || 'applicant'}`}
                                                    className='rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50'
                                                >
                                                    <MoreHorizontal className='h-5 w-5' />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-36 rounded-xl p-2">
                                                {shortlistingStatus.map((status) => (
                                                    <button
                                                        type="button"
                                                        onClick={() => statusHandler(status, item?._id)}
                                                        key={status}
                                                        disabled={updatingApplicantId === item._id}
                                                        className='my-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium capitalize text-slate-700 transition hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50'
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </TableCell>

                            </tr>
                        ))
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable
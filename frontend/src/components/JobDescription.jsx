import { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/utils/Axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const [isApplied, setIsApplied] = useState(false);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const applyJobHandler = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            const res = await api.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {});
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                const updatedSingleJob = {...singleJob, applications:[...(singleJob.applications || []), res.data.applicationId]}
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to apply for this job. Please check your connection and try again.');
        }
    }

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await api.get(`${JOB_API_END_POINT}/get/${jobId}`);
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(false);
                    if (user?._id) {
                        const applicationRes = await api.get(`${APPLICATION_API_END_POINT}/check/${jobId}`);
                        setIsApplied(applicationRes.data.applied);
                    }
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Unable to load job details. Please check your connection and try again.');
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    return (
        <main className='mx-auto my-6 max-w-7xl sm:my-10'>
            <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
                <div className='min-w-0'>
                    <h1 className='break-words text-xl font-bold sm:text-2xl'>{singleJob?.title}</h1>
                    <div className='mt-4 flex flex-wrap items-center gap-2'>
                        <Badge className={'text-blue-700 font-bold'} variant="ghost">{singleJob?.position} Positions</Badge>
                        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
                        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{singleJob?.salary}LPA</Badge>
                    </div>
                </div>
                <Button
                onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                    className={`w-full rounded-lg sm:w-auto ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}>
                    {isApplied ? 'Already Applied' : user ? 'Apply Now' : 'Login to Apply'}
                </Button>
            </div>
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
            <div className='my-4 space-y-3 text-sm sm:text-base'>
                <p className='break-words font-bold'>Role: <span className='font-normal text-gray-800'>{singleJob?.title}</span></p>
                <p className='break-words font-bold'>Location: <span className='font-normal text-gray-800'>{singleJob?.location}</span></p>
                <p className='break-words font-bold'>Description: <span className='font-normal text-gray-800'>{singleJob?.description}</span></p>
                <p className='break-words font-bold'>Experience: <span className='font-normal text-gray-800'>{singleJob?.experienceLevel ?? singleJob?.experience} yrs</span></p>
                <p className='break-words font-bold'>Salary: <span className='font-normal text-gray-800'>{singleJob?.salary}LPA</span></p>
                <p className='break-words font-bold'>Total Applicants: <span className='font-normal text-gray-800'>{singleJob?.applications?.length}</span></p>
                <p className='break-words font-bold'>Posted Date: <span className='font-normal text-gray-800'>{singleJob?.createdAt ? singleJob.createdAt.split("T")[0] : 'N/A'}</span></p>
            </div>
        </main>
    )
}

export default JobDescription
import { setAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import api from '@/utils/Axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllAdminJobs = async () => {
            try {
                const res = await api.get(`${JOB_API_END_POINT}/getadminjobs`);
                if(res.data.success){
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Unable to load your jobs. Please check your connection and try again.');
            }
        }
        fetchAllAdminJobs();
    },[dispatch])
}

export default useGetAllAdminJobs
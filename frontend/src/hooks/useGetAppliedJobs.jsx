import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"

const useGetAppliedJobs = (enabled = true) => {
    const dispatch = useDispatch();

    useEffect(()=>{
        if (!enabled) return;

        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {withCredentials:true});
                if(res.data.success){
                    dispatch(setAllAppliedJobs(res.data.application));
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Unable to load your applications. Please check your connection and try again.');
            }
        }
        fetchAppliedJobs();
    },[dispatch, enabled])
};
export default useGetAppliedJobs;
import { setSingleCompany } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import api from '@/utils/Axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchSingleCompany = async () => {
            try {
                const res = await api.get(`${COMPANY_API_END_POINT}/get/${companyId}`);
                if(res.data.success){
                    dispatch(setSingleCompany(res.data.company));
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Unable to load company details. Please check your connection and try again.');
            }
        }
        fetchSingleCompany();
    },[companyId, dispatch])
}

export default useGetCompanyById
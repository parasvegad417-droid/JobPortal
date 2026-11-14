import { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setSearchCompanyByText(input));
    },[dispatch, input]);
    return (
        <div>
            <Navbar />
            <div className='mx-auto my-6 max-w-6xl sm:my-10'>
                <div className='my-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <Input
                        className="w-full sm:max-w-xs"
                        placeholder="Filter by name"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button className='w-full sm:w-auto' onClick={() => navigate("/admin/companies/create")}>New Company</Button>
                </div>
                <CompaniesTable/>
            </div>
        </div>
    )
}

export default Companies
import { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button' 
import { useNavigate } from 'react-router-dom' 
import { useDispatch } from 'react-redux' 
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [dispatch, input]);
  return (
    <div>
      <Navbar />
      <div className='mx-auto my-6 max-w-6xl sm:my-10'>
        <div className='my-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <Input
            className="w-full sm:max-w-xs"
            placeholder="Filter by name, role"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button className='w-full sm:w-auto' onClick={() => navigate("/admin/jobs/create")}>New Jobs</Button>
        </div>
        <AdminJobsTable />
      </div>
    </div>
  )
}

export default AdminJobs
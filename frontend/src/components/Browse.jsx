import { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

// const randomJobs = [1, 2,45];

const Browse = () => {
    useGetAllJobs();
    const {allJobs} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[dispatch])
    return (
        <div>
            <Navbar />
            <main className='mx-auto my-6 max-w-7xl sm:my-10'>
                <h1 className='my-6 text-lg font-bold sm:my-10 sm:text-xl'>Search Results ({allJobs.length})</h1>
                <div className='grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3'>
                    {
                        allJobs.map((job) => {
                            return (
                                <Job key={job._id} job={job}/>
                            )
                        })
                    }
                </div>
            </main>
        </div>
    )
}

export default Browse
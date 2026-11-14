import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);

    return (
        <div className='mx-auto my-20 max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-8 flex items-center justify-between'>
                <h1 className='text-3xl font-bold sm:text-4xl'>
                    <span className='text-[#6A38C2]'>Latest & Top </span> Job Openings
                </h1>
            </div>

            <div className='grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3'>
                {allJobs.length <= 0 ? (
                    <span className='text-slate-500'>No Job Available</span>
                ) : (
                    allJobs?.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job} />)
                )}
            </div>
        </div>
    )
}

export default LatestJobs
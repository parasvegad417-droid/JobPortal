import { useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const query = searchedQuery.trim().toLowerCase();
    const filterJobs = allJobs.filter((job) => {
        const matchesQuery = !query || [job.title, job.description, job.location]
            .some(value => value?.toLowerCase().includes(query));
        const matchesFilter = !selectedFilter ||
            String(job[selectedFilter.field]).toLowerCase() === String(selectedFilter.value).toLowerCase();

        return matchesQuery && matchesFilter;
    });

    return (
        <div>
            <Navbar />
            <main className='mx-auto mt-5 max-w-7xl'>
                <div className='flex flex-col gap-5 md:flex-row md:gap-6'>
                    <div className='w-full shrink-0 md:w-64'>
                        <FilterCard
                            jobs={allJobs}
                            selectedFilter={selectedFilter}
                            onFilterChange={setSelectedFilter}
                        />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span className='py-6 text-slate-500'>Job not found</span> : (
                            <div className='min-w-0 flex-1 pb-5 md:h-[calc(100vh-7rem)] md:overflow-y-auto'>
                                <div className='grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                className='h-full'
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </main>
        </div>
    )
}

export default Jobs
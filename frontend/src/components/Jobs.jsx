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
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex flex-col gap-y-5 gap-x-1 md:flex-row'>
                    <div className='w-full shrink-0 md:w-64'>
                        <FilterCard
                            jobs={allJobs}
                            selectedFilter={selectedFilter}
                            onFilterChange={setSelectedFilter}
                        />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2 xl:grid-cols-3'>
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
            </div>


        </div>
    )
}

export default Jobs
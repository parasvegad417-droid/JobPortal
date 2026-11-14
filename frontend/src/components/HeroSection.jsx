import { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <section className='px-4 text-center sm:px-6'>
            <div className='mx-auto my-12 flex max-w-4xl flex-col gap-5 sm:my-16'>
                <span className='mx-auto rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-[#F83002] sm:text-base'>No. 1 Job Hunt Website</span>
                <h1 className='text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl'>Search, Apply &amp; <br className='hidden sm:block' /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span></h1>
                <p className='mx-auto max-w-2xl text-sm leading-6 text-slate-600 sm:text-base'>Find opportunities that match your skills and take the next step in your career.</p>
                <div className='mx-auto flex w-full max-w-xl items-center gap-2 rounded-full border border-gray-200 bg-white p-1.5 pl-4 shadow-lg sm:gap-4 sm:pl-5'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        className='w-full min-w-0 border-none bg-transparent text-sm outline-none placeholder:text-slate-400 sm:text-base'

                    />
                    <Button onClick={searchJobHandler} aria-label='Search jobs' className="shrink-0 rounded-full bg-[#6A38C2]">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
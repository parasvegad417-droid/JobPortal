import { Button } from './ui/button'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        if (!mongodbTime) return 0;
        const createdAt = new Date(mongodbTime);
        if (Number.isNaN(createdAt.getTime())) return 0;
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }
    const daysAgo = daysAgoFunction(job?.createdAt);

    return (
        <article className='group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_40px_rgba(109,40,217,0.12)]'>
            <div className='flex flex-1 flex-col p-5 sm:p-6'>
                <p className='mb-3 text-right text-xs font-medium text-slate-500'>
                    Posted {daysAgo} days ago
                </p>
                <div className='mb-5 flex items-center gap-3'>
                    {job?.company?.logo ? (
                        <img
                            src={job.company.logo}
                            alt={job?.company?.name || 'Company'}
                            className='h-12 w-12 shrink-0 rounded-xl border border-slate-100 bg-white object-cover'
                        />
                    ) : (
                        <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-lg font-bold text-violet-700'>
                            {job?.company?.name?.charAt(0) || 'J'}
                        </div>
                    )}
                    <div className='min-w-0'>
                        <h2 className='truncate font-semibold text-slate-900'>{job?.company?.name || 'Company'}</h2>
                        <p className='mt-1 flex items-center gap-1 text-sm text-slate-500'>
                            <MapPin className='h-3.5 w-3.5' />
                            {job?.location || 'Location not specified'}
                        </p>
                    </div>
                </div>

                <div className='flex-1'>
                    <h3 className='text-xl font-bold leading-snug text-slate-900'>{job?.title}</h3>
                    <p className='mt-2 line-clamp-3 text-sm leading-6 text-slate-600'>{job?.description}</p>
                </div>
                <div className='mt-5 flex flex-wrap gap-2'>
                    <Badge className='rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700 hover:bg-blue-50' variant='ghost'>{job?.position} Positions</Badge>
                    <Badge className='rounded-full bg-orange-50 px-3 py-1 font-semibold text-orange-700 hover:bg-orange-50' variant='ghost'>{job?.jobType}</Badge>
                    <Badge className='rounded-full bg-violet-50 px-3 py-1 font-semibold text-violet-700 hover:bg-violet-50'>{job?.salary} LPA</Badge>
                </div>
                <div className='mt-6 border-t border-slate-100 pt-4'>
                    <Button onClick={() => navigate(`/description/${job?._id}`)} className='w-full justify-between rounded-xl bg-violet-600 px-5 hover:bg-violet-700'>
                        View details
                        <ArrowUpRight className='h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
                    </Button>
                </div>
            </div>
        </article>
    )
}

export default Job
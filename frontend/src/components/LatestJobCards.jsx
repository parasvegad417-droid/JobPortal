import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    const companyImage = job?.company?.logo;

    return (
        <div
            onClick={() => navigate(`/description/${job._id}`)}
            className='group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(109,40,217,0.12)]'
        >
            <div className='flex flex-1 flex-col p-5'>
                <div className='mb-4 flex items-center gap-3'>
                    {companyImage ? (
                        <img
                            src={companyImage}
                            alt={job?.company?.name || 'Company'}
                            className='h-11 w-11 rounded-xl border border-slate-200 object-cover'
                        />
                    ) : (
                        <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 font-bold text-violet-700'>
                            {job?.company?.name?.charAt(0) || 'J'}
                        </div>
                    )}
                    <div>
                        <h3 className='line-clamp-1 text-lg font-semibold text-slate-900'>{job?.company?.name}</h3>
                        <p className='line-clamp-1 text-sm text-slate-500'>{job?.location || 'India'}</p>
                    </div>
                </div>

                <h4 className='line-clamp-2 min-h-[3.5rem] text-xl font-bold text-slate-900'>{job?.title}</h4>
                <p className='mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600'>{job?.description}</p>

                <div className='mt-auto flex flex-wrap gap-2 pt-4'>
                    <Badge className='bg-blue-50 text-blue-700 hover:bg-blue-50' variant='ghost'>{job?.position} Positions</Badge>
                    <Badge className='bg-orange-50 text-orange-700 hover:bg-orange-50' variant='ghost'>{job?.jobType}</Badge>
                    <Badge className='bg-violet-50 text-violet-700 hover:bg-violet-50' variant='ghost'>{job?.salary} LPA</Badge>
                </div>
            </div>
        </div>
    )
}

export default LatestJobCards
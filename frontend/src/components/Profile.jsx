import { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();
    const skills = user?.profile?.skills ?? [];
    const resumeUrl = user?.profile?.resume;

    useGetAppliedJobs(Boolean(user));

    useEffect(() => {
        if (!user) navigate('/login', { replace: true });
    }, [navigate, user]);

    return (
        <div>
            <Navbar />
            <div className='mx-auto my-5 max-w-4xl rounded-2xl border border-gray-200 bg-white p-4 sm:p-8'>
                <div className='flex items-start justify-between gap-3 sm:items-center'>
                    <div className='flex min-w-0 items-center gap-3 sm:gap-4'>
                        <Avatar className="h-16 w-16 shrink-0 sm:h-24 sm:w-24">
                            <AvatarImage
                                src={user?.profile?.profilePhoto}
                                alt={`${user?.fullname || 'User'} profile`}
                                className='object-cover'
                            />
                            <AvatarFallback className='bg-violet-100 text-2xl font-semibold text-violet-700'>
                                {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className='min-w-0'>
                            <h1 className='break-words text-lg font-medium sm:text-xl'>{user?.fullname}</h1>
                            <p className='break-words text-sm text-slate-600 sm:text-base'>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                </div>
                <div className='my-5 space-y-2'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span className='min-w-0 break-all'>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex flex-wrap items-center gap-1'>
                        {skills.length > 0
                            ? skills.map((item, index) => <Badge key={`${item}-${index}`}>{item}</Badge>)
                            : <span>NA</span>}
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        resumeUrl
                            ? <a target='_blank' rel='noreferrer' href={resumeUrl} className='text-blue-500 w-full cursor-pointer hover:underline'>{user?.profile?.resumeOriginalName || 'View resume'}</a>
                            : <span>NA</span>
                    }
                </div>
            </div>
            <div className='mx-auto max-w-4xl rounded-2xl bg-white'>
                <h1 className='my-5 text-lg font-bold'>Applied Jobs</h1>
                {/* Applied Job Table   */}
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile
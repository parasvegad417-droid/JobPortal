import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to log out');
        }
    }

    return (
        <header className='sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl'>
            <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
                <Link to='/' className='text-2xl font-black tracking-tight text-slate-900'>
                    Job<span className='text-[#F83002]'>Portal</span>
                </Link>
                <nav className='ml-auto mr-14 hidden items-center gap-8 md:flex'>
                    {user && user.role === 'recruiter' ? (
                        <>
                            <Link className='nav-link' to='/admin/companies'>Companies</Link>
                            <Link className='nav-link' to='/admin/jobs'>Jobs</Link>
                        </>
                    ) : (
                        <>
                            <Link className='nav-link' to='/'>Home</Link>
                            <Link className='nav-link' to='/jobs'>Jobs</Link>
                            <Link className='nav-link' to='/browse'>Browse</Link>
                        </>
                    )}
                </nav>

                {!user ? (
                    <div className='flex items-center gap-3'>
                        <Link to='/login'><Button variant='outline' className='rounded-full border-slate-200 bg-white px-5'>Login</Button></Link>
                        <Link to='/signup'><Button className='rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 shadow-lg shadow-violet-200 hover:brightness-110'>Signup</Button></Link>
                    </div>
                ) : (
                    <Popover>
                        <PopoverTrigger asChild>
                            <button type='button' className='rounded-full ring-2 ring-violet-100 transition hover:ring-violet-200'>
                                <Avatar className='h-10 w-10 cursor-pointer'>
                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname || 'User'} />
                                </Avatar>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className='w-80 rounded-2xl border-slate-200 p-4 shadow-xl'>
                            <div className='flex items-center gap-3 border-b border-slate-100 pb-4'>
                                <Avatar className='h-12 w-12'>
                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname || 'User'} />
                                </Avatar>
                                <div>
                                    <h4 className='font-semibold text-slate-900'>{user?.fullname}</h4>
                                    <p className='text-sm text-slate-500'>{user?.profile?.bio || 'Career growth enthusiast'}</p>
                                </div>
                            </div>
                            <div className='mt-4 flex flex-col gap-2 text-slate-600'>
                                {user && user.role === 'student' && (
                                    <Link to='/profile' className='flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-violet-50 hover:text-violet-700'>
                                        <User2 className='h-4 w-4' />
                                        View Profile
                                    </Link>
                                )}
                                <button type='button' onClick={logoutHandler} className='flex items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-red-50 hover:text-red-600'>
                                    <LogOut className='h-4 w-4' />
                                    Logout
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            </div>
        </header>
    )
}

export default Navbar
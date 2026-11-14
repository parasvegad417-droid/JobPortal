import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, Menu, User2, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import api from '@/utils/Axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await api.get(`${USER_API_END_POINT}/logout`);
            if (res.data.success) {
                dispatch(setUser(null));
                setMobileMenuOpen(false);
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to log out');
        }
    }

    return (
        <header className='sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between'>
                    <Link to='/' className='text-2xl font-black tracking-tight text-slate-900'>
                        Job<span className='text-[#F83002]'>Portal</span>
                    </Link>
                    <nav className='ml-auto mr-8 hidden items-center gap-8 lg:flex'>
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
                        <div className='hidden items-center gap-3 lg:flex'>
                            <Link to='/login'><Button variant='outline' className='rounded-full border-slate-200 bg-white px-5'>Login</Button></Link>
                            <Link to='/signup'><Button className='rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 shadow-lg shadow-violet-200 hover:brightness-110'>Signup</Button></Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <button type='button' aria-label='Open account menu' className='rounded-full ring-2 ring-violet-100 transition hover:ring-violet-200'>
                                    <Avatar className='h-10 w-10 cursor-pointer'>
                                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname || 'User'} />
                                    </Avatar>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className='w-72 max-w-[calc(100vw-2rem)] rounded-2xl border-slate-200 p-4 shadow-xl'>
                                <div className='flex min-w-0 items-center gap-3 border-b border-slate-100 pb-4'>
                                    <Avatar className='h-12 w-12 shrink-0'>
                                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname || 'User'} />
                                    </Avatar>
                                    <div className='min-w-0'>
                                        <h4 className='truncate font-semibold text-slate-900'>{user?.fullname}</h4>
                                        <p className='line-clamp-2 text-sm text-slate-500'>{user?.profile?.bio || 'Career growth enthusiast'}</p>
                                    </div>
                                </div>
                                <div className='mt-4 flex flex-col gap-2 text-slate-600'>
                                    {user.role === 'student' && (
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
                    <button
                        type='button'
                        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={mobileMenuOpen}
                        onClick={() => setMobileMenuOpen(open => !open)}
                        className='ml-3 inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden'
                    >
                        {mobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
                    </button>
                </div>
                <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} border-t border-slate-100 py-3 lg:hidden`}>
                    <div className='flex flex-col gap-1'>
                        {user?.role === 'recruiter' ? (
                            <>
                                <Link onClick={() => setMobileMenuOpen(false)} className='rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-violet-50' to='/admin/companies'>Companies</Link>
                                <Link onClick={() => setMobileMenuOpen(false)} className='rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-violet-50' to='/admin/jobs'>Jobs</Link>
                            </>
                        ) : (
                            <>
                                <Link onClick={() => setMobileMenuOpen(false)} className='rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-violet-50' to='/'>Home</Link>
                                <Link onClick={() => setMobileMenuOpen(false)} className='rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-violet-50' to='/jobs'>Jobs</Link>
                                <Link onClick={() => setMobileMenuOpen(false)} className='rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-violet-50' to='/browse'>Browse</Link>
                            </>
                        )}
                        {!user && (
                            <div className='mt-2 grid grid-cols-2 gap-3'>
                                <Link onClick={() => setMobileMenuOpen(false)} to='/login'><Button variant='outline' className='w-full rounded-full border-slate-200 bg-white'>Login</Button></Link>
                                <Link onClick={() => setMobileMenuOpen(false)} to='/signup'><Button className='w-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600'>Signup</Button></Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Navbar
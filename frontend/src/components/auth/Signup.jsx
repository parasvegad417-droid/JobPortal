import { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const {loading,user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file && !file.type.startsWith('image/')) {
            toast.error('Profile photo must be an image.');
            e.target.value = '';
            setInput({ ...input, file: null });
            return;
        }
        setInput({ ...input, file });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.fullname.trim()) {
            toast.error('Full name is required.');
            return;
        }
        const formData = new FormData();    //formdata object
        formData.append("fullname", input.fullname.trim());
        formData.append("email", input.email.trim());
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to create account.');
        } finally{
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[navigate, user])
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='my-10 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8'>
                    <h1 className='text-2xl font-bold text-slate-900'>Create your account</h1>
                    <p className='mb-6 mt-1 text-sm text-slate-500'>Join us to find your next opportunity.</p>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Your full name"
                            maxLength={80}
                            required
                            className='mt-1 h-12 rounded-xl border-slate-200 bg-slate-50 placeholder:text-slate-400 focus-visible:bg-white'
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="you@example.com"
                            maxLength={254}
                            required
                            className='mt-1 h-12 rounded-xl border-slate-200 bg-slate-50 placeholder:text-slate-400 focus-visible:bg-white'
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                            type="tel"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="10-digit phone number"
                            inputMode="numeric"
                            pattern="[0-9]{10}"
                            title="Enter a 10-digit phone number."
                            maxLength={10}
                            required
                            className='mt-1 h-12 rounded-xl border-slate-200 bg-slate-50 placeholder:text-slate-400 focus-visible:bg-white'
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="At least 8 characters"
                            minLength={8}
                            maxLength={128}
                            required
                            className='mt-1 h-12 rounded-xl border-slate-200 bg-slate-50 placeholder:text-slate-400 focus-visible:bg-white'
                        />
                    </div>
                    <div className='flex flex-wrap items-center justify-between gap-3'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                    required
                                />
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                    required
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            <Label>Profile photo (optional)</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    {
                        loading ? <Button disabled className="my-4 h-12 w-full rounded-xl bg-violet-600"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="my-4 h-12 w-full rounded-xl bg-violet-600 hover:bg-violet-700">Create account</Button>
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup
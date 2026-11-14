import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import api from '@/utils/Axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const MAX_RESUME_SIZE = 10 * 1024 * 1024;

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
        file: null
    });
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file && !/\.pdf$/i.test(file.name)) {
            toast.error('Resume must be a PDF file.');
            e.target.value = '';
            setInput({ ...input, file: null });
            return;
        }
        if (file && file.size > MAX_RESUME_SIZE) {
            toast.error('Resume must be 10 MB or smaller.');
            e.target.value = '';
            setInput({ ...input, file: null });
            return;
        }
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.fullname.trim() || !/^\d{10}$/.test(String(input.phoneNumber).trim())) {
            toast.error('Enter your name and a valid 10-digit phone number.');
            return;
        }
        const formData = new FormData();
        formData.append("fullname", input.fullname.trim());
        formData.append("email", input.email.trim());
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file instanceof File) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await api.post(`${USER_API_END_POINT}/profile/update`, formData);
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to update profile.');
        } finally{
            setLoading(false);
        }
    }



    return (
        <div>
            <Dialog open={open}>
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                        <DialogDescription>Update your contact details, skills, and resume.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4'>
                                <Label htmlFor="fullname" className="sm:text-right">Name</Label>
                                <Input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="sm:col-span-3"
                                    maxLength={80}
                                    required
                                />
                            </div>
                            <div className='grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4'>
                                <Label htmlFor="email" className="sm:text-right">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="sm:col-span-3"
                                    maxLength={254}
                                    required
                                />
                            </div>
                            <div className='grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4'>
                                <Label htmlFor="phoneNumber" className="sm:text-right">Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="sm:col-span-3"
                                    inputMode="numeric"
                                    pattern="[0-9]{10}"
                                    title="Enter a 10-digit phone number."
                                    maxLength={10}
                                    required
                                />
                            </div>
                            <div className='grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4'>
                                <Label htmlFor="bio" className="sm:text-right">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    className="sm:col-span-3"
                                    maxLength={500}
                                />
                            </div>
                            <div className='grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4'>
                                <Label htmlFor="skills" className="sm:text-right">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    className="sm:col-span-3"
                                    maxLength={1000}
                                />
                            </div>
                            <div className='grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4'>
                                <Label htmlFor="file" className="sm:text-right">Resume (PDF, max 10 MB)</Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={fileChangeHandler}
                                    className="sm:col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            {
                                loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog

import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import api from "@/utils/Axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });

    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.role) {
            toast.error("Please select your role");
            return;
        }

        try {
            dispatch(setLoading(true));

            const res = await api.post(
                `${USER_API_END_POINT}/login`,
                {
                    ...input,
                    email: input.email.trim().toLowerCase()
                }
            );

            if (res.data.success) {
                dispatch(setUser(res.data.user));

                toast.success(res.data.message);
                navigate("/");
            }

        } catch (error) {
            console.error("Login error:", error.response?.data || error);

            toast.error(
                error.response?.data?.message ||
                "Unable to sign in. Please try again."
            );

        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar />

            <div className="flex items-center justify-center max-w-7xl mx-auto">
                <form
                    onSubmit={submitHandler}
                    className="my-8 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
                >
                    <h1 className="text-2xl font-bold text-slate-900">
                        Welcome back
                    </h1>

                    <p className="mb-4 mt-1 text-sm text-slate-500">
                        Sign in to continue your job search.
                    </p>

                    <div className="my-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            placeholder="you@example.com"
                            maxLength={254}
                            required
                        />
                    </div>

                    <div className="my-2">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <RadioGroup className="flex items-center gap-4 my-5">
                        <div className="flex items-center space-x-2">
                            <Input
                                type="radio"
                                name="role"
                                value="student"
                                checked={input.role === "student"}
                                onChange={changeEventHandler}
                                required
                            />
                            <Label>Student</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Input
                                type="radio"
                                name="role"
                                value="recruiter"
                                checked={input.role === "recruiter"}
                                onChange={changeEventHandler}
                                required
                            />
                            <Label>Recruiter</Label>
                        </div>
                    </RadioGroup>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="my-3 h-10 w-full rounded-xl bg-violet-600 hover:bg-violet-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : "Login"}
                    </Button>

                    <span className="text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="text-blue-600">
                            Signup
                        </Link>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default Login;

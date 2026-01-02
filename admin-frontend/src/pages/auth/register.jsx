import CustomSelect from '@/components/admin-view/CustomSelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSettingsContext } from '@/Context/SettingsContext'
import { authverifyOtp, registerUser } from '@/store/auth-slice'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const registerFormControls = [
    {
        name: 'userName',
        label: 'User Name',
        placeHolder: 'Enter your User Name',
        componentType: 'input',
        type: 'text',
        required: true,
        disabled: false,
    },
    {
        name: 'email',
        label: 'Email',
        placeHolder: 'Enter your Email Address',
        componentType: 'input',
        type: 'email',
        required: true,
        disabled: false,
    },
    {
        name: 'phoneNumber',
        label: 'Phone Number',
        placeHolder: 'Enter your Phone Number',
        componentType: 'input',
        type: 'phone',
        required: true,
        disabled: false,
    },
    {
        name: 'password',
        label: 'Password',
        placeHolder: 'Enter your password',
        componentType: 'input',
        type: 'password',
        required: true,
        disabled: false,
    },
    {
        name: 'role',
        label: 'Role',
        placeHolder: 'Set Role Type',
        componentType: 'select',
        required: true,
        disabled: false,
        options: [
            { id: 'superAdmin', label: 'Super Admin' },
            { id: 'admin', label: 'Admin' },
        ],
    },
]

const AuthRegister = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        role: '',
    })
    const { checkAndCreateToast } = useSettingsContext();
    const [checkOtp, setCheckOtp] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await dispatch(registerUser(formData))
            console.log("On U submit", res);
            if (res?.payload?.Success) {
                checkAndCreateToast("success", 'Sent OTP to registered Email. Please verify it.')
                setCheckOtp(true)
            } else {
                checkAndCreateToast("error", res?.payload?.message)
                setCheckOtp(false)
            }
        } catch (error) {
            checkAndCreateToast("error", 'Error registering User')
        } finally {
            setIsLoading(false)
        }
    }

    const verifyOtp = async (otp) => {
        setIsLoading(true)
        try {
            if (!otp) {
                checkAndCreateToast("error", 'Please enter OTP')
                return
            }
            const res = await dispatch(authverifyOtp({ otp, email: formData.email }))
            // Handle OTP verification response here
            console.log("OTP verified: ", res?.payload);
            if (res?.payload?.Success) {
                checkAndCreateToast("success", "Registration Successful")
                navigate('/auth/login')
            } else {
                checkAndCreateToast("error", "Failed to register")
                setFormData({ ...formData, password: '' })
                navigate('/auth/register')
            }
        } catch (error) {
            checkAndCreateToast("error", 'Invalid OTP')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50/50 px-4 py-12 animate-fadeIn">
            <div className='card w-full max-w-md p-8 space-y-6 bg-white shadow-lg border-0 sm:border sm:border-gray-200'>
                <div className='text-center space-y-2'>
                    <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
                        Create an Account
                    </h1>
                    <p className='text-sm text-gray-500'>
                        Already have an account?
                        <Link className='font-semibold ml-1 text-gray-900 hover:underline transition-all' to="/auth/login">Sign in</Link>
                    </p>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="flex flex-col gap-4">
                        {registerFormControls.map((controlItem, index) => (
                            <div key={index} className="space-y-1">
                                <Label className="text-sm font-medium text-gray-700">
                                    {controlItem.label}
                                    {controlItem.required && !formData[controlItem.name] && (
                                        <span className="text-red-500 ml-1">*</span>
                                    )}
                                </Label>
                                {controlItem.componentType === "select" ? (
                                    <CustomSelect
                                        controlItems={controlItem}
                                        setChangeData={(e) => {
                                            setFormData({ ...formData, [controlItem.name]: e })
                                        }}
                                    />
                                ) : (
                                    <div>
                                        <Input
                                            disabled={checkOtp}
                                            value={formData[controlItem.name]}
                                            onChange={(e) => setFormData({ ...formData, [controlItem.name]: e.target.value })}
                                            name={controlItem.name}
                                            placeholder={controlItem.placeHolder}
                                            id={controlItem.name}
                                            type={controlItem.type}
                                            className="input"
                                            required={controlItem.required}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <Button
                        disabled={isLoading}
                        type="submit"
                        className="w-full btn-primary"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                        ) : (
                            <span>{checkOtp ? "Verify OTP" : "Sign Up"}</span>
                        )}
                    </Button>
                </form>

                {checkOtp && <OptInputView isLoading={isLoading} onSubmiOtp={(otp) => {
                    verifyOtp(otp)
                }} />}
            </div>
        </div>
    )
}
const OptInputView = ({ isLoading, onSubmiOtp }) => {
    const [otp, setOtp] = useState(null)
    const handleChangeOtp = (e) => {
        e.preventDefault();
        onSubmiOtp(otp);
    }
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white min-h-[200px] flex flex-col space-y-5 p-6 rounded-lg shadow-lg w-96">
                <Label>Enter Otp</Label>
                <Input
                    value={otp}
                    onChange={(e) => {
                        console.log("otp updated: ", e.target.value)
                        setOtp(e.target.value)
                    }}
                    name={'otp'}
                    placeholder={'Enter OTP'}
                    id={'otp'}
                    type="number"
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
                <Button
                    onClick={handleChangeOtp}
                    className="mt-4 w-full py-2 bg-primary text-white font-semibold border border-gray-700 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                    ) : (
                        <span>Verify</span>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default AuthRegister

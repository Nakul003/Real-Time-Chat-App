import { Mail, MessagesSquare, User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useAuthStore } from "/src/store/useAuthStore.js"
import { Link } from "react-router-dom"
import AuthImagePattern from "../AuthImagePattern"
import toast from "react-hot-toast"

const SignUpPage = () => {

  
  const { isSigningUp, signUp } = useAuthStore();
  const [ShowPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const validateForm = (data)=>{
    if(!data.fullName) return toast.error("Name is required");
    if(!data.email) return toast.error("Email is required");
    if(!/\S+@\S+\.\S+/.test(data.email)) return toast.error("Invalid email format")
    if(!data.password) return toast.error("Password is required");
    if(data.password.length<6) return toast.error("Password must be at least 6 characters");
    return true
  }

  const onSubmit = async (data) => {
    const success = validateForm(data)
    if (success===true) {
      signUp(data)
    }
  }

  return (
    <div className='grid min-h-screen lg:grid-cols-2'>
      <div className='flex flex-col justify-center items-center mt-12 p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center mb-8'>
            <div className="size-12 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessagesSquare size={35} className=' text-primary bg-primary-content p-2 rounded-lg' />
            </div>
            <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
            <p className='text-base-content/60'>Get Started with your free account</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Full Name</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User size={20} className=" z-[1] text-base-content/40" />
                </div>
                <input type="text" className={`input focus:outline-none input-bordered w-full pl-10`} placeholder='Your Full Name'  {...register("fullName")} /> 
                
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Email</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail size={20} className=" z-[1] text-base-content/40" />
                </div>
                <input type="text" className={`input input-bordered focus:outline-none w-full pl-10`} placeholder='you@example.com'  {...register("email")} />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Passwords</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock size={20} className=" z-[1] text-base-content/40" />
                </div>
                <input type={ShowPassword ? 'text' : 'password'} className={`input focus:outline-none input-bordered w-full pl-10`} placeholder='********'  {...register("password")} />
                <button type='button' className='absolute inset-y-0 right-0 pr-3 flex items-center' onClick={() => { setShowPassword(!ShowPassword) }}>{ShowPassword ? <EyeOff size={20} className='text-base-content/40' /> : <Eye size={20} className='text-base-content/40' />}</button>
              </div>
            </div>
            <button type='submit' className='btn btn-primary w-full' disabled={isSigningUp}>{
              isSigningUp ? (
                <>
                  <Loader2 className='animate-spin' />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}</button>
          </form>

          <div className='text-center'>
            <p className='text-base-content/60'>
              Already have an account?{" "}
              <Link to="/login" className='link link-primary'>Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern title="Join our community" subtitle="Connect with friends, share moments, and stay in touch with your friends" />

    </div>
  )
}

export default SignUpPage
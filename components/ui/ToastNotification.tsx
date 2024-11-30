"use client"
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer, toast } from 'react-toastify';


export default function ToastNotification() {
  return (
    <ToastContainer
    theme="colored"
    autoClose={3000}
    />
  )
}

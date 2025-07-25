

import { FolderGit2 } from 'lucide-react'
import React from 'react'
import NavBar from './NavBar'
  import { ToastContainer, toast } from 'react-toastify';

type WrapperProps = {
    children : React.ReactNode
}

const Wrapper = ({children} : WrapperProps) => {
  return (
    <div>

        <NavBar />  
   
         <div className='px-5 md:px-[10%] mt-8 mb-10'>
             <ToastContainer 
             position='top-right'
             autoClose={5000}
             hideProgressBar={false}
             newestOnTop={false}
             closeOnClick
             pauseOnHover
             draggable
             />
             {children}
         </div>
    </div>
  ) 
}

export default Wrapper
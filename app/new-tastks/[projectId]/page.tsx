"use client"
import { getProjectInfo, getProjectUsers } from '@/app/actions';
import AssignTask from '@/app/components/AssignTask';
import Wrapper from '@/app/components/Wrapper'
import { User } from '@/lib/generated/prisma';
import { Project } from '@/type';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const page = ({params} : {params: Promise<{projectId : string}>}) => {

    const [projectId,setProjectId] = useState("");
        const [project,setProject] = useState<Project | null>(null);
        const [usersProject,setUserProject] = useState<User[]>([]);
        const [selectedUser,setSelectedUser] = useState<User | null>(null)
        const [dueDate,setDueDate] = useState<Date | null>(null)
        const [name,setName] = useState("")
    
        const fetchInfos = async (projectId : string) => {
            try {
    
                const project = await getProjectInfo(projectId,true)
                setProject(project)

                const associatedUser = await getProjectUsers(projectId)
                setUserProject(associatedUser)
            } catch (error) {
                console.error("Erreur lors du chargement du projet")
                
            }
        }

    useEffect(() =>{
        const getId = async () => {
        const resolvedParams = await params;
        setProjectId(resolvedParams.projectId)
        fetchInfos(resolvedParams.projectId)
        } 
        getId()
    },[params])

    const handleUserSelect = (user: User) => {
        setSelectedUser(user) 
            
    }

  return (
    <Wrapper>
        <div>
            <div className="breadcrumbs text-sm">
                <ul>
                    <li><Link href={`/project/${projectId}`}>Retour</Link></li>
                    <li>
                        <div className='badge badge-primary'>
                            {project?.name}
                        </div>
                    </li>
                 
                  
                </ul>
            </div>

            <div className='flex flex-col md:flex-row md:justify-between'>
                <div className='md:w-1/4'>
                    <AssignTask users={usersProject} projectId={projectId}
                     onAssignTask={handleUserSelect}/>
                     <div className='flex justify-between items-center mt-4'>
                        <span className='badge'>
                              A livré
                        </span>

                        <input 
                        placeholder="Date d'échéance"
                        className='input input-bordered border-base-300'
                        type="date"
                        onChange={(e)=>setDueDate(new Date(e.target.value))}
                        />

                     </div>

                </div>

                <div className='md:w-3/4 mt-4 md:mt-0 md:ml-4'>
                    <div className='flex flex-col justify-between w-full'>
                        <input 
                        placeholder='Nom de la tâche'
                        className='w-full input input-bordered border border-e-base-300 font-bold mb-4'
                        value={name}
                        onChange={(e) =>setName(e.target.value)}
                        type="text" 
                        />

                    </div>

                    <ReactQuill />


                </div>


            </div>
        </div>
    </Wrapper>
  )
}

export default page
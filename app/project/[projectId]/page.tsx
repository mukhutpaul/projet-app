"use client"
import { getProjectInfo } from '@/app/actions';
import EmptyState from '@/app/components/EmptyState';
import ProjectComponent from '@/app/components/ProjectComponent';
import TaskComponent from '@/app/components/TaskComponent';
import UserInfo from '@/app/components/UserInfo';
import Wrapper from '@/app/components/Wrapper'
import { Project } from '@/type';
import { useUser } from '@clerk/nextjs'
import { CircleCheckBig, CopyPlus, ListTodo, Loader, SlidersHorizontal, UserCheck } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const page = ({params} : {params: Promise<{projectId : string}>}) => {

    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress as string

    const [projectId,setProjectId] = useState("");
    const [project,setProject] = useState<Project | null>(null);
    const [statusFilter,setStatusFilter] = useState<string>('');
    const [assignedFilter,setAssignedFilter] = useState<boolean>(false)
    const [taskCount,setTaskCount] = useState({todo:0,inProgress:0,done:0,assigned:0})

    const fetchInfos = async (projectId : string) => {
        try {

            const project = await getProjectInfo(projectId,true)
            setProject(project)
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

    useEffect(() =>{
        if(project && project.tasks && email){
            const counts = {
                todo: project.tasks.filter(task => task.status == "To Do").length,
                inProgress: project.tasks.filter(task => task.status == "In Progress").length,
                done: project.tasks.filter(task => task.status == "Done").length,
                assigned : project.tasks.filter(task => task.user?.email == email).length,
            }

            setTaskCount(counts)
        }

    },[project,params])

    const filteredTasks = project?.tasks?.filter(task => {
        const statusMatch = !assignedFilter || task.status == statusFilter
        const assignedMatch = !statusFilter || task?.user?.email

        return statusMatch && assignedMatch
    })

    const deleteTask = async (taskId : string) => {
        try {
            await deleteTask(taskId)
            fetchInfos(projectId)
            toast.success("Tâche supprimée")
        } catch (error) {
            toast.error("Erreur Task project")

        }
    }

  return (
    <Wrapper>
        <div className='md:flex md:flex-row flex-col'>

            <div className='md:w-1/4'>
                <div className='p-5 border border-base-300 rounded-xl mb-6'>
                    <UserInfo 
                    role="Créé par"
                    email={project?.createdBy?.email || null}
                    name={project?.createdBy?.name || null}
                    />
                </div>

                <div className='w-full'>
                    {project && (
                       <ProjectComponent project={project} admin={0} style={false}></ProjectComponent>  
                    )
                    }

                </div>

            </div>

            <div className='mt-6 md:ml-6 md:mt-0 md:w-3/4'>
                <div className='md:flex md:justify-between'>
                    <div className='flex flex-col'>  
                        <div className='space-x-2 mt-2'>
                                <button
                                    onClick={() => { setStatusFilter(''); setAssignedFilter(false) }}
                                    className={`btn btn-sm rounded-full${!statusFilter ? 'btn-primary' : ''}`}>
                                    <SlidersHorizontal className='w-4' /> Tous ({project?.tasks?.length || 0})
                                </button>

                                <button
                                    onClick={() => { setStatusFilter('To Do') }}
                                    className={`btn btn-sm rounded-xl  ${statusFilter === "To Do" ? 'btn-primary' : ''}`}>
                                    <ListTodo className='w-4' />
                                    A faire ({taskCount.todo})
                                </button>

                                <button
                                    onClick={() => { setStatusFilter('In Progress') }}
                                    className={`btn btn-sm rounded-xl  ${statusFilter === "In Progress" ? 'btn-primary' : ''}`}>
                                    <Loader className='w-4' />
                                    En cours ({taskCount.inProgress})
                                </button>

                            </div>
                            <div className='space-x-2 mt-2'>
                                <button
                                    onClick={() => { setStatusFilter('Done') }}
                                    className={`btn btn-sm rounded-xl  ${statusFilter === "Done" ? 'btn-primary' : ''}`}>
                                    <CircleCheckBig className='w-4' />
                                    Finis ({taskCount.done})
                                </button>

                                <button
                                    onClick={() => { setAssignedFilter(!assignedFilter) }}
                                    className={`btn btn-sm rounded-xl ${assignedFilter ? 'btn-primary' : ''}`}>
                                    <UserCheck className='w-4' />
                                    Vos tâches ({taskCount.assigned})
                                </button>
                        </div>
                        
                        <div className='space-x-2 mt-2'>

                        </div>
                    </div>

                    
                    <Link href={`/new-tastks/${projectId}`}
                    className='btn btn-sm mt-2 md:mt-0 rounded-xl'
                    >
                        Nouvelle tâche
                        <CopyPlus className='w-4'/>
                    </Link>  
                </div>

                
            
             <div className='mt-6 border border-base-300 p-5 shadow-sm rounded-xl'>

                {filteredTasks && filteredTasks.length > 0 ? (
                   <div className='overflow-auto'>
                      <table className='table table-lg'>
                        <thead>
                            <tr>
                            <th></th>
                            <th>Titre</th>
                            <th>Assigné à</th>
                            <th className='hidden md:flex'>A livré le</th>
                            <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody className='w-fit'>
                            {filteredTasks.map((task,index) => (
                                <tr key={task.id} className='border-t last:border-none'>
                                    <TaskComponent task={task} index={index} email={email} onDelete={deleteTask}/>

                                </tr>

                            ))}

                        </tbody>

                      </table>

                   </div>
                ):(
                <EmptyState  imageSrc='/empty-project.png' 
                imageAlt='Picture of an empty project' 
                message="Aucun projet créé" />
                )}

            </div>
            </div>
        </div>
       
    </Wrapper>
  )
}

export default page
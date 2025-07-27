"use client"
import { getProjectInfo, getTaskDetails, updateTaskStatus } from '@/app/actions'
import EmptyState from '@/app/components/EmptyState'
import UserInfo from '@/app/components/UserInfo'
import Wrapper from '@/app/components/Wrapper'
import { Project, Task } from '@/type'
import Link from 'next/link'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'


const page = ({params} : {params: Promise<{taskId : string}>}) => {
const [task, setTask] = useState<Task | null>(null)
const [taskId, setTaskId] = useState<string>('')
const [status, setStatus] = useState('')

const [projectId,setProjectId] = useState("");
const [project,setProject] = useState<Project | null>(null);

  const fetchInfos = async ( taskId : string ) => {
    try {
      const task = await getTaskDetails(taskId)
      setTask(task)
      setStatus(task.status)
      fetchProject(task.projectId)
    } catch (error) {
      toast.error("Erreur lors du chargement des details de la tâche.")
      
    }
  }

  const fetchProject = async (projectId : string) =>{
       try {
        const project = await getProjectInfo(projectId,false)
        setProject(project)
        
       } catch (error) {
          toast.error("Errur lors de chargement du projet.")
       }
  }

  const changeStatus = async (taskId : string, newStatus:string)=>{
    try {

      await updateTaskStatus(taskId,newStatus)
      fetchInfos(taskId)
      
    } catch (error) {
      toast.error("Erreur lors du changement de status")
      
    }
  }


  const handlestatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value

    setStatus(newStatus)

    if(newStatus == "To Do" || newStatus == "In Progress"){
      changeStatus(taskId,newStatus)
      toast.success("Status changé")
    }
  }
  
  useEffect(() =>{
      const getId = async () => {
      const resolvedParams = await params;
      setTaskId(resolvedParams.taskId)
      fetchInfos(resolvedParams.taskId)
          } 
           getId()
      },[params])
  return (
    <Wrapper>
      {task ? (
        <div>
           <div className='flex flexcol md:justify-between md:flex-row'>
              <div className='breadcrumbs text-sm'>
                <ul>
                  <li><Link href={`/project/${task?.projectId}`}> Retour</Link></li>
                  <li>{project?.name}</li>
                </ul>

              </div>
              <div className='p-5 border border-base-300 rounded-xl w-full md:w-fit my-4'>
                 <UserInfo 
                    role="Assigné à"
                    email={task?.user?.email || null}
                    name={task?.user?.name || null}
                    />
              </div>

           </div>

           <h1 className='font-semibold italic text-2xl mb-4'>{task.name}</h1>

           <div className='flex justify-between items-center mb-4'>
            <span>
               A livrer le
               <div className='badge badge-ghost ml-2'>
                  {task.dueDate?.toLocaleString()}
               </div>
            </span>

            <div>
              <select
              value={status}
              onChange={handlestatusChange}
              className='select select-sm select-bordered select-primary focus:outline-none ml-3'
              >
                 <option value="To Do">A faire</option>
                 <option value="In Progress">En cours</option>
                 <option value="To Do">Terminée</option>
              </select>
            </div>


           </div>
        </div>
      ):(
         <EmptyState  imageSrc='/empty-project.png' 
          imageAlt='Picture of an empty project' 
          message="Cette tâche n'existe pas" />
      )}
    </Wrapper>
  )
}

export default page
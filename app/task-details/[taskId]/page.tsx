"use client"
import { getProjectInfo, getTaskDetails, updateTaskStatus } from '@/app/actions'
import EmptyState from '@/app/components/EmptyState'
import UserInfo from '@/app/components/UserInfo'
import Wrapper from '@/app/components/Wrapper'
import { Project, Task } from '@/type'
import 'react-quill-new/dist/quill.snow.css';
import Link from 'next/link'

import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill-new'
import { toast } from 'react-toastify'


const page = ({params} : {params: Promise<{taskId : string}>}) => {
const [task, setTask] = useState<Task | null>(null)
const [taskId, setTaskId] = useState<string>('')
const [status, setStatus] = useState('')
const [solution,setSolution] = useState('')

const [projectId,setProjectId] = useState("");
const [project,setProject] = useState<Project | null>(null);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
        ]
    };

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
            
            <div>
              <div className='flex md:justify-between md:items-center flex-col md:flex-row'>
                  <div className='p-5 border border-base-300 rounded-xl w-full md:w-fit my-4'>
                 <UserInfo 
                    role="Crée par"
                    email={task?.createdBy?.email || null}
                    name={task?.createdBy?.name || null}
                    />
                  </div>

                  <div className='badge badge-primary mt-4 md:mt-0'>
                      {task.dueDate && `
                         ${Math.max(0,Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime())/
                          (1000 * 60 * 60 * 24)
                        ))} Jours restants
                      `}
                  </div>

              </div>
            </div>

            <div className='ql-snow w-full'>
              <div
              className='ql-editor p-5 border-base-300 border rounded-xl'
              dangerouslySetInnerHTML={{__html: task.description}}
              />
            </div>

            {task?.solutionDescription &&(
              <div className='ql-snow w-full'>
                <div className='badge badge-primary my-4'>
                  Solution

                </div>
              <div
              className='ql-editor p-5 border-base-300 border rounded-xl'
              dangerouslySetInnerHTML={{__html: task.solutionDescription}}
              />
            </div>

            )}

            {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <button className="btn" onClick={()=>document.getElementById('my_modal_3').showModal()}>open modal</button>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">C'est quoi la solution</h3>
            <p className="py-4">Décricez ce que vous avez fait exactement </p>

            <ReactQuill
                placeholder='Decrivez la solution'
                value={solution}
                modules={modules}
                onChange={setSolution}
              />
          </div>
        </dialog>

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
import { Project } from '@/type'
import { Copy, ExternalLink, FolderGit, Trash } from 'lucide-react';
import Link from 'next/link';
import React, { FC } from 'react'

interface ProjectProps{
    project: Project
    admin : number;
    style : boolean;
}

const ProjectComponent : FC<ProjectProps> = ({project,admin,style}) => {

    const  totalTasks = project.tasks?.length; 
    const  taskByStatus = project.tasks?.reduce(
        (acc,task) => {
            if(task.status === "To Do") acc.toDo++
            else if(task.status ==="In Progress")  acc.inProgress++;
            else if(task.status ==="Done")  acc.done++;

            return acc
        },
        {
            toDo: 0, inProgress:0, done: 0
        }
    ) ?? { toDo: 0, inProgress:0, done: 0}

    const progressPourcentage = totalTasks ? Math.round((taskByStatus.done / totalTasks) * 100) : 0
    const inProgressPourcentage = totalTasks ? Math.round((taskByStatus.inProgress / totalTasks) * 100) : 0
    const toDOPourcentage = totalTasks ? Math.round((taskByStatus.toDo / totalTasks) * 100) : 0

    const textSizeClass = style ? 'text-sm' : 'text-md'

  return (
    <div key={project.id} className={`${style ? 'border border-base-300 p-5 shadow-sm':''} text-base-content rounded-xl w-full text-left`}>


        <div className='w-full flex items-center mb-3'>
            <div className='bg-primary-content text-xl h-10 w-10 rounded-lg flex justify-center items-center'>
                <FolderGit className='w-6 text-primary'/>
            </div>

            <div className='badge ml-3 font-bold'>
                {project.name}
            </div>
        </div>

        {style === false &&(
            <p className='text-sm text-gray-500 border border-gray-300 p-5 mb-6 rounded-xl'>
                {project.description}
            </p>
        )}

        <div className={`mb-3`}>
            <span>Collaborateurs</span>
            <div className='badge badge-sm badge-ghost ml-1'>{project.users?.length}</div>
        </div>

        {admin ===1 && (
            <div className='flex justify-between items-center rounded-lg p-2 border border-base-300 mb-3 bg-base-200/30'>
              <p className='text-primary font-bold ml-3'>
                {project.inviteCode}
              </p>
              <button className='btn btn-sm ml-2'>
                <Copy className='w-4'/>
              </button>
            </div>
        )}

        <div className='flex flex-col mb-3'>
            <h2 className={`text-gray-500 mb-2 ${textSizeClass}`}>
                <span className='font-bold'>A faire</span>
                <div className='badge badge-ghost badge-sm ml-1'>
                    {taskByStatus.toDo}
                </div>
            </h2>
            <progress className='progress progress-primary w-full' value={toDOPourcentage} max="100">

            </progress>

            <div className='flex'>
               <span className={`text-gray-400 mt-2 ${textSizeClass}`}>
                {toDOPourcentage}%
               </span>
            </div>

            
        </div>

        <div className='flex flex-col mb-3'>
            <h2 className={`text-gray-500 mb-2 ${textSizeClass}`}>
                <span className='font-bold'>En cours</span>
                <div className='badge badge-ghost badge-sm ml-1'>
                    {taskByStatus.inProgress}
                </div>
            </h2>
            <progress className='progress progress-primary w-full' value={inProgressPourcentage} max="100">

            </progress>

            <div className='flex'>
               <span className={`text-gray-400 mt-2 ${textSizeClass}`}>
                {inProgressPourcentage}%
               </span>
            </div>

            
        </div>

        <div className='flex flex-col mb-3'>
            <h2 className={`text-gray-500 mb-2 ${textSizeClass}`}>
                <span className='font-bold'>Terminée(s)</span>
                <div className='badge badge-ghost badge-sm ml-1'>
                    {taskByStatus.inProgress}
                </div>
            </h2>
            <progress className='progress progress-primary w-full' value={progressPourcentage} max="100">

            </progress>

            <div className='flex'>
               <span className={`text-gray-400 mt-2 ${textSizeClass}`}>
                {progressPourcentage}%
               </span>
            </div>
        </div>

        <div className='flex '>
            {style && (
                 <Link href={`/project/${project.id}`}
                 className='btn btn-primary btn-sm'
                 >
                    <div className='badge badge-sm'>
                       {totalTasks}
                    </div>
                    Tâche
                    <ExternalLink className='w-4'/>
                 </Link>

            )}

            {admin === 1 &&(
                <button className='btn btn-sm ml-3'>
                  
                   <Trash className='w-4'/>
                </button>
            )}

        </div>

    </div>
  )
}

export default ProjectComponent
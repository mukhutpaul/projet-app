"use client"
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { SquarePlus } from 'lucide-react'
import { toast } from 'react-toastify'
import { addUserToProject, getProjectAssociatedWithUser } from '../actions'
import { useUser } from '@clerk/nextjs'
import { Project } from '@/type'
import EmptyState from '../components/EmptyState'
import ProjectComponent from '../components/ProjectComponent'

const page = () => {
    const [inviteCode,setInviteCode] = useState("")
    const {user} = useUser()
    const [associatedProjects,setAssociatedProjects] = useState<Project[]>([])

    const email = user?.primaryEmailAddress?.emailAddress as string

    const fechProjects = async (email:string) =>{
        try {

            const assocciated = await getProjectAssociatedWithUser(email)
            setAssociatedProjects(assocciated)

            
        } catch (error) {
            toast.error("Erreur lors de chargement des projets")
        }

    }
    useEffect(() =>{
        if(email){
            fechProjects(email)
        }
    },[email])
    const handleSubmit = async () => {
        try {
            if (inviteCode != "") {
                await addUserToProject(email, inviteCode)
                fechProjects(email)
                setInviteCode("")
                toast.success('Vous pouvez maintenant collaboré sur ce projet');
            } else {
                toast.error('Il manque le code du projet');
            }
        } catch (error) {
            toast.error("Code invalide ou vous appartenez déjà au projet");
        }
    }

  return (
    <Wrapper>
        <div className='flex'>
            <div className='mb-4'>
                <input 
                value={inviteCode}
                onChange={(e) =>setInviteCode(e.target.value)}
                type="text" 
                placeholder="Code d'invitation"
                className='w-full p-2 input input-bordered'
                />
            </div>
            <button className='btn btn-primary ml-4 rounded-2xl'
            onClick={handleSubmit}
            >
                Rejoindre <SquarePlus className='w-4' />
            </button>

        </div>

        <div>
            {associatedProjects.length > 0 ? (
            
                <ul className="w-full grid md:grid-cols-3 gap-6">
                    {associatedProjects.map((project) => (
                    <li key={project.id}>
                    <ProjectComponent project={project} admin={0} style={true}></ProjectComponent>
                        </li>
                ))}
                </ul>
            
                ):(
                    <div>
                        <EmptyState imageSrc='/empty-project.png' 
                        imageAlt='Picture of an empty project' 
                        message="Aucun projet associé" />
            
                    </div>
                          )
            
                }
        </div>
    </Wrapper>
  )
}

export default page
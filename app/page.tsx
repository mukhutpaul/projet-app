"use client"
import { useEffect, useState } from "react";
import Wrapper from "./components/Wrapper";
import { FolderGit } from "lucide-react";
import { createProjet,  getProjectsCreatedByUser } from "./actions";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { Project } from "@/type";
import ProjectComponent from "./components/ProjectComponent";

export default function Home() {

  const {user} = useUser()
  const email = user?.primaryEmailAddress?.emailAddress as string
  const [name,setName] = useState("")
  const [description, setDescription] = useState("")

  const [projects,setProject] = useState<Project[]>([])

  const fetchPoject = async (email:string) =>{
    try {

      const myprojects = await getProjectsCreatedByUser(email)
      setProject(myprojects)
      console.log(myprojects)
      
    } catch (error) {
      console.error("Erreur lors du chargement des projets:",error)
    }
  }

  const handleSubmit = async () => {
    try {

      const modal = document.getElementById('my_modal_3') as HTMLDialogElement
      const project = await createProjet(name,description,email)

      if(modal){
        modal.close()
      }

      setName("")
      setDescription("")
      fetchPoject(email)
      toast.success("Projet créé!")
      
    } catch (error) {
      console.error("Error creating project:",error)
    }  
  }

  useEffect(() =>{
    if(email){
       fetchPoject(email)
    }
  },[email])




  return (
         <Wrapper>
          <div>

            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button className="btn mb-6 btn-primary rounded-4xl" onClick={()=>(document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
              Nouveau Projet <FolderGit /></button>
            
            <dialog id="my_modal_3" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Nouveau Projet</h3>
                <p className="py-4">Décrivez votre projet grâce à la description</p>

                <div>
                  <input type="text" 
                  placeholder="Nom du projet"
                  value={name}
                  onChange={(e) =>setName(e.target.value)}
                  className="border border-base-300 input input-bordered w-full mb-4 placeholder:text-sm"
                  required
                  />

                  <textarea 
                  placeholder="Description"
                  value={description}
                  rows={4}
                  onChange={(e)=> setDescription(e.target.value)}
                  className="mb-2 textarea textarea-bordered border-base-300 w-full resize-none
                  textarea-md placeholder:text-sm"
                  required
                  >

                  </textarea>
                  <button className="btn btn-primary rounded-4xl" onClick={handleSubmit}>
                    Nouveau Projet <FolderGit />
                  </button>
                </div>
              </div>
            </dialog>

            <div className="w-full">
              { projects.length > 0 ? (

                <ul className="w-full grid md:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <li key={project.id}>
                      <ProjectComponent project={project} admin={1} style={true}></ProjectComponent>
                    </li>
                  ))}
                </ul>

              ):(
                  <div></div>
              )

              }

            </div>

          </div>
         </Wrapper>
      );
}


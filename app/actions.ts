"use server"

import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { throwDeprecation } from "process";

export async function checkAndAddUser(email: string, name: string) {
    if (!email) return
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!existingUser && name) {
            await prisma.user.create({
                data: {
                    email,
                    name
                }
            })
            console.error("Erreur lors de la vérification de l'utilisateur:");
        } else {
            console.error("Utilisateur déjà présent dans la base de données");
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error);
    }
}

function generateUniqueCode():string{
    return randomBytes(6).toString('hex')
}

export async function createProjet(name: string,description:string,email: string, ) {

    try {
        const inviteCode = generateUniqueCode()
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            throw new Error("utilisateur non trouvé.")
        }

        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                inviteCode,
                createdById:user.id,
            }
        })

        return newProject;
        
    } catch (error) {
        console.error(error)
        throw new Error
    }

}

export async function getProjectsCreatedByUser(email: string) {
    try {

        const projects = await prisma.project.findMany({
            where: {
                createdBy: { email }
            },
            include: {
                tasks: {
                    include: {
                        user: true,
                        createdBy: true
                    }
                },
                users: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })

        const formattedProjects = projects.map((project) => ({
            ...project,
            users: project.users.map((userEntry) => userEntry.user)
        }))

        return formattedProjects

    } catch (error) {
        console.error(error)
        throw new Error
    }
}


export async function deleteProjectById(prjectId: string) {
    try {

        await prisma.project.delete({
            where : {
                id : prjectId
            }
        })

        console.log(`Project avec l'ID ${prjectId} supprimé avec succès.`)
        
    } catch (error) {
        console.error(error)
        throw new Error
    }

}


 export async function addUserToProject(email: string, inviteCode: string) {
    try {

        const project = await prisma.project.findUnique({
            where: { inviteCode }
        })

        if (!project) {
            throw new Error('Projet non trouvé');
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        const existingAssociation = await prisma.projectUser.findUnique({
            where: {
                userId_projectId: {
                    userId: user.id,
                    projectId: project.id
                }
            }
        })

        if (existingAssociation) {
            throw new Error('Utilisateur déjà associé à ce projet');
        }

        await prisma.projectUser.create({
            data: {
                userId: user.id,
                projectId: project.id
            }
        })
        return 'Utilisateur ajouté au projet avec succès';
    } catch (error) {
        console.error(error)
        throw new Error
    }
}

 export async function getProjectAssociatedWithUser(email: string) {
    try {

        const projects = await prisma.project.findMany({
            where : {
                users : {
                    some: {
                        user: {
                            email
                        }
                    }
                }
            },
            include : {
                tasks : true,
                users : {
                    select :{
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        })

        const formattedProjects = projects.map((project) => ({
            ...project,
            users: project.users.map((userEntry) => userEntry.user)
        }))

        return formattedProjects;
        
    } catch (error) {
        console.error(error)
        throw new Error
        
    }

 }

export async function getProjectInfo(idProject:string,details:boolean){
      const project = await prisma.project.findUnique({
        where : {
            id : idProject
        },
        include :details ? {
           tasks : {
            include : {
                
            }
           }
        }: undefined
      })

}


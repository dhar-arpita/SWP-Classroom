import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const enrollCourse = async (req, res) => {
    try{


        const courseId = parseInt(req.params.courseId)
        const userId = req.user.userId


        const isExist = await prisma.courseEnrollment.findFirst({
            where : {courseId , userId}
        })

        if(isExist) return  res.status(400).json({message:'Already enrolled!'})


        const course = await prisma.course.findUnique({where:{id : courseId}})
        
        const enrollment = await prisma.courseEnrollment.create({
            data : {
                courseId,
                userId,
                status:course.isPaid ? 'pending' : 'approved'
            }
        })

        res.status(201).json({message:course.isPaid?'Your Enrollment is pending!':'Enrolled Succesfuly',enrollment})

       
    }catch(err){
        res.status(500).json({message:'Server error', error: err.message})
    }
}


export const getMyEnrollments = async(req,res)=>{

    try{
        const enrollments = await prisma.courseEnrollment.findMany({
            where:{userId : req.user.userId},
            include:{
                course:{
                    include:{
                        chapters:{
                            include:{
                                videos:{include:{materials:true}}
                            }
                        }
                    }
                }
            }
        })

        res.json(enrollments)
    }catch(err){
        res.status(500).json({message:'Server error',error:err.message})
    }
}

export const getPendingEnrollments = async(req,res)=>{
    try{
        const enrollments = await prisma.courseEnrollment.findMany({
            where:{status:'pending'},
            include:{
                user: {select : {id : true , name: true ,email:true,mobileNo:true}},
                course:{select:{id:true,title:true}}

            }
        })
        res.json(enrollments)
    }catch(err){
        res.status(500).json({message:"Server Error", error:err.message})
    }
}

export const approveEnrollment = async(req,res)=>{
    try{
        const enrollment = await prisma.courseEnrollment.update({
            where:{id:parseInt(req.params.id)},
            data:{status:'approved'}
        })

        res.json({message:'Enrollment Approved',enrollment})
    }catch(err){
        res.status(500).json({message:"Server Error", error:err.message})
    }
}

export const rejectEnrollment = async (req, res)=>{
  try {
    await prisma.courseEnrollment.delete({
      where: { id: parseInt(req.params.id) }
    })
    res.json({ message: 'Enrollment rejected!' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}
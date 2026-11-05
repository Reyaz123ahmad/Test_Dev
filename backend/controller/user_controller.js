const prisma = require("../db");
const bcrypt = require("bcrypt");


exports.createUser = async (req, res) => {
    try{
        const { name, mobileNumber, email, password, city, state, role } = req.body;

        if(!name || !mobileNumber || !password || !city || !state) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const existingUser = await prisma.user.findUnique({
            where: { mobileNumber, email }
        });

        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                mobileNumber,
                password: hashedPassword,
                city,
                state,
                email,
                role
            }
        });

        res.status(201).json({ message: "User created successfully", user: newUser });

    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
  
}

exports.getUser = async (req, res) => {
    try{
        const id = parseInt(req.params.id, 10);

        const user = await prisma.user.findUnique({
            where: { id, isBlocked: false }
        });

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ name: user.name, email: user.email, mobileNumber: user.mobileNumber, city: user.city, state: user.state, role: user.role });

    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.updateUser = async (req, res) => {
    try{
        const id = parseInt(req.params.id, 10);
        const { name, city, state } = req.body;

        const user = await prisma.user.findUnique({
            where: { id, isBlocked: false }
        });

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const updatedUser = await prisma.user.update({
            where: { id, isBlocked: false },
            data: { name, city, state }
        });

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.deleteUser = async (req, res) => {
    try{
       const id = parseInt(req.params.id, 10);

        const user = await prisma.user.findFirst({
            where: { id: id, isBlocked: false }
        });

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await prisma.user.delete({
            where: { id }
        });

        res.status(200).json({ message: "User deleted successfully" });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.blockUser = async (req, res) => {
    try{
        const id = parseInt(req.params.id, 10);

        const existingUser = await prisma.user.findUnique({
            where: { id, isBlocked: false }
        })

        if(!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const blocked = await prisma.user.update({
            where:{id: id},
            data:{isBlocked: true}
        })
        res.status(200).json({ message: "User blocked successfully" });
    }catch(error){
        console.log(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.unblockUser = async (req, res) => {
    try{
        const id = parseInt(req.params.id, 10);
        const existingUser = await prisma.user.findUnique({
            where: { id, isBlocked: true }
        })

        if(!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const unblocked = await prisma.user.update({
            where:{id: id},
            data:{isBlocked: false}
        })
        res.status(200).json({ message: "User unblocked successfully" });

    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.getUsersCount = async(req, res) =>{
    try{
        const grouped = await prisma.user.groupBy({
            by:['isBlocked'],
            _count:{
                _all:true
            }
        })

        let blockedCount = 0;
        let unblockedCount = 0;

        grouped.forEach(group => {
            if(group.isBlocked === true) blockedCount = group._count._all;

            else if(group.isBlocked === false) unblockedCount = group._count._all;
        })

        const totalCount = blockedCount + unblockedCount;
        res.status(200).json({ 
            message: "User count fetched successfully", 
            data: { blocked: blockedCount, unblocked: unblockedCount, total: totalCount } 
        });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}


exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                mobileNumber: true,
                email: true,
                city: true,
                state: true,
                role: true,
                isBlocked: true
            }
        });

        res.status(200).json({
            message: "Users fetched successfully",
            data: users
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
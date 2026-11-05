const prisma = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingAdmin = await prisma.admin.findUnique({
            where: { email }
        });

        if (existingAdmin) {
            return res.status(400).json({
                message: "Admin already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.admin.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({
            message: "Admin created successfully",
            admin: {
                id: newAdmin.id,
                name: newAdmin.name,
                email: newAdmin.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                message: "Mobile number and password are required" 
            });
        }

        const user = await prisma.admin.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ 
                message: "Invalid credentials" });
        }
        await prisma.admin.update({
            where: { id: user.id },
                data: {
                    lastLogin: new Date(),
            },
        });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        
        res.status(200).json({ 
            message: "Login successful",
            token,
            admin: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                lastLogin: new Date(),
            }
        });

    }catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Internal server error" 
        });
    }
}


exports.adminProfile = async (req, res) =>{
    try{
        const { email } = req.user;

        const user = await prisma.admin.findUnique({
            where: { email }
        });

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }


        res.status(200).json({ name: user.name, email: user.email, role: user.role, lastLogin: user.lastLogin });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}



exports.chnagePassword = async (req, res) => {
    try{
        const {email} = req.user;

        const { oldPassword, newPassword } = req.body;
        const existingUser = await prisma.admin.findUnique({
            where: { email }
        });

        if(!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if(!oldPassword || !newPassword) {
            return res.status(400).json({ 
                message: "Old password and new password are required" 
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, existingUser.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.admin.update({
            where: { email },
            data: { password: hashedPassword }
        });
        res.status(200).json({ 
            message: "Password changed successfully" 
        });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}



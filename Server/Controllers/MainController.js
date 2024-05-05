const Role=require("../Module/Role")
const User=require('../Module/User')
const Reg=require('../Module/Region')
const  Region=require("../Module/Region")
const Hotel=require("../Module/Hotels")
const Files=require('../Module/File')
const  axios=require("axios")
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const jwt=require("jsonwebtoken")
const {secret}=require("./config")
const {validationResult, header}=require("express-validator")
const nodemailer = require('nodemailer');
const multer = require('multer');
const storage = multer.memoryStorage(); // Зберігання файлу у вигляді буфера в пам'яті
const upload = multer({ storage: storage });

class MainController{
    
    async Pull_Reions(req,res){
        try {
            const{Region,Photo}=req.body
            
            const photoBuffer = Buffer.from(Photo, 'base64');
            const RegionsInf = new Reg({
                Region_Name: Region,
                Photo: {
                    photoData: photoBuffer
                },
               
            });
            
            await RegionsInf.save();
        }catch (e) {
            console.log(e)
            res.status(400).json({message:"Registration error"})
        }
    }
    async GetRegion(req,res){
        try {
            
            const regions = await Reg.find({}, 'Region_Name Photo _id'); // Вибираємо лише поля Region_Name, Photo та _id
            
            // Відправка масиву областей з обраними полями на клієнтську сторону у відповіді
            return res.json({ regions });
        } catch (e) {
            console.log(e)
            res.status(400).json({message:"Registration error"})
        }
    }
    async Get_Name(req,res){
        try {
            const { Reg_id } = req.body;
            
            const region = await Region.findById(Reg_id); // Знайдіть регіон за його _id
            
            if (!region) {
                return res.status(404).json({ message: "Region not found" }); // Якщо регіон не знайдено, поверніть 404
            }
    
            const region_name = region.Region_Name; // Отримайте ім'я регіону
            return res.json({ region_name });
      
        } catch (e) {
            console.log(e)
            res.status(400).json({message:"Registration error"})
        }
    }
    async Get_Hotels(req,res){
        try {
            const { Region_name } = req.body;
            console.log("-------------")
            console.log(Region_name)
            const hotels=await Hotel.find({Region:Region_name})
            return res.json({ hotels });
        } catch (e) {
            console.log(e)
            res.status(400).json({message:"Registration error"})
        }
    }
    async ADD_Hotel(req,res){
        try {
            // Assuming req.files is an array containing multiple files
            for (const file of req.files) {
                const { mimetype, buffer } = file;
                console.log("Mimetype:", mimetype);
                console.log("Buffer:", buffer);
                
                // Create a new Hotel document for each file
                const hotel = new Hotel({
                    Hotel_Name: req.body.Hotel_name,
                    Description: req.body.Description,
                    Stars: req.body.Stars,
                    Region: req.body.Region,
                    City: req.body.City,
                    Location: req.body.Location,
                    Hotel_type: req.body.Type,
                    Room_Amount: req.body.Count,
                    Photo: {
                        data: buffer, // Save the photo data
                        contentType: mimetype // Save the MIME type
                    }
                });
                await hotel.save()
                
            }
        } catch (error) {
            console.error("Error:", error);
        }
        

    }

}
module.exports=new MainController()
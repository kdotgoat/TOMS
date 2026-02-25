import {prisma} from '../utils/prisma.js';

export const newClothing = async (req,res) => {
    try {
        const {name} = req.body;

    const cleanName = name.trim().toLowerCase();
    const existingType = await prisma.clothingType.findFirst({
        where : {name : cleanName},
    });

    if(existingType){
        return res.status(409).json({
            message : `${cleanName}: already exists`, success : false
        });
    }
    await prisma.clothingType.create({
        data : {name: cleanName},
    });

    return res.status(201).json({
        message : "Clothing type created succesfully", success : true
    });
    }
    catch(error){
        return res.status(500).json({
            message : "Failed to create clothing type", success : false
        });
    }
};

export const getAllClothingTypes = async (req, res) => {
    try{
        const clothingTypes = await prisma.clothingType.findMany({
            where : {
                id: true,
                name: true,
                measurements: true
            },
        });

        if(!clothingTypes || clothingTypes.length <= 0){
            return res.status(404).json({
                message : "Clothing types not found", success : false
            });
        }
        
        return res.status(200).json({
            message : "Clothing types found", success : true
        });
    }
    catch(error){
        return res.status(500).json({
            message : "Failed to get clothing types", success : false
        });
    }
};
const Category = require("../models/category");
const category = require("../models/category");

//params middle ware 

exports.getCategoryId = (req,res,next,id) => {
    Category.findById(id).exec((error,category) => {
        if(error || !category){
            return res.status(400).json({
                error : "category not found"
            })
        }
        req.category = category;
        next();
    })
   
}

//create new Category
exports.createCategory = (req,res) => {
    const category = new Category(req.body);
    category.save((error,category) => {
        if(error){
            return res.status(400).json({
                error : "category not found"
            })
        }
        res.json({category})
    })
}

//current categoty
exports.getCategory = (req,res) => {
    res.json(req.category);
}

//get All category present
exports.getAllCategories = (req,res) => {
    Category.find().exec((error,categories) => {
        if(error){
                return res.status(400).json({
                    error : "category not found"
                })
            }
            res.json(categories)
    })
}

//update perticular categoty
exports.updateCategory = (req,res) => {
    const category = req.category;
    category.name = req.body.name

    category.save((error, updatedCategory) => {
        if(error){
            return res.status(400).json({
                error : "category not found"
            })
        }
        res.json(updatedCategory);
    })
}

//remove perticular category
exports.removeCategory = (req,res) => {
    const category = req.category;
    category.remove((error,removedCategory) => {
        if(error){
            return res.status(400).json({
                error : `Failed to delete ${removedCategory.name}`
            })
        }
        res.json({
            message : `${removedCategory.name} removed succesfully :)`
        })
    })
}
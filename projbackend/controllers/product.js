const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

//product id getter
exports.getProductId = (req, res, next, id) => {
    Product.findById(id)
    .populate('category')
    .exec((error, product) => {
        if(error || !product){
            return res.status(400).json({
                error : "No product found!"
            })
        }
        req.product = product;
        next()
    })
}

//creating product
exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(error,feilds,file) => {
        if(error){
            return res.status(400).json({
                error : "Problem with image"
            })
        }

        //de-structure the feilds

        const {name,price,  description,category,stock} = feilds

        if(
            !name ||
            !price ||
            !description ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error : "Please Provide all feilds"
            })
        }

        let product = new Product(feilds)

        //handle the files
        if(file.photo){
            if(file.photo.size > 3*1024*1024){
                return res.status(400).json({
                    error : "file size is greater then 3 mb"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to DB
        product.save((error, product) => {
            if(error){
                return res.status(400).json({
                    error : "Saving to DataBase fails"
                })
            }
            res.json(product);
        })

    })
     
}

//getting product
exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product)
}

//middle ware and getting product phot
exports.getPhoto = (req,res,next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next();
}

//delete
exports.removeProduct = (req,res) => {
    const product = req.product;
    product.remove((error,removedproduct) => {
        if(error){
            return res.status(400).json({
                error : `${removedproduct.name} failed to  deleted`
            })
        }
        res.json({
            message : `${removedproduct.name} is deleted succesfully`
        })
    })
}

//update
exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(error,feilds,file) => {
        if(error){
            return res.status(400).json({
                error : "Problem with image"
            })
        }

        let product = req.product
        product = _.extend(product,feilds)//new feilds will be updated within the product
        //handle the files
        if(file.photo){
            if(file.photo.size > 3*1024*1024){
                return res.status(400).json({
                    error : "file size is greater then 3 mb"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to DB
        product.save((error, product) => {
            if(error){
                return res.status(400).json({
                    error : "Updation Failed!"
                })
            }
            res.json(product);
        })

    })
}


//getting all product and listing with limit
exports.getAllProduct = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy: "-id"

    Product.find()
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .populate("category")
    .select("-photo")
    .exec((error,product) => {
        if(error){
            return res.status(400).json({
                message : "Something Went Wrong Friend :("
            })
        }
        res.json(product)
    })
}

//list all the unique categoties
exports.getAllUniqueCategory = (req,res) => {
    Product.distinct("category",{}, (error,category) => {
        if(error){
            return res.status(400).json({
                error : "Category not found!"
            })
        }
        res.json(category);
    })
}



//stock update middle ware
//TODO: it will be more clear come to this once.
exports.updateStock = (req,res,next) => {

    let myoperation = req.body.order.products.map(prod => {
        return {
            updateOne : {
                filter : {_id : prod._id},
                update : {$inc : {stock : -prod.count,sold : +prod.count}}
            }
        }
    })

    Product.bulkWrite(myoperation, {}, (error,product) => {
        if(error){
            return res.status(400).json({
                error : "Bulk Operation Failed!"
            })
        }
        next();
    })
}
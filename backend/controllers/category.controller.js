const CategoryModel = require('../models/category.model');

exports.createCategory = async (req, res) => {
    try {
        const category = new CategoryModel(req.body);
        await category.save();
        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getCategory = async (req, res) => {
    try {
        const category = await CategoryModel.findById(req.params.id);
        res.status(200).send(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateCategory = async (req, res) => {
    console.log("req.body", req.body);
   const id= req.params.id;
    const {name, subCategories, show} = req.body;
    try {
        const updatedCategory = await CategoryModel.findByIdAndUpdate(
          id,
          { name, subCategories, show },
          { new: true }
        );
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.archiveCategory = async (req, res) => {
    try {
        await CategoryModel.findByIdAndUpdate(req.params.id, { show: false });
        res.status(200).json({ message: 'Category archived successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


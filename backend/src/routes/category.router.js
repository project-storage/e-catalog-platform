const express = require('express');
const categoryRouter = express.Router();
const categoriesController = require('../controllers/category.controller');

categoryRouter.post('/create', categoriesController.createCategory);

categoryRouter.get('/all', categoriesController.getAllCategory);

categoryRouter.get('/info/:id', categoriesController.getCategoryById);

categoryRouter.put('/update/:id', categoriesController.updateCategory);

categoryRouter.delete('/delete/:id', categoriesController.deleteCategory);

module.exports = categoryRouter;

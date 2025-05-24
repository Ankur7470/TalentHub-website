import Category from "../models/category.model.js";
import createError from "../utils/createError.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).send(categories);
  } catch (err) {
    next(err);
  }
};

export const getFeaturedCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ featured: true });
    res.status(200).send(categories);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  if (!req.isSeller && !req.isAdmin)
    return next(createError(403, "Only sellers and admins can create categories"));

  const newCategory = new Category({
    ...req.body,
  });

  try {
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    next(err);
  }
};

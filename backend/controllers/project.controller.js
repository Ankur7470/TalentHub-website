import Project from "../models/project.model.js";
import createError from "../utils/createError.js";

export const getFeaturedProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ featured: true });
    res.status(200).send(projects);
  } catch (err) {
    next(err);
  }
};

export const getProjects = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.cat && { cat: q.cat }),
    ...(q.username && { username: q.username }),
  };

  try {
    const projects = await Project.find(filters).sort({ createdAt: -1 });
    res.status(200).send(projects);
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers can create projects"));

  const newProject = new Project({
    ...req.body,
    username: req.username,
  });

  try {
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    next(err);
  }
};

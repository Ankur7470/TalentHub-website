import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers can create a gig!"));

  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (gig.userId !== req.userId)
      return next(createError(403, "You can delete only your gig!"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    next(err);
  }
};

export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) next(createError(404, "Gig not found!"));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};

export const getGigs = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  // console.log("[getGigs] Filters:", filters);
  try {
    const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
    res.status(200).send(gigs);
  } catch (err) {
    // console.error("[getGigs] Error:", err);
    next(err);
  }
};

export const updateGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    // console.log("Gig User Id: ", gig.userId);
    // console.log("Req UserId: ", req.userId);
    
    if (!gig) return next(createError(404, "Gig not found"));
    if (gig.userId !== req.userId) return next(createError(403, "You can only update your own gigs"));
    
    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    res.status(200).json(updatedGig);
  } catch (err) {
    next(err);
  }
};

export const getMyGigs = async (req, res, next) => {
  try {
    const sort = req.query.sort || "newest";
    let sortBy;

    if (sort === "oldest") sortBy = { createdAt: 1 };
    else if (sort === "sales") sortBy = { sales: -1 };
    else sortBy = { createdAt: -1 }; // default = newest

    const gigs = await Gig.find({ userId: req.userId }).sort(sortBy);
    res.status(200).json(gigs);
  } catch (err) {
    next(err);
  }
};


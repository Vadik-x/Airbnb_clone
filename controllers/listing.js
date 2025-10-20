import listing from "../models/listening.js";

export const index = async (req, res, next) => {
  const homeData = await listing.find();
  res.render("index.ejs", { homeData: homeData.reverse() })
};

export const renderCreateForm = (req, res) => {
  res.render("create");
};

export const submitCreateForm = async (req, res) => {
  let data = req.body;

  if(req.file) {
    data.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  data["rating"] = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
  data["guestFavorite"] = Math.random() < 0.5;
  data["owner"] = req.user._id;

  await listing.create(data);
  
  req.flash("success", "listing created successfully!");
  res.redirect("/home");
};

export const renderListing = async (req, res) => {
  try {
    let { id } = req.params;

    const data = await listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "owner"
        }
      })
      .populate("owner");

    res.render("show", { data, mapApiKey: process.env.MAP_API_KEY });
  } catch (err) {
    req.flash("error", "listing not found");
    res.redirect("/home");
  }
};

export const listingEditForm = async (req, res) => {
  let { id } = req.params;
  const data = await listing.findById(id);
  if(!data) {
    req.flash("listingNotFound", "listing not found");
    return res.redirect("/");
  }
  res.render("edit", { data });
};

export const listingEditDone = async (req, res) => {
  let { id } = req.params;
  const data = await listing.findById(id);
  
  const updatedData = {
    ...req.body,
    rating: data.rating,
    guestFavorite: data.guestFavorite
  };

  if(req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedData.image = { url, filename };
  }

  await listing.findByIdAndUpdate(id, updatedData, { new: true });
  req.flash("edited", "edited listing successfully");
  res.redirect(`/home/${id}`);
};

export const listingDestroy = async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("error", "listing deleted successfully");
  res.redirect("/home");
};
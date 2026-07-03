const Listing = require("../models/listing.js");

module.exports.index = async (req ,res) => {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const allListings = await Listing.find(filter);
    res.render("./listings/index.ejs", {allListings, activeCategory: category || null});
};

module.exports.renderNewForm = (req,res) => {
    return res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "reviews",
        populate : {
            path : "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};


module.exports.createListing = async (req, res, next) => {
   let url = req.file.path;
   let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
   
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
   req.flash("success", "new listing created!");
   return  res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}

module.exports.updateListing = async (req,res) => {
   
    let {id} = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== 'undefined'){
        let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    
    req.flash("success", " listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", " listing deleted!");
    res.redirect("/listings");
};



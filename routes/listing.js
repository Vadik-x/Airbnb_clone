import express from 'express';
import wrapAsync from '../utils/wrapAsync.js'
import multer from 'multer';
import { storage  } from '../cloudConfig.js';
const upload = multer({ storage });
import { isLoggedin, isOwner, validateListing, validateListingUpdate } from '../middleware.js';
import { index, renderCreateForm, submitCreateForm, renderListing, listingEditForm, listingEditDone, listingDestroy } from '../controllers/listing.js';

const router = express.Router();

router.get("/", wrapAsync(index));

router.route("/create")
    .get(isLoggedin, wrapAsync(renderCreateForm))
    .post(
        isLoggedin,
        upload.single('image'),
        validateListing,
        wrapAsync(submitCreateForm)
    );

router.route("/:id")
    .get(renderListing)
    .delete(isLoggedin, isOwner, wrapAsync(listingDestroy));

router.route("/:id/edit")
    .get(isLoggedin, isOwner, wrapAsync(listingEditForm))
    .patch(isLoggedin, isOwner, upload.single('image'), validateListingUpdate, wrapAsync(listingEditDone));

export default router;
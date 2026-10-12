 const express = require("express");

const router = express.Router();

const memberController = require("../controllers/memberController");

const {
    validateMember
} = require("../middlewares/validation");


// GET all members
router.get(
    "/",
    memberController.getMembers
);


// CREATE member
router.post(
    "/",
    validateMember,
    memberController.createMember
);


// UPDATE member
router.put(
    "/:id",
    validateMember,
    memberController.updateMember
);


// DELETE member
router.delete(
    "/:id",
    memberController.deleteMember
);


module.exports = router;
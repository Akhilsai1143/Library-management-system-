 const memberModel = require("../models/memberModel");

async function getMembers(req, res, next) {
    try {
        const members = await memberModel.getAllMembers();

        res.json(members);
    } catch (error) {
        next(error);
    }
}

async function getMemberById(req, res, next) {
    try {
        const memberId = req.params.id;

        const member = await memberModel.getMemberById(memberId);

        if (!member) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        res.json(member);
    } catch (error) {
        next(error);
    }
}

async function createMember(req, res, next) {
    try {
        const result = await memberModel.createMember(req.body);

        res.status(201).json({
            message: "Member created successfully",
            memberId: result.insertId
        });
    } catch (error) {
        next(error);
    }
}

async function updateMember(req, res, next) {
    try {
        const memberId = req.params.id;

        const result = await memberModel.updateMember(
            memberId,
            req.body
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        res.json({
            message: "Member updated successfully"
        });
    } catch (error) {
        next(error);
    }
}

async function deleteMember(req, res, next) {
    try {
        const memberId = req.params.id;

        const result = await memberModel.deleteMember(memberId);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        res.json({
            message: "Member deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember
};
import {tournamentSchema}  from "../model/tournament.model.js";
import mongoose from "mongoose";
import formatDate from "../util/formatDate.js";


const sendError = (res, statusCode, message, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || null,
  });
};

const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
export const createTournament = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      startDate,
      endDate,
      entryFee,
      maxPlayers,
      location,
      matches,
      prizeMoney,
      status,
    } = req.body;

    // Validation
    if (!title || !category || !startDate || !endDate || !maxPlayers || !location || !matches || !prizeMoney) {
      return sendError(res, 400, "Please provide all required fields");
    }

    // Validate category
    const validCategories = ["Cricket", "Soccer", "Basketball", "Tennis"];
    if (!validCategories.includes(category)) {
      return sendError(res, 400, "Invalid category. Must be one of: cricket, soccer, basketball, tennis");
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return sendError(res, 400, "End date must be after start date");
    }

    if (start < new Date()) {
      return sendError(res, 400, "Start date cannot be in the past");
    }

    // Create tournament
    const tournament = await tournamentSchema.create({
      title,
      category,
      description,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      entryFee: entryFee || 0,
      maxPlayers,
      location,
      matches,
      prizeMoney,
      status: status || "upcoming",
      applications: [],
    });

    return sendSuccess(res, 201, "Tournament created successfully", tournament);
  } catch (error) {
    console.error("Create tournament error:", error);
    return sendError(res, 500, "Failed to create tournament", error);
  }
};
export const getTournamentsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Validate category
    const validCategories = ["Cricket", "Soccer", "Basketball", "Tennis"];
    if (!validCategories.includes(category)) {
      return sendError(res, 400, "Invalid category. Must be one of: cricket, soccer, basketball, tennis");
    }

    const tournaments = await tournamentSchema
      .find({ category })
      .sort({ startDate: 1 });

    return sendSuccess(
      res,
      200,
      `Tournaments in ${category} category fetched successfully`,
      {
        count: tournaments.length,
        tournaments,
      }
    );
  } catch (error) {
    console.error("Get tournaments by category error:", error);
    return sendError(res, 500, "Failed to fetch tournaments", error);
  }
};
export const getAllTournaments = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (category) {
      const validCategories = ["cricket", "soccer", "basketball", "tennis"];
      if (!validCategories.includes(category)) {
        return sendError(res, 400, "Invalid category");
      }
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const tournaments = await tournamentSchema
      .find(filter)
      .sort({ startDate: 1 });

    return sendSuccess(res, 200, "Tournaments fetched successfully", {
      count: tournaments.length,
      tournaments,
    });
  } catch (error) {
    console.error("Get all tournaments error:", error);
    return sendError(res, 500, "Failed to fetch tournaments", error);
  }
};
export const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid tournament ID");
    }

    const tournament = await tournamentSchema.findById(id);

    if (!tournament) {
      return sendError(res, 404, "Tournament not found");
    }

    return sendSuccess(res, 200, "Tournament fetched successfully", tournament);
  } catch (error) {
    console.error("Get tournament by ID error:", error);
    return sendError(res, 500, "Failed to fetch tournament", error);
  }
}
export const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid tournament ID");
    }

    // Find tournament
    const tournament = await tournamentSchema.findById(id);
    if (!tournament) {
      return sendError(res, 404, "Tournament not found");
    }

    // Validate category if provided
    if (updateData.category) {
      const validCategories = ["cricket", "soccer", "basketball", "tennis"];
      if (!validCategories.includes(updateData.category)) {
        return sendError(res, 400, "Invalid category");
      }
    }

    // Validate dates if provided
    if (updateData.startDate && updateData.endDate) {
      const start = new Date(updateData.startDate);
      const end = new Date(updateData.endDate);
      
      if (start >= end) {
        return sendError(res, 400, "End date must be after start date");
      }
    }

    // Don't allow updating applications array directly
    delete updateData.applications;

    // Update tournament
    const updatedTournament = await tournamentSchema.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, 200, "Tournament updated successfully", updatedTournament);
  } catch (error) {
    console.error("Update tournament error:", error);
    return sendError(res, 500, "Failed to update tournament", error);
  }
};
export const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid tournament ID");
    }

    const tournament = await tournamentSchema.findById(id);
    if (!tournament) {
      return sendError(res, 404, "Tournament not found");
    }

    // Check if tournament has applications
    if (tournament.applications && tournament.applications.length > 0) {
      return sendError(
        res,
        400,
        "Cannot delete tournament with registered applications. Please cancel the tournament instead."
      );
    }

    await tournamentSchema.findByIdAndDelete(id);

    return sendSuccess(res, 200, "Tournament deleted successfully", {
      deletedTournament: tournament,
    });
  } catch (error) {
    console.error("Delete tournament error:", error);
    return sendError(res, 500, "Failed to delete tournament", error);
  }
};
export const applyForTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { captainName, captainEmail, captainPhone, teamName } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid tournament ID");
    }

    // Basic validation
    if (!captainName || !captainEmail || !captainPhone || !teamName) {
      return sendError(
        res,
        400,
        "All fields are required: captainName, captainEmail, captainPhone, teamName"
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(captainEmail)) {
      return sendError(res, 400, "Invalid email format");
    }

    // Validate phone format
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(captainPhone)) {
      return sendError(res, 400, "Invalid phone number format (7-15 digits)");
    }

    // Find tournament
    const tournament = await tournamentSchema.findById(id);
    if (!tournament) {
      return sendError(res, 404, "Tournament not found");
    }

    // Check if tournament is accepting applications
    if (tournament.status !== "upcoming") {
      return sendError(
        res,
        400,
        "Applications are only accepted for upcoming tournaments"
      );
    }

    // Check if tournament is full
    if (tournament.applications && tournament.applications.length >= tournament.maxPlayers) {
      return sendError(res, 400, "Tournament is full");
    }

    // Prevent duplicate application (same team or same email)
    const alreadyApplied = tournament.applications?.some(
      (app) =>
        app.teamName.toLowerCase() === teamName.toLowerCase() ||
        app.captainEmail.toLowerCase() === captainEmail.toLowerCase()
    );

    if (alreadyApplied) {
      return sendError(
        res,
        409,
        "This team or email has already applied to this tournament"
      );
    }

    // Push application
    const application = {
      captainName,
      captainEmail,
      captainPhone,
      teamName,
    };

    tournament.applications.push(application);
    await tournament.save();

    // Return the newly created application
    const createdApplication = tournament.applications[tournament.applications.length - 1];

    return sendSuccess(res, 201, "Application submitted successfully", {
      application: createdApplication,
      tournament: {
        id: tournament._id,
        title: tournament.title,
        category: tournament.category,
      },
    });
  } catch (error) {
    console.error("Apply for tournament error:", error);
    return sendError(res, 500, "Failed to submit application", error);
  }
};
export const getTournamentApplications = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid tournament ID");
    }

    const tournament = await tournamentSchema.findById(id);
    if (!tournament) {
      return sendError(res, 404, "Tournament not found");
    }

    return sendSuccess(res, 200, "Applications fetched successfully", {
      count: tournament.applications.length,
      applications: tournament.applications,
      tournament: {
        id: tournament._id,
        title: tournament.title,
        category: tournament.category,
        maxPlayers: tournament.maxPlayers,
      },
    });
  } catch (error) {
    console.error("Get tournament applications error:", error);
    return sendError(res, 500, "Failed to fetch applications", error);
  }
};
export const removeApplication = async (req, res) => {
  try {
    const { id, applicationId } = req.params;

    // Validate MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(applicationId)) {
      return sendError(res, 400, "Invalid tournament or application ID");
    }

    // Find tournament
    const tournament = await tournamentSchema.findById(id);
    if (!tournament) {
      return sendError(res, 404, "Tournament not found");
    }

    // Find application index
    const applicationIndex = tournament.applications.findIndex(
      (app) => app._id.toString() === applicationId
    );

    if (applicationIndex === -1) {
      return sendError(res, 404, "Application not found");
    }

    // Check if tournament has started
    const currentDate = new Date();
    const startDate = new Date(tournament.startDate);
    
    if (currentDate > startDate) {
      return sendError(
        res,
        400,
        "Cannot remove application from tournament that has already started"
      );
    }

    // Remove application
    tournament.applications.splice(applicationIndex, 1);
    await tournament.save();

    return sendSuccess(res, 200, "Application removed successfully", {
      tournament: {
        id: tournament._id,
        title: tournament.title,
        remainingApplications: tournament.applications.length,
      },
    });
  } catch (error) {
    console.error("Remove application error:", error);
    return sendError(res, 500, "Failed to remove application", error);
  }
};

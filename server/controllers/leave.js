const Boom = require('@hapi/boom');
const { message } = require('../utils/message');

const LeaveRequest = require('../models').leaveRequests;
const UserLeave = require('../models').userLeaves;
const User = require('../models').users;

// Apply for leave by student
const leaveRequest = async (req, res, next) => {
  try {
    const data = req.body;
    data.userId = req.user;

    const leave = await LeaveRequest.create(data);

    res.status(200).json({
      message: 'Leave applied successfully',
      leave
    });

  } catch (err) {
    return next(Boom.badImplementation(err));
  }
}

// View leave status by student
const getLeaveStatus = async (req, res, next) => {
  try {
    const userId = req.user;

    const leave = await LeaveRequest.findAll({ 
      where: { userId },
      order: [['createdAt', 'DESC']] 
    });

    res.status(200).json({
      leave
    });

  } catch (err) {
    return next(Boom.badImplementation(err));
  }
}

// Get single leave by id
const getLeaveById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const leave = await LeaveRequest.findOne({ where: { id } });
    if(!leave){
      return next(Boom.badRequest(message.RECORD_NOT_FOUND));
    }

    res.status(200).json({
      leave
    });

  } catch (err) {
    return next(Boom.badImplementation(err));
  }
}

// View leave balance by student
const getLeaveBalance = async (req, res, next) => {
  try {
    const userId = req.user;

    const leave = await UserLeave.findAll({ where: { userId } });

    res.status(200).json({
      leave
    });

  } catch (err) {
    return next(Boom.badImplementation(err));
  }
}

// Update leave by student
const updateLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    data.userId = req.user;

    const leave = await LeaveRequest.findOne({ where: { id } });
    if(!leave){
      return next(Boom.badRequest(message.RECORD_NOT_FOUND));
    }

    if (["approved", "rejected"].includes(leave.status)) {
      return next(Boom.badRequest(`You can't update this leave because of this leave has already ${leave.status}`));
    }

    await LeaveRequest.update(data, {
      where: { id }
    });

    res.status(200).json({
      message: 'Leave updated successfully'
    });

  } catch (err) {
    return next(Boom.badImplementation(err));
  }
}

// delete leave by student
const deleteLeave = async (req, res, next) => {
  try {
    const { id } = req.params;

    const leave = await LeaveRequest.findOne({ where: { id } });
    if(!leave){
      return next(Boom.badRequest(message.RECORD_NOT_FOUND));
    }

    if (["approved", "rejected"].includes(leave.status)) {
      return next(Boom.badRequest(`You can't delete this leave because of this leave has already ${leave.status}`));
    }

    await LeaveRequest.destroy({
      where: { id }
    });

    res.status(200).json({
      message: 'Leave deleted successfully'
    });

  } catch (err) {
    return next(Boom.badImplementation(err));
  }
}




// View all leave list by HOD & Faculty
const getPendingLeaveList = async (req, res, next) => {
  try {
    // const { status } = req.query;

    // const filter = {};
    // if (status) {
    //   filter.status = status;
    // } 

    const leaveList = await LeaveRequest.findAll({
      where: { status: 'pending' },
      include: {
        model: User,
        as: 'user',
        attributes: ['name'],
      }
    });

    res.status(200).json({
      leaveList
    });

  } catch (err) {
    return next(Boom.badImplementation(err));
  }
}

// Update leave status by HOD & Faculty
const leaveApproval = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const leave = await LeaveRequest.findOne({ where: { id } });
    if(!leave){
      return next(Boom.badRequest(message.RECORD_NOT_FOUND));
    }

    // Leave status is approved / rejected then can't update leave status
    if (["approved", "rejected"].includes(leave.status)) {
      return next(Boom.badRequest("Leave status can't update"));
    }

    leave.status = status;
    const updatedLeave = await leave.save();

    if (updatedLeave.status === "approved"){
      // Find the userId from the leave id (req.params)
      const userId = leave.userId;

      // Find the total leave days based on startDate - endDate
      const leaveDays = parseInt((leave.endDate - leave.startDate) / (1000 * 60 * 60 * 24) + 1);

      const userLeave = await UserLeave.findOne({ where: { userId } });
      if(!userLeave){
        return next(Boom.badRequest(message.RECORD_NOT_FOUND));
      }

      // Update available leave in UserLeave model
      userLeave.availableLeave -= leaveDays;

      // Update usedLeave in UserLeave model
      userLeave.usedLeave += leaveDays;

      // Calculate attendance and Update attendance in UserLeave model
      userLeave.attendancePerc = Math.round((userLeave.totalWorkingDays - userLeave.usedLeave) * 100 / userLeave.totalWorkingDays);

      await userLeave.save();
    }

    res.status(200).json({
      message: `Leave ${status} successfully`
    });

  } catch (err) {
    return next(Boom.badImplementation(err));
  }
}

// View leave report of HOD, Faculty and student by admin
const getLeaveReport = async (req, res, next) => {
  try {
    const leaveReportList = await UserLeave.findAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'role'],
        where: { role: 4 }
      }
    });

    res.status(200).json({
      leaveReportList
    });

  } catch (err) {
    return next(Boom.badImplementation(err));
  }
}

module.exports = {
  leaveRequest,
  getLeaveStatus,
  getLeaveById,
  getLeaveBalance,
  updateLeave,
  deleteLeave,
  getPendingLeaveList,
  leaveApproval,
  getLeaveReport
}
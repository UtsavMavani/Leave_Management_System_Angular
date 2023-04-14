const router = require('express').Router();
const authUser = require('../middleware/auth');
const leave = require('../controllers/leave');

// Student
router.post('/leaveRequest', authUser, leave.leaveRequest);
router.get('/leaveStatus', authUser, leave.getLeaveStatus);
router.get('/getLeave/:id', authUser, leave.getLeaveById);
router.get('/leaveBalance', authUser, leave.getLeaveBalance);
router.put('/updateLeave/:id', authUser, leave.updateLeave);
router.delete('/deleteLeave/:id', authUser, leave.deleteLeave);

// HOD & Faculty
router.get('/pendingLeave', authUser, leave.getPendingLeaveList)
router.put('/approveLeave/:id', authUser, leave.leaveApproval);

// Admin
router.get('/leaveReport', authUser, leave.getLeaveReport);

module.exports = router;
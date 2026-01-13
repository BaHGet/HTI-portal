const { getIO } = require("../utils/socket");

exports.emitSeatsUpdate = (courseGroupId, currentEnrolled, capacity) => {
    try {
        const io = getIO();
        const availableSeats = capacity - currentEnrolled;
        
        io.emit('seats_update', {
            groupId: courseGroupId,
            availableSeats: availableSeats,
        });
        
        console.log(`[Socket] Broadcasted update for Group ${courseGroupId}: ${availableSeats} seats left.`);
    } catch (error) {
        console.error("Socket emit failed:", error.message);
    }
};


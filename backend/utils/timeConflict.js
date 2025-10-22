
const checkTimeConflict = (newAppointments, currentAppointments) => {
  for (const newApp of newAppointments) {
    for (const currentApp of currentAppointments) {
      if (!newApp.TimePeriod || !currentApp.TimePeriod) {
        continue;
      }
      
      const isSameDay = newApp.DayOfWeek === currentApp.DayOfWeek;
      
      const timesOverlap = 
        newApp.TimePeriod.StartTime < currentApp.TimePeriod.EndTime &&
        newApp.TimePeriod.EndTime > currentApp.TimePeriod.StartTime;

      if (isSameDay && timesOverlap) {
        return true; 
      }
    }
  }
  return false; 
};


module.exports = checkTimeConflict;

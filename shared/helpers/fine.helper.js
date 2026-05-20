const { differenceInDays, isAfter } = require("date-fns");

// CALCULATE FINE
const calculateFine = (dueDate, returnDate) => {
  let fine = 0;

  // CHECK OVERDUE
  const isOverdue = isAfter(returnDate, dueDate);

  if (isOverdue) {
    const lateDays = differenceInDays(returnDate, dueDate);

    fine = lateDays * 10;
  }

  return fine;
};

module.exports = {
  calculateFine,
};

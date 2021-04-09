const { createPDF } = require('./pdfTemplate.js');
const { invoice, credit, statement } = require("./models.js");

createPDF(invoice, "invoice");
// createPDF(credit, "credit");
// createPDF(statement, "statement");
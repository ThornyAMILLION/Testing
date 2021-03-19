const { createPDF } = require('./pdfTemplate.js');
const { invoice } = require("./models.js");

createPDF(invoice);
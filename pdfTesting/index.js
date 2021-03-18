const { jsPDF } = require("jspdf"); // will automatically load the node version
const { imgData } = require("./models.js");

const doc = new jsPDF();

// Order Info
let date = '';
let invoiceId = '';
let gst_hst = '';
let method = '';

// Max Info
let maxCompanyName = '';
let maxNumber = '';
let maxAddress = '';
let maxPoProvince = '';

// Customer info
let customerCompanyName = '';
let customerNumber = '';
let customerAddress = '';
let customerPoProvince = '';

// Max Logo
doc.addImage(imgData, 'PNG', 10, 0, 50, 50);

//Order Info
doc.text(`Date: ${date}`, 130, 20);
doc.text(`Invoice #: ${invoiceId}`, 130, 25);
doc.text(`GST/HST #: ${gst_hst}`, 130, 30);
doc.text(`Method: ${method}`, 130, 35);

// Business Details
doc.text("Business Details:", 10, 50);
doc.text(`${maxCompanyName}`, 10, 55); // Company Name
doc.text(`${maxNumber}`, 10, 60); // Phone Number
doc.text(`${maxAddress}`, 10, 65); // Address
doc.text(`${maxPoProvince}`, 10, 70); // PO and Province/State

// Customer Details
doc.text("Customer Details:", 130, 50);
doc.text(`${customerCompanyName}`, 130, 55); // Company Name
doc.text(`${customerNumber}`, 130, 60); // Phone Number
doc.text(`${customerAddress}`, 130, 65); // Address
doc.text(`${customerPoProvince}`, 130, 70); // PO and Province/State

// Table
doc.text("Items:", 10, 90);
doc.text("# Product MAX-Product Unit cost (after discounts) Quantity Shipped Total", 10, 95);

// Order Total
doc.text("Total:", 130, 120);
doc.text("Subtotal:", 130, 125); // Subtotal
doc.text("Taxes (13%):", 130, 130); // Taxes
doc.text("Total:", 130, 135); // Total

// Note
doc.text("NOTE: 2% interest per month on all accounts over 30 days. 5% handling ", 10, 150);
doc.text("fee on all new returns. All goods to be returned must be in original package.", 10, 155);
doc.text("Within 5 days of shipment all discrepancy must be reported.", 10, 160);

doc.save("'testPDF.pdf"); // will save the file in the current working directory
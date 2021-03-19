const { jsPDF } = require("jspdf"); // will automatically load the node version
const { imgData } = require("./models.js");

const doc = new jsPDF();
const defaultFontSize = doc.getFontSize();


var invoice = {
    "order_id": 80002109,
    "username": "Test",
    "date_created": "2021-03-09 12:31:02",
    "price_subtotal_pre_discount": null,
    "price_subtotal": "575.70",
    "price_total": "650.54",
    "rebate_applied": "0.00",
    "price_final": "650.54",
    "paid": 0,
    "partial_payment": "0.00",
    "pcodes": "R53068ONZ,R53069ONZ,OCG0569,OCG0570,R31257ONZ,R31257SCB,R3295ONZ,R3295SCB,AFN0905,P905CDM,R31050SNZ",
    "products": "R53068ONZ,R53069ONZ,OCG0569,OCG0570,R31257ONZ,R31257SCB,R3295ONZ,R3295SCB,AFN0905,P905CDM,R31050SNZ",
    "qtys": "2,2,2,2,6,4,2,4,5,4,2",
    "qtys_shipped": "2,2,2,2,6,4,2,4,5,4,2",
    "date_shipped": "2021-03-18 13:55:13",
    "qtys_returned": "0,0,0,0,0,0,0,0,0,0,0",
    "prices": "31.24,23.23,33.16,25.30,12.28,17.96,15.22,15.76,15.00,9.00,17.19",
    "prices_discounted": "30.927599999999998,22.997700000000002,29.843999999999998,22.77,12.1572,17.7804,7.61,15.6024,14.25,8.91,17.0181",
    "returned": 0,
    "date_returned": null,
    "custom_po": "34489",
    "ship_method": "Shipping",
    "notes": null,
    "cost_subtotal_pre_discount": null,
    "cost_subtotal": "575.70",
    "cost_total": "650.54",
    "cost_final": "650.54",
    "orderscol": null,
    "new": 1,
    "company_name": "Max Advanced Brakes"
};

// Table info
var products = invoice.products.split(',');
var unit_cost = invoice.prices_discounted.split(',');
var quantity = invoice.qtys.split(',');
var shipped = invoice.qtys_shipped.split(',');

// Total info
var subtotal = invoice.cost_subtotal;
var total = invoice.cost_final;

var yPos = 100; // y axis

// Order Info
var date = invoice.date_created;
var invoiceId = invoice.order_id;
var gst_hst = '';
var method = invoice.ship_method;

// Customer info
var customerCompanyName = invoice.company_name;
var customerNumber = '';
var customerAddress = '';
var customerPoProvince = '';

function tableItem(index) {
    doc.text(`${index + 1}`, 10, yPos);
    doc.text(`${products[index]}`, 17, yPos);
    doc.text(`${''}`, 39, yPos);
    doc.text(`$${Number(unit_cost[index]).toFixed(2)}`, 74, yPos);
    doc.text(`${quantity[index]}`, 139, yPos);
    doc.text(`${shipped[index]}`, 161, yPos);
    doc.text(`$${(Number(unit_cost[index]) * Number(quantity[index])).toFixed(2)}`, 183, yPos);
}

function addContent() {
    // Max Logo
    doc.addImage(imgData, 'PNG', 10, 0, 50, 50);

    //Order Info
    doc.text(`Date: ${date}`, 130, 20);
    doc.text(`Invoice #: ${invoiceId}`, 130, 25);
    doc.text(`GST/HST #: ${gst_hst}`, 130, 30);
    doc.text(`Method: ${method}`, 130, 35);

    // Business Details
    doc.text("Business Details:", 10, 50);
    doc.text("Max Advanced Brakes", 10, 55); // Company Name
    doc.text('905-754-0575', 10, 60); // Phone Number
    doc.text('280 Hilmount Road, Unit 5', 10, 65); // Address
    doc.text('L6C 3A1 Markham, ON Canada', 10, 70); // PO and Province/State

    // Customer Details
    doc.text("Customer Details:", 130, 50);
    doc.text(`${customerCompanyName}`, 130, 55); // Company Name
    doc.text(`${customerNumber}`, 130, 60); // Phone Number
    doc.text(`${customerAddress}`, 130, 65); // Address
    doc.text(`${customerPoProvince}`, 130, 70); // PO and Province/State

    // Table
    doc.text("Items:", 10, 90);
    doc.text("#", 10, 95);
    doc.text("Product", 17, 95);
    doc.text("MAX-Product", 39, 95);
    doc.text("Unit cost (after discounts)", 74, 95);
    doc.text("Quantity", 139, 95);
    doc.text("Shipped", 161, 95);
    doc.text("Total", 183, 95);
    doc.setFontSize(10);
    for (let i = 0; i < products.length; i++) {
        if (i === 0) {
            tableItem(i);
        } else {
            yPos += 5;
            tableItem(i);
        }
    }
    doc.setFontSize(defaultFontSize);
    // Order Total
    yPos += 20;
    doc.text("Total:", 130, yPos);
    yPos += 5;
    doc.text(`Subtotal:`, 130, yPos); // Subtotal
    doc.text(`$${subtotal}`, 165, yPos);
    yPos += 5;
    doc.text(`Taxes (13%):`, 130, yPos); // Taxes
    doc.text(`$${(Number(total) - Number(subtotal)).toFixed(2)}`, 165, yPos);
    yPos += 5;
    doc.text(`Total:`, 130, yPos); // Total
    doc.text(`$${total}`, 165, yPos);

    // Order Note
    yPos += 15;
    doc.text("NOTE: 2% interest per month on all accounts over 30 days. 5% handling ", 10, yPos);
    yPos += 5;
    doc.text("fee on all new returns. All goods to be returned must be in original package.", 10, yPos);
    yPos += 5;
    doc.text("Within 5 days of shipment all discrepancy must be reported.", 10, yPos);
}

addContent();

doc.save(`${invoiceId}.pdf`); // will save the file in the current working directory
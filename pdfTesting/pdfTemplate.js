const { jsPDF } = require("jspdf"); // will automatically load the node version
const { imgData } = require("./models.js");

const doc = new jsPDF();

function createPDF(invoice) {
    var order = { date: invoice.date_created, invoiceId: invoice.order_id, gst_hst: '', method: invoice.method, customerCompanyName: invoice.company_name, customerNumber: '', customerAddress: '', customerPoProvince: '', products: invoice.products.split(','), unit_cost: invoice.prices_discounted.split(','), quantity: invoice.qtys.split(','), shipped: invoice.qtys_shipped.split(','), subtotal: invoice.cost_subtotal, total: invoice.cost_final }

    addContent(order);
    doc.save(`${order.invoiceId}.pdf`); // will save the file in the current working directory
}

function tableItem(index, order, yPos) {
    doc.text(`${index + 1}`, 10, yPos);
    doc.text(`${order.products[index]}`, 17, yPos);
    doc.text(`${''}`, 39, yPos);
    doc.text(`$${Number(order.unit_cost[index]).toFixed(2)}`, 74, yPos);
    doc.text(`${order.quantity[index]}`, 139, yPos);
    doc.text(`${order.shipped[index]}`, 161, yPos);
    doc.text(`$${(Number(order.unit_cost[index]) * Number(order.quantity[index])).toFixed(2)}`, 183, yPos);
}

function addContent(order) {
    const defaultFontSize = doc.getFontSize();
    let yPos = 100; // y axis

    // Max Logo
    doc.addImage(imgData, 'PNG', 10, 0, 50, 50);

    //Order Info
    doc.text(`Date: ${order.date}`, 130, 20);
    doc.text(`Invoice #: ${order.invoiceId}`, 130, 25);
    doc.text(`GST/HST #: ${order.gst_hst}`, 130, 30);
    doc.text(`Method: ${order.method}`, 130, 35);

    // Business Details
    doc.text("Business Details:", 10, 50);
    doc.text("Max Advanced Brakes", 10, 55); // Company Name
    doc.text('905-754-0575', 10, 60); // Phone Number
    doc.text('280 Hilmount Road, Unit 5', 10, 65); // Address
    doc.text('L6C 3A1 Markham, ON Canada', 10, 70); // PO and Province/State

    // Customer Details
    doc.text("Customer Details:", 130, 50);
    doc.text(`${order.customerCompanyName}`, 130, 55); // Company Name
    doc.text(`${order.customerNumber}`, 130, 60); // Phone Number
    doc.text(`${order.customerAddress}`, 130, 65); // Address
    doc.text(`${order.customerPoProvince}`, 130, 70); // PO and Province/State

    // Table
    doc.text("Items:", 10, 90);
    doc.text("#", 10, 95);
    doc.text("Product", 17, 95);
    doc.text("MAX-Product", 39, 95);
    doc.text("Unit cost (after discounts)", 74, 95);
    doc.text("Quantity", 139, 95);
    doc.text("Shipped", 161, 95);
    doc.text("Total", 183, 95);

    // Table items
    doc.setFontSize(10);
    for (let i = 0; i < order.products.length; i++) {
        if (i === 0) {
            tableItem(i, order, yPos);
        } else {
            yPos += 5;
            tableItem(i, order, yPos);
        }
    }
    doc.setFontSize(defaultFontSize);

    // Order Total
    yPos += 20;
    doc.text("Total:", 130, yPos);
    yPos += 5;
    doc.text(`Subtotal:`, 130, yPos); // Subtotal
    doc.text(`$${order.subtotal}`, 165, yPos);
    yPos += 5;
    doc.text(`Taxes (13%):`, 130, yPos); // Taxes
    doc.text(`$${(Number(order.total) - Number(order.subtotal)).toFixed(2)}`, 165, yPos);
    yPos += 5;
    doc.text(`Total:`, 130, yPos); // Total
    doc.text(`$${order.total}`, 165, yPos);

    // Order Note
    yPos += 15;
    doc.text("NOTE: 2% interest per month on all accounts over 30 days. 5% handling ", 10, yPos);
    yPos += 5;
    doc.text("fee on all new returns. All goods to be returned must be in original package.", 10, yPos);
    yPos += 5;
    doc.text("Within 5 days of shipment all discrepancy must be reported.", 10, yPos);
}

module.exports = { createPDF }
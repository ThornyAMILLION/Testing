const { jsPDF } = require("jspdf"); // will automatically load the node version
const { autoTable } = require('jspdf-autotable');
const { imgData } = require("./models.js");

const doc = new jsPDF();

function createPDF(content, pdfContent) {
    var order;

    if (pdfContent === "credit") {
        order = { return_id: content.return_id, order_ids: content.order_ids, username: content.username, date_created: content.date_created, refund_subtotal: content.refund_subtotal, refund_total: content.refund_total, products: content.products, qtys: content.qtys, prices_discounted: content.prices_discounted };
    } else if (pdfContent === "statement") {
        order = { statement_id: content.statement_id, username: content.username, date_created: content.date_created, invoice_dates: content.invoice_dates, types: content.types, invoice_ids: content.invoice_ids, cost_totals: content.cost_totals, balance_subtotal: content.balance_subtotal, balance: content.balance, fully_paid: content.fully_paid, paid_amount: content.paid_amount, date_paid: content.date_paid, markpaid_user: content.markpaid_user };
    } else {
        order = { date: content.date_created, invoiceId: content.order_id, gst_hst: '', method: content.method, customerCompanyName: content.company_name, customerNumber: '', customerAddress: '', customerPoProvince: '', products: content.products.split(','), unit_cost: content.prices_discounted.split(','), quantity: content.qtys.split(','), shipped: content.qtys_shipped.split(','), subtotal: content.cost_subtotal, total: content.cost_final };
    }

    addContent(order, pdfContent);
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
    doc.line(10, yPos + 1, 195, yPos + 1);
}

function addContent(order) {
    const defaultFontSize = doc.getFontSize();
    let yPos = 105; // y axis

    // Max Logo
    doc.addImage(imgData, 'PNG', 10, 0, 50, 35);

    //Order Info
    doc.text(`Date: ${order.date}`, 130, 10);
    doc.text(`Invoice #: ${order.invoiceId}`, 130, 15);
    doc.text(`GST/HST #: ${order.gst_hst}`, 130, 20);
    doc.text(`Method: ${order.method}`, 130, 25);
    
    doc.text(`Invoice #: ${order.invoiceId}`, 10, 42);

    // Business Details
    doc.setFontSize(15);
    doc.text("Business Details:", 10, 50);
    doc.rect(10, 53, 90, 25);
    doc.setFontSize(10);
    doc.text("Max Advanced Brakes", 15, 60); // Company Name
    doc.text('905-754-0575', 15, 65); // Phone Number
    doc.text('280 Hilmount Road, Unit 5', 15, 70); // Address
    doc.text('L6C 3A1 Markham, ON Canada', 15, 75); // PO and Province/State

    // Customer Details
    doc.setFontSize(15);
    doc.text("Customer Details:", 130, 50);
    doc.rect(130, 53, 70, 25);
    doc.setFontSize(10);
    doc.text(`${order.customerCompanyName}`, 135, 60); // Company Name
    doc.text(`${order.customerNumber}`, 135, 65); // Phone Number
    doc.text(`${order.customerAddress}`, 135, 70); // Address
    doc.text(`${order.customerPoProvince}`, 135, 75); // PO and Province/State

    let tableArrObj = [];
    let headers = ['#', 'Product', 'Max-Product', 'Unit cost (after discounts)', 'Quantity', 'Shipped', 'Total'];
    for (let i = 0; i < order.products.length; i++) {
        tableArrObj.push([(i + 1).toString(), order.products[i], '0', Number(order.unit_cost[i]).toFixed(2), order.quantity[i], order.shipped[i], (Number(order.unit_cost[i]) * Number(order.quantity[i])).toFixed(2)]);
    }

    // Table
    doc.setFontSize(defaultFontSize);
    doc.text("Items:", 10, 90);
    // Make auto using predefined values
    doc.autoTable({
        head: [headers],
        body: tableArrObj,
        startY: 105,
        headStyles: { fillColor: [242, 121, 0] }
    });
    yPos = doc.lastAutoTable.finalY;

    // Order Total
    yPos += 20;
    doc.text("Total:", 130, yPos);
    yPos += 10;
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
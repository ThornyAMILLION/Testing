var currentPage = 1;
var prevPageNum = currentPage;
var numOfPages = 6;

function nextPage() {
    if (currentPage < numOfPages) {
        prevPageNum = currentPage;
        currentPage++;
        changePage(currentPage, prevPageNum);
    }
}

function prevPage() {
    if (currentPage > 1) {
        prevPageNum = currentPage;
        currentPage--;
        changePage(currentPage, prevPageNum);
    }
}

function changePage(page, prev) {
    prevPageNum = (prev) ? (prev) : (currentPage);
    currentPage = page;
    console.log(currentPage, prevPageNum);
    var currentPageBtn = document.getElementsByTagName("li")[currentPage];
    var prevPageBtn = document.getElementsByTagName("li")[prevPageNum];
    var att = document.createAttribute("class");
    prevPageBtn.setAttribute("class", "");
    att.value = "active";
    currentPageBtn.setAttributeNode(att);
}
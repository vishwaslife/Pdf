let pdfDoc = null;
let scale = 1.2;
let currentPage = 1;
let textToolEnabled = false;

// Load PDF
document.getElementById("upload").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function () {
        const bytes = new Uint8Array(this.result);
        pdfDoc = await pdfjsLib.getDocument(bytes).promise;

        renderAllPages();
        renderThumbnails();
    };
    reader.readAsArrayBuffer(file);
});

// Render full PDF pages
async function renderAllPages() {
    const container = document.getElementById("pdf-container");
    container.innerHTML = "";

    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const canvas = await renderPage(i);
        container.appendChild(canvas);
    }
}

async function renderPage(pageNum) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: ctx, viewport }).promise;

    // Text adder
    canvas.addEventListener("click", (e) => {
        if (!textToolEnabled) return;
        const text = prompt("Enter text:");
        if (!text) return;

        ctx.font = "24px Arial";
        ctx.fillStyle = "red";
        ctx.fillText(text, e.offsetX, e.offsetY);
    });

    return canvas;
}

// Thumbnails
async function renderThumbnails() {
    const thumbs = document.getElementById("thumbs");
    thumbs.innerHTML = "";

    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.2 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: ctx, viewport }).promise;

        canvas.addEventListener("click", () => jumpToPage(i));
        thumbs.appendChild(canvas);
    }
}

function jumpToPage(n) {
    currentPage = n;
    document.querySelector(".viewer").scrollTo({
        top: document.getElementById("pdf-container").children[n - 1].offsetTop - 20,
        behavior: "smooth"
    });
}

function zoomIn() {
    scale += 0.2;
    renderAllPages();
}

function zoomOut() {
    if (scale > 0.4) scale -= 0.2;
    renderAllPages();
}

function enableTextTool() {
    textToolEnabled = true;
    alert("Click on the page to add text.");
}

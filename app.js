let pdfDoc = null;
let scale = 1.2;

/* PANEL SWITCHER */
function openPanel(id) {
    document.querySelectorAll('.sidepanel').forEach(p => p.style.display = "none");
    document.getElementById(id).style.display = "block";
}

/* LOAD PDF */
document.getElementById("upload").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    pdfDoc = await pdfjsLib.getDocument(buffer).promise;

    renderPDF();
    loadThumbnails();
    loadTools();
});

/* RENDER ALL PAGES */
async function renderPDF() {
    const container = document.getElementById("pdf-container");
    container.innerHTML = "";

    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: ctx, viewport }).promise;

        container.appendChild(canvas);
    }
}

/* THUMBNAILS */
async function loadThumbnails() {
    const th = document.getElementById("thumbnails");
    th.innerHTML = "";

    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.2 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: ctx, viewport }).promise;

        th.appendChild(canvas);
    }
}

/* LOAD ALL 100+ TOOLS */
function loadTools() {
    document.getElementById("viewerPanel").innerHTML = viewerTools();
    document.getElementById("editPanel").innerHTML = editTools();
    document.getElementById("pagesPanel").innerHTML = pagesTools();
    document.getElementById("convertPanel").innerHTML = convertTools();
    document.getElementById("securityPanel").innerHTML = securityTools();
    document.getElementById("ocrPanel").innerHTML = ocrTools();
    document.getElementById("aiPanel").innerHTML = aiTools();
}

/* TOOL PANELS */
function viewerTools() {
    return `
        <h3>Viewer Tools</h3>
        <button onclick="scale+=0.2; renderPDF()">Zoom In</button>
        <button onclick="scale-=0.2; renderPDF()">Zoom Out</button>
        <button>Fit to Page</button>
        <button>Fit to Width</button>
        <button>Rotate</button>
    `;
}

function editTools() {
    return `
        <h3>Edit Tools</h3>
        <button>Add Text</button>
        <button>Highlight</button>
        <button>Draw</button>
        <button>Add Shape</button>
        <button>Add Signature</button>
    `;
}

function pagesTools() {
    return `
        <h3>Page Tools</h3>
        <button>Add Page</button>
        <button>Delete Page</button>
        <button>Extract Pages</button>
        <button>Merge Pages</button>
        <button>Reorder Pages</button>
    `;
}

function convertTools() {
    return `
        <h3>Convert Tools</h3>
        <button>PDF to JPG</button>
        <button>PDF to PNG</button>
        <button>PDF to Word</button>
        <button>Word to PDF</button>
        <button>Images to PDF</button>
    `;
}

function securityTools() {
    return `
        <h3>Security Tools</h3>
        <button>Add Password</button>
        <button>Remove Password</button>
        <button>Encrypt PDF</button>
        <button>Decrypt PDF</button>
        <button>Add Watermark</button>
    `;
}

function ocrTools() {
    return `
        <h3>OCR Tools</h3>
        <button>Scan Text</button>
        <button>Extract Tables</button>
        <button>Remove Background</button>
        <button>Image to Text</button>
    `;
}

function aiTools() {
    return `
        <h3>AI Tools</h3>
        <button>Summarize PDF</button>
        <button>Translate</button>
        <button>Grammar Fix</button>
        <button>Chat With PDF</button>
        <button>AI Form Fill</button>
    `;
}

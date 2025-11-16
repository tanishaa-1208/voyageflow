/* ----------------------------------------------------
   🚀 GLOBAL VARIABLES
---------------------------------------------------- */
let userData = {};
let total = 0;

/* ----------------------------------------------------
   🚀 PAGE NAVIGATION
---------------------------------------------------- */
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show requested page
    const page = document.getElementById(pageId);
    if (page) page.classList.add('active');

    updateBackButton(pageId);

    // Reinitialize calculator ONLY when calculator page loads
    if (pageId === "calculatorPage") initializeCalculator();
}

/* ----------------------------------------------------
   🚀 BACK BUTTON LOGIC
---------------------------------------------------- */
function updateBackButton(pageId) {
    const backBtn = document.getElementById("globalBackBtn");
    if (!backBtn) return;  // ← FIXED

    const noBackPages = ["welcomePage"];

    if (noBackPages.includes(pageId)) {
        backBtn.style.display = "none";
    } else {
        backBtn.style.display = "block";
    }
}


function goBack() {
    if (document.getElementById("registrationPage").classList.contains("active")) {
        showPage("welcomePage");
    } 
    else if (document.getElementById("destinationsPage").classList.contains("active")) {
        showPage("registrationPage");
    }
    else if (document.getElementById("calculatorPage").classList.contains("active")) {
        showPage("destinationsPage");
    }
    else if (document.getElementById("confirmationPage").classList.contains("active")) {
        showPage("calculatorPage");
    }
}

/* ----------------------------------------------------
   🚀 LOADER UTILS
---------------------------------------------------- */
const loader = document.getElementById('loader');

function showLoader(text = "Loading...") {
    document.getElementById('loaderText').innerText = text;
    loader.classList.remove('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('vf-theme');
    document.body.classList.toggle('light-mode', saved === "light");
    showLoader("Starting VoyageFlow...");
    setTimeout(() => hideLoader(), 450);
});

/* ----------------------------------------------------
   🚀 THEME SWITCHER (FINAL FIXED)
---------------------------------------------------- */
document.getElementById("themeSwitcher").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    const mode = document.body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("vf-theme", mode);
});

/* ----------------------------------------------------
   🚀 REGISTRATION
---------------------------------------------------- */
const regForm = document.getElementById('registrationForm');
if (regForm) {
    regForm.addEventListener('submit', function (e) {
        e.preventDefault();

        userData.name = document.getElementById('name').value.trim();
        userData.email = document.getElementById('email').value.trim();
        userData.phone = document.getElementById('phone').value.trim();
        userData.pin = document.getElementById('pin').value.trim();
        userData.country = document.getElementById('country').value.trim();

        /* --------- TEMP ------------------ */
        userData.travelers = Number(document.getElementById('travelers').value);
        /* --------- TEMP ------------------ */

        showPage("destinationsPage");
    });
}

// Generate extra traveler fields dynamically
document.getElementById("travelers").addEventListener("input", function () {
    const count = Number(this.value);
    const container = document.getElementById("travelersContainer");
    container.innerHTML = ""; // clear old fields

    for (let i = 2; i <= count; i++) {
        const block = document.createElement("div");
        block.className = "p-4 bg-white/10 rounded-xl border border-white/20";

        block.innerHTML = `
            <label class="text-white text-sm font-semibold">Traveler ${i} — Full Name *</label>
            <input id="travelerName_${i}" type="text" required
                   class="w-full px-3 py-2 rounded-lg bg-white/20 text-white outline-none focus:bg-white/30 focus:shadow transition">

            <label class="text-white text-sm font-semibold mt-2 block">Traveler ${i} — Phone *</label>
            <input id="travelerPhone_${i}" type="text" required
                   class="w-full px-3 py-2 rounded-lg bg-white/20 text-white outline-none focus:bg-white/30 focus:shadow transition">
        `;
        container.appendChild(block);
    }
});


/* ----------------------------------------------------
   🚀 DESTINATIONS SEARCH + SELECT
---------------------------------------------------- */
const searchInput = document.getElementById("searchInput");
const destCards = document.querySelectorAll(".destination-card");

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const q = searchInput.value.trim().toLowerCase();
        destCards.forEach(card => {
            const name = card.dataset.name.toLowerCase();
            card.style.display = name.includes(q) ? "block" : "none";
        });
    });
}

let selectedDestination = null;

destCards.forEach(card => {
    card.addEventListener("click", () => {
        destCards.forEach(c => c.classList.remove("ring-2", "ring-orange-400", "bg-white/30", "shadow-2xl", "scale-105"));

        card.classList.add("ring-2", "ring-orange-400", "bg-white/30", "shadow-2xl", "scale-105");
        selectedDestination = card.dataset.name;
    });
});

function goToCalculator() {
    if (!selectedDestination) {
        alert("Please select a destination first.");
        return;
    }
    showPage("calculatorPage");
}

/* ----------------------------------------------------
   🚀 CALCULATOR — FINAL FIXED
---------------------------------------------------- */
function initializeCalculator() {
    total = 0;

    // Fresh checkboxes (remove old listeners)
    const checkboxes = document.querySelectorAll('.calc-option');
    checkboxes.forEach(cb => {
        const cloned = cb.cloneNode(true);
        cb.parentNode.replaceChild(cloned, cb);
    });

    const freshBoxes = document.querySelectorAll('.calc-option');
    freshBoxes.forEach(cb => {
        cb.addEventListener("change", calculateTotal);
    });

    calculateTotal();
}

function calculateTotal() {
    let newTotal = 0;

    const checkboxes = document.querySelectorAll(".calc-option");
    checkboxes.forEach(cb => {
        if (cb.checked) newTotal += Number(cb.dataset.price);
    });

    /* total = newTotal; */
    total = newTotal * (userData.travelers || 1);

    updateTotalUI();
}

function updateTotalUI() {
    const totalEl = document.getElementById("totalPrice");
    if (totalEl) totalEl.innerText = "₹" + numberWithCommas(total);

    const confirmTotalEl = document.getElementById("confirmTotalPrice");
    if (confirmTotalEl) confirmTotalEl.innerText = "₹" + numberWithCommas(total);
}

function numberWithCommas(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* ----------------------------------------------------
   🚀 CONFIRM SELECTION
---------------------------------------------------- */
function confirmSelection() {
    document.getElementById("confirmName").innerText = userData.name;
    document.getElementById("confirmEmail").innerText = userData.email;
    document.getElementById("confirmPhone").innerText = userData.phone;
    document.getElementById("confirmPin").innerText = userData.pin;
    document.getElementById("confirmCountry").innerText = userData.country;
    userData.travelers = Number(document.getElementById('travelers').value);
    // Save additional traveler details
userData.otherTravelers = [];

for (let i = 2; i <= userData.travelers; i++) {
    const tName = document.getElementById(`travelerName_${i}`)?.value || "";
    const tPhone = document.getElementById(`travelerPhone_${i}`)?.value || "";

    userData.otherTravelers.push({ name: tName, phone: tPhone });
}



    const selected = [];
    document.querySelectorAll('.calc-option').forEach(cb => {
        if (cb.checked) selected.push(cb.parentElement.innerText.trim());
    });

    document.getElementById("selectedPackages").innerText =
        selected.length ? selected.join("\n") : "No selections";

    updateTotalUI();

    showPage("confirmationPage");
}

/* ----------------------------------------------------
   🚀 PDF GENERATION
---------------------------------------------------- */
// =======================
// NEW PROFESSIONAL TICKET PDF (FIXED)
// =======================
async function downloadPDF() {
    showLoader("Generating Ticket...");

    await new Promise(r => setTimeout(r, 300));

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    const user = userData;

    // FIXED DESTINATION VARIABLE
    const destination = selectedDestination || "Not Selected";

    const paymentMode = selectedPaymentMethod || "—";

    // Random Booking ID
    const bookingID = Math.floor(10000 + Math.random() * 90000);

    // Convert selected packages into bullet points
    const selectedPackages = document
        .getElementById("selectedPackages")
        .innerText.split("\n")
        .filter(line => line.trim() !== "")
        .map(line => "• " + line.trim());

    // =======================
    // HEADER (ORANGE BAR)
    // =======================
    doc.setFillColor(255, 128, 0);
    doc.rect(0, 0, 210, 22, "F");

    // VoyageFlow Logo (same as homepage)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text("VoyageFlow", 12, 15);

    // Booking ID (Right side)
    doc.setFontSize(12);
    doc.text(`Booking ID: ${bookingID}`, 150, 15);

    // =======================
    // MAIN TITLE
    // =======================
    let y = 35;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("Travel Ticket & Booking Summary", 12, y);

    y += 12;

    // =======================
    // PERSONAL DETAILS
    // =======================
    doc.setLineWidth(0.6);
    doc.line(12, y - 5, 198, y - 5);

    doc.setFontSize(15);
    doc.text("Personal Details", 12, y);
    y += 10;

    doc.setFontSize(12);

    const addField = (label, value) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, 12, y);
        doc.setFont("helvetica", "normal");
        doc.text(value, 42, y);
        y += 7;
    };

    addField("Name:", user.name);
    addField("Email:", user.email);
    addField("Phone:", user.phone);
    addField("PIN:", user.pin);
    addField("Country:", user.country);

    y += 6;

    // =======================
    // TRIP DETAILS
    // =======================
    doc.setLineWidth(0.6);
    doc.line(12, y, 198, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("Trip Details", 12, y);
    y += 10;

    addField("Destination:", destination);

    doc.setFont("helvetica", "bold");
    doc.text("Selected Packages:", 12, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    selectedPackages.forEach(pkg => {
        doc.text(pkg, 18, y);
        y += 6;
    });

    y += 8;

    // =======================
    // PAYMENT DETAILS
    // =======================
    doc.setLineWidth(0.6);
    doc.line(12, y, 198, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("Payment Details", 12, y);
    y += 10;

    addField("Total Amount:", "₹ " + numberWithCommas(total));
    addField("Paid Via:", paymentMode);

    y += 10;

    // =======================
    // Thank You Footer
    // =======================
    doc.setLineWidth(0.4);
    doc.line(12, y, 198, y);
    y += 12;

    doc.setFontSize(14);
    doc.setTextColor(255, 128, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Thank you for choosing VoyageFlow!", 105, y, { align: "center" });

    doc.save(`VoyageFlow_Ticket_${bookingID}.pdf`);

    hideLoader();
}





/* -----------------------------
   PAYMENT LOGIC
------------------------------*/

let selectedPaymentMethod = null;

// click selection logic
document.querySelectorAll(".payment-option").forEach(option => {
    option.addEventListener("click", () => {
        document.querySelectorAll(".payment-option").forEach(o => o.classList.remove("selected"));
        option.classList.add("selected");
        selectedPaymentMethod = option.dataset.method;
    });
});

function goToPayment() {
    document.getElementById("paymentTotal").innerText = "₹" + numberWithCommas(total);
    showPage("paymentPage");
}

function makePayment() {
    if (!selectedPaymentMethod) {
        alert("Please select a payment method.");
        return;
    }

    // show popup
    document.getElementById("bookingPopup").classList.remove("hidden");
}


/* ----------------------------------------------------
   🚀 START OVER
---------------------------------------------------- */
function startOver() {
    location.reload();
}



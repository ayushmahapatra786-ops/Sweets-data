// ===============================
// SWEET SHOP MANAGEMENT SYSTEM
// ===============================

let sweets = JSON.parse(localStorage.getItem("sweets")) || [];
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let bills = JSON.parse(localStorage.getItem("bills")) || [];

let billItems = [];


// ===============================
// PAGE NAVIGATION
// ===============================

function showPage(pageId) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  updateDashboard();
}


// ===============================
// LOCAL STORAGE
// ===============================

function saveData() {

  localStorage.setItem("sweets", JSON.stringify(sweets));
  localStorage.setItem("customers", JSON.stringify(customers));
  localStorage.setItem("bills", JSON.stringify(bills));

}


// ===============================
// SWEETS
// ===============================

function saveSweet() {

  const name = document.getElementById("sweetName").value.trim();
  const category = document.getElementById("sweetCategory").value.trim();
  const price = Number(document.getElementById("sweetPrice").value);
  const stock = Number(document.getElementById("sweetStock").value);

  if (!name || !price) {
    alert("Sweet name aur price enter karo.");
    return;
  }

  const sweet = {
    id: Date.now(),
    name,
    category,
    price,
    stock
  };

  sweets.push(sweet);

  saveData();
  renderSweets();

  document.getElementById("sweetName").value = "";
  document.getElementById("sweetCategory").value = "";
  document.getElementById("sweetPrice").value = "";
  document.getElementById("sweetStock").value = "";

  alert("Sweet saved successfully!");
}


function renderSweets() {

  const list = document.getElementById("sweetList");
  const select = document.getElementById("billSweet");

  list.innerHTML = "";

  select.innerHTML = `
    <option value="">Select Sweet</option>
  `;

  sweets.forEach(sweet => {

    list.innerHTML += `
      <tr>
        <td>${sweet.name}</td>
        <td>${sweet.category || "-"}</td>
        <td>₹${sweet.price}</td>
        <td>${sweet.stock} kg</td>
        <td>
          <button class="delete-btn"
            onclick="deleteSweet(${sweet.id})">
            Delete
          </button>
        </td>
      </tr>
    `;

    select.innerHTML += `
      <option value="${sweet.id}">
        ${sweet.name} - ₹${sweet.price}/kg
      </option>
    `;

  });

  document.getElementById("totalSweets").textContent =
    sweets.length;
}


function deleteSweet(id) {

  if (!confirm("Is sweet ko delete karna hai?")) return;

  sweets = sweets.filter(sweet => sweet.id !== id);

  saveData();
  renderSweets();
}


// ===============================
// CUSTOMERS
// ===============================

function saveCustomer() {

  const name =
    document.getElementById("customerName").value.trim();

  const phone =
    document.getElementById("customerPhone").value.trim();

  const address =
    document.getElementById("customerAddress").value.trim();

  if (!name) {
    alert("Customer name enter karo.");
    return;
  }

  const customer = {
    id: Date.now(),
    name,
    phone,
    address
  };

  customers.push(customer);

  saveData();
  renderCustomers();

  document.getElementById("customerName").value = "";
  document.getElementById("customerPhone").value = "";
  document.getElementById("customerAddress").value = "";

  alert("Customer saved successfully!");
}


function renderCustomers() {

  const list = document.getElementById("customerList");
  const select = document.getElementById("billCustomer");

  list.innerHTML = "";

  select.innerHTML = `
    <option value="">Walk-in Customer</option>
  `;

  customers.forEach(customer => {

    list.innerHTML += `
      <tr>
        <td>${customer.name}</td>
        <td>${customer.phone || "-"}</td>
        <td>${customer.address || "-"}</td>

        <td>
          <button class="delete-btn"
            onclick="deleteCustomer(${customer.id})">
            Delete
          </button>
        </td>
      </tr>
    `;

    select.innerHTML += `
      <option value="${customer.id}">
        ${customer.name} ${customer.phone ? "- " + customer.phone : ""}
      </option>
    `;

  });

  document.getElementById("totalCustomers").textContent =
    customers.length;
}


function deleteCustomer(id) {

  if (!confirm("Customer delete karna hai?")) return;

  customers =
    customers.filter(customer => customer.id !== id);

  saveData();
  renderCustomers();
}


// ===============================
// SWEET PRICE AUTO FILL
// ===============================

document.getElementById("billSweet").addEventListener(
  "change",
  function () {

    const sweetId = Number(this.value);

    const sweet =
      sweets.find(item => item.id === sweetId);

    if (sweet) {

      document.getElementById("billPrice").value =
        sweet.price;

    }

  }
);


// ===============================
// BILL ITEMS
// ===============================

function addBillItem() {

  const sweetId =
    Number(document.getElementById("billSweet").value);

  const qty =
    Number(document.getElementById("billQty").value);

  const price =
    Number(document.getElementById("billPrice").value);

  if (!sweetId || !qty || !price) {

    alert("Sweet, quantity aur price enter karo.");

    return;
  }

  const sweet =
    sweets.find(item => item.id === sweetId);

  if (!sweet) return;

  const item = {

    id: Date.now(),

    sweetId: sweet.id,

    name: sweet.name,

    qty,

    price,

    total: qty * price

  };

  billItems.push(item);

  renderBillItems();

  document.getElementById("billQty").value = "";

}


function renderBillItems() {

  const list =
    document.getElementById("billItems");

  list.innerHTML = "";

  let total = 0;

  billItems.forEach(item => {

    total += item.total;

    list.innerHTML += `
      <tr>

        <td>${item.name}</td>

        <td>${item.qty}</td>

        <td>₹${item.price}</td>

        <td>₹${item.total.toFixed(2)}</td>

        <td>
          <button
            class="delete-btn"
            onclick="removeBillItem(${item.id})">
            X
          </button>
        </td>

      </tr>
    `;

  });

  document.getElementById("billTotal").textContent =
    total.toFixed(2);

  calculateDue();

}


function removeBillItem(id) {

  billItems =
    billItems.filter(item => item.id !== id);

  renderBillItems();

}


// ===============================
// PAYMENT
// ===============================

function calculateDue() {

  const total =
    billItems.reduce(
      (sum, item) => sum + item.total,
      0
    );

  const paid =
    Number(document.getElementById("paidAmount").value) || 0;

  const due =
    Math.max(total - paid, 0);

  document.getElementById("dueAmount").textContent =
    due.toFixed(2);

}


// ===============================
// SAVE BILL
// ===============================

function saveBill() {

  if (billItems.length === 0) {

    alert("Bill me koi item nahi hai.");

    return;
  }

  const customerId =
    Number(document.getElementById("billCustomer").value) || null;

  const total =
    billItems.reduce(
      (sum, item) => sum + item.total,
      0
    );

  const paid =
    Number(document.getElementById("paidAmount").value) || 0;

  const due =
    Math.max(total - paid, 0);

  const bill = {

    id: Date.now(),

    billNumber:
      "BILL-" + Date.now(),

    customerId,

    items: [...billItems],

    total,

    paid,

    due,

    date:
      new Date().toISOString()

  };

  bills.push(bill);

  saveData();

  billItems = [];

  renderBillItems();

  document.getElementById("paidAmount").value = 0;

  alert(
    "Bill saved successfully!\n\n" +
    "Bill No: " +
    bill.billNumber
  );

  updateDashboard();

}


// ===============================
// DASHBOARD
// ===============================

function updateDashboard() {

  const today =
    new Date().toDateString();

  const todayBills =
    bills.filter(
      bill =>
        new Date(bill.date).toDateString() === today
    );

  const todaySale =
    todayBills.reduce(
      (sum, bill) => sum + bill.total,
      0
    );

  const totalSale =
    bills.reduce(
      (sum, bill) => sum + bill.total,
      0
    );

  const totalDue =
    bills.reduce(
      (sum, bill) => sum + bill.due,
      0
    );

  document.getElementById("todaySale").textContent =
    "₹" + todaySale.toFixed(2);

  document.getElementById("totalBills").textContent =
    bills.length;

  document.getElementById("totalCustomers").textContent =
    customers.length;

  document.getElementById("totalSweets").textContent =
    sweets.length;

  document.getElementById("reportSales").textContent =
    "₹" + totalSale.toFixed(2);

  document.getElementById("reportBills").textContent =
    bills.length;

  document.getElementById("reportDue").textContent =
    "₹" + totalDue.toFixed(2);

}


// ===============================
// INITIAL LOAD
// ===============================

renderSweets();
renderCustomers();
updateDashboard();

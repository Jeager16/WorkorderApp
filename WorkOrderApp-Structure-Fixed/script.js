let currentUser = null;
let customers = [];
let workOrders = [];

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'admin' && password === 'admin123') {
    currentUser = 'admin';
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('admin-page').classList.remove('hidden');
    loadCustomers();
  } else if (username === 'tech' && password === 'tech123') {
    currentUser = 'tech';
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('tech-page').classList.remove('hidden');
    loadTechWorkOrders();
  } else {
    alert('Invalid login');
  }
}

function showAddCustomerForm() {
  const name = prompt('Enter Customer Name');
  if (name) {
    customers.push({ name });
    saveData();
    renderCustomers();
  }
}

function renderCustomers() {
  const list = document.getElementById('customerList');
  list.innerHTML = '';
  customers.forEach((c, index) => {
    const div = document.createElement('div');
    div.innerHTML = `${c.name} <button onclick="createWorkOrder(${index})">Create Work Order</button>`;
    list.appendChild(div);
  });
}

function createWorkOrder(customerIndex) {
  const description = prompt('Enter Work Description');
  if (description) {
    const workOrder = {
      id: Date.now(),
      customer: customers[customerIndex].name,
      description,
      status: 'Pending',
      technician: 'tech'
    };
    workOrders.push(workOrder);
    saveData();
    alert('Work Order Created');
  }
}

function loadTechWorkOrders() {
  const techList = document.getElementById('assignedWorkOrders');
  techList.innerHTML = '';
  workOrders.filter(w => w.technician === 'tech').forEach(w => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${w.customer}</h3>
      <p>${w.description}</p>
      <button onclick="completeWorkOrder(${w.id})">Complete</button>
    `;
    techList.appendChild(div);
  });
}

function completeWorkOrder(id) {
  const index = workOrders.findIndex(w => w.id === id);
  if (index !== -1) {
    workOrders[index].status = 'Complete';
    saveData();
    alert('Work Order Completed');
    loadTechWorkOrders();
  }
}

function searchCustomers() {
  const query = document.getElementById('customerSearch').value.toLowerCase();
  const filtered = customers.filter(c => c.name.toLowerCase().includes(query));
  const list = document.getElementById('customerList');
  list.innerHTML = '';
  filtered.forEach((c, index) => {
    const div = document.createElement('div');
    div.innerHTML = `${c.name} <button onclick="createWorkOrder(${index})">Create Work Order</button>`;
    list.appendChild(div);
  });
}

function saveData() {
  localStorage.setItem('customers', JSON.stringify(customers));
  localStorage.setItem('workOrders', JSON.stringify(workOrders));
}

function loadCustomers() {
  const data = localStorage.getItem('customers');
  if (data) {
    customers = JSON.parse(data);
  }
  renderCustomers();
}

function loadTechWorkOrders() {
  const data = localStorage.getItem('workOrders');
  if (data) {
    workOrders = JSON.parse(data);
  }
  const techList = document.getElementById('assignedWorkOrders');
  techList.innerHTML = '';
  workOrders.filter(w => w.technician === 'tech' && w.status !== 'Complete').forEach(w => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${w.customer}</h3>
      <p>${w.description}</p>
      <button onclick="completeWorkOrder(${w.id})">Complete</button>
    `;
    techList.appendChild(div);
  });
}

// Dental Clinic Management App
class DentalClinicApp {
  constructor() {
    this.patients = [];
    this.treatments = [];
    this.appointments = [];
    this.treatmentTypes = [
      { name: "Cleaning", averageFee: 120 },
      { name: "Filling", averageFee: 180 },
      { name: "Crown", averageFee: 850 },
      { name: "Root Canal", averageFee: 1200 },
      { name: "Extraction", averageFee: 250 },
      { name: "Whitening", averageFee: 300 },
      { name: "Implant", averageFee: 2500 },
      { name: "Bridge", averageFee: 1800 },
      { name: "Braces Consultation", averageFee: 200 },
      { name: "Emergency Treatment", averageFee: 350 },
    ];

    this.currentSection = "dashboard";
    this.editingPatient = null;

    this.init();
  }

  init() {
    this.loadData();
    this.setupEventListeners();
    this.updateCurrentDate();
    this.populateSelects();
    this.renderDashboard();
    this.renderPatients();
    this.renderTreatments();
  }

  // Data Management
  loadData() {
    // Load sample data if no data exists
    const savedPatients = localStorage.getItem("dentalPatients");
    const savedTreatments = localStorage.getItem("dentalTreatments");
    const savedAppointments = localStorage.getItem("dentalAppointments");

    if (!savedPatients) {
      this.patients = [
        {
          id: 1,
          name: "John Smith",
          phone: "+1-555-0101",
          email: "john.smith@email.com",
          address: "123 Main St, Anytown, ST 12345",
          age: 35,
          medicalHistory: "No known allergies, regular checkups",
          createdDate: "2025-09-20",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          phone: "+1-555-0102",
          email: "sarah.j@email.com",
          address: "456 Oak Ave, Anytown, ST 12345",
          age: 28,
          medicalHistory: "Mild gum sensitivity",
          createdDate: "2025-09-18",
        },
        {
          id: 3,
          name: "Mike Davis",
          phone: "+1-555-0103",
          email: "mike.davis@email.com",
          address: "789 Pine St, Anytown, ST 12345",
          age: 42,
          medicalHistory: "Previous root canal, diabetes type 2",
          createdDate: "2025-09-15",
        },
      ];
    } else {
      this.patients = JSON.parse(savedPatients);
    }

    if (!savedTreatments) {
      this.treatments = [
        {
          id: 1,
          patientId: 1,
          treatmentType: "Cleaning",
          description: "Regular dental cleaning and checkup",
          fee: 120,
          date: "2025-09-26",
          notes: "Good oral hygiene, no issues found",
          dentistName: "Dr. Anderson",
        },
        {
          id: 2,
          patientId: 2,
          treatmentType: "Filling",
          description: "Composite filling for upper left molar",
          fee: 180,
          date: "2025-09-25",
          notes: "Small cavity filled successfully",
          dentistName: "Dr. Anderson",
        },
        {
          id: 3,
          patientId: 3,
          treatmentType: "Crown",
          description: "Ceramic crown for damaged tooth",
          fee: 850,
          date: "2025-09-24",
          notes: "Crown fitted perfectly, patient comfortable",
          dentistName: "Dr. Anderson",
        },
        {
          id: 4,
          patientId: 1,
          treatmentType: "Whitening",
          description: "Professional teeth whitening treatment",
          fee: 300,
          date: "2025-09-23",
          notes: "Excellent results, patient very satisfied",
          dentistName: "Dr. Anderson",
        },
      ];
    } else {
      this.treatments = JSON.parse(savedTreatments);
    }

    if (!savedAppointments) {
      this.appointments = [];
    } else {
      this.appointments = JSON.parse(savedAppointments);
    }
  }

  saveData() {
    localStorage.setItem("dentalPatients", JSON.stringify(this.patients));
    localStorage.setItem("dentalTreatments", JSON.stringify(this.treatments));
    localStorage.setItem(
      "dentalAppointments",
      JSON.stringify(this.appointments)
    );
  }

  // Event Listeners
  setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav__item").forEach((item) => {
      item.addEventListener("click", (e) =>
        this.switchSection(e.target.dataset.section)
      );
    });

    // Modal controls
    this.setupModalListeners();

    // Form submissions
    this.setupFormListeners();

    // Search and filter
    this.setupSearchAndFilter();

    // Reports
    document
      .getElementById("exportReportBtn")
      .addEventListener("click", () => this.exportReport());
  }

  setupModalListeners() {
    // Patient modal
    document
      .getElementById("addPatientBtn")
      .addEventListener("click", () => this.openPatientModal());
    document
      .getElementById("closePatientModal")
      .addEventListener("click", () => this.closePatientModal());
    document
      .getElementById("cancelPatientModal")
      .addEventListener("click", () => this.closePatientModal());
    document
      .getElementById("patientModalOverlay")
      .addEventListener("click", () => this.closePatientModal());

    // Treatment modal
    document
      .getElementById("addTreatmentBtn")
      .addEventListener("click", () => this.openTreatmentModal());
    document
      .getElementById("closeTreatmentModal")
      .addEventListener("click", () => this.closeTreatmentModal());
    document
      .getElementById("cancelTreatmentModal")
      .addEventListener("click", () => this.closeTreatmentModal());
    document
      .getElementById("treatmentModalOverlay")
      .addEventListener("click", () => this.closeTreatmentModal());

    // Appointment modal
    document
      .getElementById("addAppointmentBtn")
      .addEventListener("click", () => this.openAppointmentModal());
    document
      .getElementById("closeAppointmentModal")
      .addEventListener("click", () => this.closeAppointmentModal());
    document
      .getElementById("cancelAppointmentModal")
      .addEventListener("click", () => this.closeAppointmentModal());
    document
      .getElementById("appointmentModalOverlay")
      .addEventListener("click", () => this.closeAppointmentModal());
  }

  setupFormListeners() {
    document
      .getElementById("savePatient")
      .addEventListener("click", () => this.savePatient());
    document
      .getElementById("saveTreatment")
      .addEventListener("click", () => this.saveTreatment());
    document
      .getElementById("saveAppointment")
      .addEventListener("click", () => this.saveAppointment());

    // Treatment type change updates fee
    document.getElementById("treatmentType").addEventListener("change", (e) => {
      const treatment = this.treatmentTypes.find(
        (t) => t.name === e.target.value
      );
      if (treatment) {
        document.getElementById("treatmentFee").value = treatment.averageFee;
      }
    });
  }

  setupSearchAndFilter() {
    document.getElementById("patientSearch").addEventListener("input", (e) => {
      this.filterPatients(e.target.value);
    });

    document
      .getElementById("treatmentFilter")
      .addEventListener("change", () => {
        this.filterTreatments();
      });

    document.getElementById("dateFilter").addEventListener("change", () => {
      this.filterTreatments();
    });

    document.getElementById("earningsFilter").addEventListener("change", () => {
      this.updateEarningsReport();
    });

    document.getElementById("earningsDate").addEventListener("change", () => {
      this.updateEarningsReport();
    });
  }

  // Navigation
  switchSection(section) {
    // Update nav items
    document.querySelectorAll(".nav__item").forEach((item) => {
      item.classList.toggle(
        "nav__item--active",
        item.dataset.section === section
      );
    });

    // Update sections
    document.querySelectorAll(".section").forEach((sec) => {
      sec.classList.toggle("section--active", sec.id === section);
    });

    this.currentSection = section;

    // Update content based on section
    if (section === "dashboard") {
      this.renderDashboard();
    } else if (section === "earnings") {
      this.updateEarningsReport();
    } else if (section === "appointments") {
      this.renderAppointments();
    }
  }

  // Utility Functions
  updateCurrentDate() {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    document.getElementById("currentDate").textContent = now.toLocaleDateString(
      "en-US",
      options
    );
  }

  generateId(array) {
    return array.length > 0 ? Math.max(...array.map((item) => item.id)) + 1 : 1;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  showToast(message) {
    const toast = document.getElementById("successToast");
    const messageEl = document.getElementById("toastMessage");
    messageEl.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.classList.add("hidden"), 250);
    }, 3000);
  }

  // Dashboard
  renderDashboard() {
    this.updateDashboardStats();
    this.renderRevenueChart();
    this.renderTreatmentChart();
  }

  updateDashboardStats() {
    const today = new Date().toISOString().split("T")[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    const todayTreatments = this.treatments.filter((t) => t.date === today);
    const todayRevenue = todayTreatments.reduce((sum, t) => sum + t.fee, 0);
    const monthTreatments = this.treatments.filter((t) =>
      t.date.startsWith(thisMonth)
    );
    const monthRevenue = monthTreatments.reduce((sum, t) => sum + t.fee, 0);

    document.getElementById("totalPatients").textContent = this.patients.length;
    document.getElementById("todayRevenue").textContent =
      this.formatCurrency(todayRevenue);
    document.getElementById("monthRevenue").textContent =
      this.formatCurrency(monthRevenue);
    document.getElementById("todayTreatments").textContent =
      todayTreatments.length;
  }

  renderRevenueChart() {
    const ctx = document.getElementById("revenueChart").getContext("2d");

    // Destroy existing chart if it exists
    if (window.revenueChartInstance) {
      window.revenueChartInstance.destroy();
    }

    // Get last 7 days
    const dates = [];
    const revenues = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dates.push(
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );

      const dayRevenue = this.treatments
        .filter((t) => t.date === dateStr)
        .reduce((sum, t) => sum + t.fee, 0);
      revenues.push(dayRevenue);
    }

    window.revenueChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Daily Revenue",
            data: revenues,
            borderColor: "#1FB8CD",
            backgroundColor: "rgba(31, 184, 205, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "$" + value;
              },
            },
          },
        },
      },
    });
  }

  renderTreatmentChart() {
    const ctx = document.getElementById("treatmentChart").getContext("2d");

    // Destroy existing chart if it exists
    if (window.treatmentChartInstance) {
      window.treatmentChartInstance.destroy();
    }

    // Count treatments by type
    const treatmentCounts = {};
    this.treatments.forEach((t) => {
      treatmentCounts[t.treatmentType] =
        (treatmentCounts[t.treatmentType] || 0) + 1;
    });

    const labels = Object.keys(treatmentCounts);
    const data = Object.values(treatmentCounts);
    const colors = [
      "#1FB8CD",
      "#FFC185",
      "#B4413C",
      "#ECEBD5",
      "#5D878F",
      "#DB4545",
      "#D2BA4C",
      "#964325",
      "#944454",
      "#13343B",
    ];

    window.treatmentChartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors.slice(0, labels.length),
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }

  // Patients
  renderPatients() {
    const container = document.getElementById("patientsList");

    if (this.patients.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <h3>No patients found</h3>
                    <p>Add your first patient to get started.</p>
                    <button class="btn btn--primary" onclick="app.openPatientModal()">Add Patient</button>
                </div>
            `;
      return;
    }

    container.innerHTML = this.patients
      .map(
        (patient) => `
            <div class="patient-card">
                <div class="patient-card__header">
                    <h4 class="patient-card__name">${patient.name}</h4>
                    <div class="patient-card__actions">
                        <button class="btn btn--sm btn--secondary" onclick="app.editPatient(${
                          patient.id
                        })">Edit</button>
                        <button class="btn btn--sm btn--danger" onclick="app.deletePatient(${
                          patient.id
                        })">Delete</button>
                    </div>
                </div>
                <div class="patient-card__info">
                    <div class="info-item">
                        <strong>Phone</strong>
                        <span>${patient.phone}</span>
                    </div>
                    <div class="info-item">
                        <strong>Email</strong>
                        <span>${patient.email || "N/A"}</span>
                    </div>
                    <div class="info-item">
                        <strong>Age</strong>
                        <span>${patient.age || "N/A"}</span>
                    </div>
                    <div class="info-item">
                        <strong>Treatments</strong>
                        <span>${
                          this.treatments.filter(
                            (t) => t.patientId === patient.id
                          ).length
                        }</span>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  filterPatients(searchTerm) {
    const filtered = this.patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
    );

    const container = document.getElementById("patientsList");
    if (filtered.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <h3>No patients found</h3>
                    <p>Try adjusting your search criteria.</p>
                </div>
            `;
      return;
    }

    container.innerHTML = filtered
      .map(
        (patient) => `
            <div class="patient-card">
                <div class="patient-card__header">
                    <h4 class="patient-card__name">${patient.name}</h4>
                    <div class="patient-card__actions">
                        <button class="btn btn--sm btn--secondary" onclick="app.editPatient(${
                          patient.id
                        })">Edit</button>
                        <button class="btn btn--sm btn--danger" onclick="app.deletePatient(${
                          patient.id
                        })">Delete</button>
                    </div>
                </div>
                <div class="patient-card__info">
                    <div class="info-item">
                        <strong>Phone</strong>
                        <span>${patient.phone}</span>
                    </div>
                    <div class="info-item">
                        <strong>Email</strong>
                        <span>${patient.email || "N/A"}</span>
                    </div>
                    <div class="info-item">
                        <strong>Age</strong>
                        <span>${patient.age || "N/A"}</span>
                    </div>
                    <div class="info-item">
                        <strong>Treatments</strong>
                        <span>${
                          this.treatments.filter(
                            (t) => t.patientId === patient.id
                          ).length
                        }</span>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Patient Modal
  openPatientModal(patient = null) {
    this.editingPatient = patient;
    const modal = document.getElementById("patientModal");
    const title = document.getElementById("patientModalTitle");

    if (patient) {
      title.textContent = "Edit Patient";
      this.fillPatientForm(patient);
    } else {
      title.textContent = "Add New Patient";
      this.clearPatientForm();
    }

    modal.classList.remove("hidden");
  }

  closePatientModal() {
    document.getElementById("patientModal").classList.add("hidden");
    this.editingPatient = null;
    this.clearPatientForm();
  }

  fillPatientForm(patient) {
    document.getElementById("patientName").value = patient.name;
    document.getElementById("patientPhone").value = patient.phone;
    document.getElementById("patientEmail").value = patient.email || "";
    document.getElementById("patientAddress").value = patient.address || "";
    document.getElementById("patientAge").value = patient.age || "";
    document.getElementById("patientMedicalHistory").value =
      patient.medicalHistory || "";
  }

  clearPatientForm() {
    document.getElementById("patientForm").reset();
  }

  savePatient() {
    const name = document.getElementById("patientName").value.trim();
    const phone = document.getElementById("patientPhone").value.trim();
    const email = document.getElementById("patientEmail").value.trim();
    const address = document.getElementById("patientAddress").value.trim();
    const age = parseInt(document.getElementById("patientAge").value) || null;
    const medicalHistory = document
      .getElementById("patientMedicalHistory")
      .value.trim();

    if (!name || !phone) {
      alert("Please fill in required fields (Name and Phone).");
      return;
    }

    const patientData = {
      name,
      phone,
      email,
      address,
      age,
      medicalHistory,
      createdDate: new Date().toISOString().split("T")[0],
    };

    if (this.editingPatient) {
      // Update existing patient
      const index = this.patients.findIndex(
        (p) => p.id === this.editingPatient.id
      );
      this.patients[index] = { ...this.editingPatient, ...patientData };
      this.showToast("Patient updated successfully!");
    } else {
      // Add new patient
      patientData.id = this.generateId(this.patients);
      this.patients.push(patientData);
      this.showToast("Patient added successfully!");
    }

    this.saveData();
    this.closePatientModal();
    this.renderPatients();
    this.populateSelects();
    this.renderDashboard();
  }

  editPatient(id) {
    const patient = this.patients.find((p) => p.id === id);
    if (patient) {
      this.openPatientModal(patient);
    }
  }

  deletePatient(id) {
    if (
      confirm(
        "Are you sure you want to delete this patient? This will also delete all associated treatments."
      )
    ) {
      this.patients = this.patients.filter((p) => p.id !== id);
      this.treatments = this.treatments.filter((t) => t.patientId !== id);
      this.appointments = this.appointments.filter((a) => a.patientId !== id);
      this.saveData();
      this.renderPatients();
      this.renderTreatments();
      this.populateSelects();
      this.renderDashboard();
      this.showToast("Patient deleted successfully!");
    }
  }

  // Treatments
  renderTreatments() {
    const container = document.getElementById("treatmentsList");

    if (this.treatments.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <h3>No treatments found</h3>
                    <p>Log your first treatment to get started.</p>
                    <button class="btn btn--primary" onclick="app.openTreatmentModal()">Log Treatment</button>
                </div>
            `;
      return;
    }

    container.innerHTML = this.treatments
      .map((treatment) => {
        const patient = this.patients.find((p) => p.id === treatment.patientId);
        return `
                <div class="treatment-card">
                    <div class="treatment-card__header">
                        <h4 class="treatment-card__title">${
                          treatment.treatmentType
                        }</h4>
                        <div class="treatment-card__actions">
                            <button class="btn btn--sm btn--danger" onclick="app.deleteTreatment(${
                              treatment.id
                            })">Delete</button>
                        </div>
                    </div>
                    <div class="treatment-card__info">
                        <div class="info-item">
                            <strong>Patient</strong>
                            <span>${patient ? patient.name : "Unknown"}</span>
                        </div>
                        <div class="info-item">
                            <strong>Date</strong>
                            <span>${this.formatDate(treatment.date)}</span>
                        </div>
                        <div class="info-item">
                            <strong>Fee</strong>
                            <span>${this.formatCurrency(treatment.fee)}</span>
                        </div>
                        <div class="info-item">
                            <strong>Description</strong>
                            <span>${treatment.description || "N/A"}</span>
                        </div>
                        ${
                          treatment.notes
                            ? `
                        <div class="info-item" style="grid-column: 1 / -1;">
                            <strong>Notes</strong>
                            <span>${treatment.notes}</span>
                        </div>
                        `
                            : ""
                        }
                    </div>
                </div>
            `;
      })
      .join("");
  }

  filterTreatments() {
    const treatmentFilter = document.getElementById("treatmentFilter").value;
    const dateFilter = document.getElementById("dateFilter").value;

    let filtered = this.treatments;

    if (treatmentFilter) {
      filtered = filtered.filter((t) => t.treatmentType === treatmentFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter((t) => t.date === dateFilter);
    }

    const container = document.getElementById("treatmentsList");
    if (filtered.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <h3>No treatments found</h3>
                    <p>Try adjusting your filter criteria.</p>
                </div>
            `;
      return;
    }

    container.innerHTML = filtered
      .map((treatment) => {
        const patient = this.patients.find((p) => p.id === treatment.patientId);
        return `
                <div class="treatment-card">
                    <div class="treatment-card__header">
                        <h4 class="treatment-card__title">${
                          treatment.treatmentType
                        }</h4>
                        <div class="treatment-card__actions">
                            <button class="btn btn--sm btn--danger" onclick="app.deleteTreatment(${
                              treatment.id
                            })">Delete</button>
                        </div>
                    </div>
                    <div class="treatment-card__info">
                        <div class="info-item">
                            <strong>Patient</strong>
                            <span>${patient ? patient.name : "Unknown"}</span>
                        </div>
                        <div class="info-item">
                            <strong>Date</strong>
                            <span>${this.formatDate(treatment.date)}</span>
                        </div>
                        <div class="info-item">
                            <strong>Fee</strong>
                            <span>${this.formatCurrency(treatment.fee)}</span>
                        </div>
                        <div class="info-item">
                            <strong>Description</strong>
                            <span>${treatment.description || "N/A"}</span>
                        </div>
                        ${
                          treatment.notes
                            ? `
                        <div class="info-item" style="grid-column: 1 / -1;">
                            <strong>Notes</strong>
                            <span>${treatment.notes}</span>
                        </div>
                        `
                            : ""
                        }
                    </div>
                </div>
            `;
      })
      .join("");
  }

  // Treatment Modal
  openTreatmentModal() {
    const modal = document.getElementById("treatmentModal");
    this.clearTreatmentForm();
    // Set default date to today
    document.getElementById("treatmentDate").value = new Date()
      .toISOString()
      .split("T")[0];
    modal.classList.remove("hidden");
  }

  closeTreatmentModal() {
    document.getElementById("treatmentModal").classList.add("hidden");
    this.clearTreatmentForm();
  }

  clearTreatmentForm() {
    document.getElementById("treatmentForm").reset();
  }

  saveTreatment() {
    const patientId = parseInt(
      document.getElementById("treatmentPatient").value
    );
    const treatmentType = document.getElementById("treatmentType").value;
    const description = document
      .getElementById("treatmentDescription")
      .value.trim();
    const fee = parseFloat(document.getElementById("treatmentFee").value);
    const date = document.getElementById("treatmentDate").value;
    const notes = document.getElementById("treatmentNotes").value.trim();

    if (!patientId || !treatmentType || !fee || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    const treatmentData = {
      id: this.generateId(this.treatments),
      patientId,
      treatmentType,
      description,
      fee,
      date,
      notes,
      dentistName: "Dr. Anderson",
    };

    this.treatments.push(treatmentData);
    this.saveData();
    this.closeTreatmentModal();
    this.renderTreatments();
    this.renderDashboard();
    this.showToast("Treatment logged successfully!");
  }

  deleteTreatment(id) {
    if (confirm("Are you sure you want to delete this treatment?")) {
      this.treatments = this.treatments.filter((t) => t.id !== id);
      this.saveData();
      this.renderTreatments();
      this.renderDashboard();
      this.showToast("Treatment deleted successfully!");
    }
  }

  // Populate Select Options - Fixed version
  populateSelects() {
    // Get all select elements that need to be populated
    const selects = {
      treatmentPatient: {
        options: this.patients.map((p) => ({ value: p.id, text: p.name })),
        defaultText: "Select Patient",
      },
      appointmentPatient: {
        options: this.patients.map((p) => ({ value: p.id, text: p.name })),
        defaultText: "Select Patient",
      },
      treatmentType: {
        options: this.treatmentTypes.map((t) => ({
          value: t.name,
          text: t.name,
        })),
        defaultText: "Select Treatment",
      },
      appointmentTreatment: {
        options: this.treatmentTypes.map((t) => ({
          value: t.name,
          text: t.name,
        })),
        defaultText: "Select Treatment",
      },
      treatmentFilter: {
        options: this.treatmentTypes.map((t) => ({
          value: t.name,
          text: t.name,
        })),
        defaultText: "All Treatments",
      },
    };

    // Populate each select element
    Object.entries(selects).forEach(([selectId, config]) => {
      const select = document.getElementById(selectId);
      if (select) {
        // Store current value
        const currentValue = select.value;

        // Build options HTML
        let optionsHTML = `<option value="">${config.defaultText}</option>`;
        config.options.forEach((option) => {
          optionsHTML += `<option value="${option.value}">${option.text}</option>`;
        });

        // Update innerHTML
        select.innerHTML = optionsHTML;

        // Restore value if it was set and still valid
        if (
          currentValue &&
          config.options.some(
            (opt) => opt.value.toString() === currentValue.toString()
          )
        ) {
          select.value = currentValue;
        }
      }
    });
  }

  // Earnings
  updateEarningsReport() {
    const filter = document.getElementById("earningsFilter").value;
    const date =
      document.getElementById("earningsDate").value ||
      new Date().toISOString().split("T")[0];

    let filteredTreatments = [];
    let period = "";

    if (filter === "daily") {
      filteredTreatments = this.treatments.filter((t) => t.date === date);
      period = this.formatDate(date);
    } else if (filter === "weekly") {
      const weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      filteredTreatments = this.treatments.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= weekStart && tDate <= weekEnd;
      });
      period = `Week of ${this.formatDate(
        weekStart.toISOString().split("T")[0]
      )}`;
    } else if (filter === "monthly") {
      const month = date.slice(0, 7);
      filteredTreatments = this.treatments.filter((t) =>
        t.date.startsWith(month)
      );
      const monthName = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      period = monthName;
    }

    const totalRevenue = filteredTreatments.reduce((sum, t) => sum + t.fee, 0);
    const treatmentCount = filteredTreatments.length;
    const avgTreatment = treatmentCount > 0 ? totalRevenue / treatmentCount : 0;

    // Group by treatment type
    const byType = {};
    filteredTreatments.forEach((t) => {
      if (!byType[t.treatmentType]) {
        byType[t.treatmentType] = { count: 0, revenue: 0 };
      }
      byType[t.treatmentType].count++;
      byType[t.treatmentType].revenue += t.fee;
    });

    const summaryHtml = `
            <div class="earnings-card">
                <h4>Period</h4>
                <div class="earnings-amount">${period}</div>
            </div>
            <div class="earnings-card">
                <h4>Total Revenue</h4>
                <div class="earnings-amount">${this.formatCurrency(
                  totalRevenue
                )}</div>
            </div>
            <div class="earnings-card">
                <h4>Treatments</h4>
                <div class="earnings-amount">${treatmentCount}</div>
            </div>
            <div class="earnings-card">
                <h4>Average per Treatment</h4>
                <div class="earnings-amount">${this.formatCurrency(
                  avgTreatment
                )}</div>
            </div>
        `;

    document.getElementById("earningsSummary").innerHTML = summaryHtml;

    // Update chart
    this.renderEarningsChart(byType);
  }

  renderEarningsChart(data) {
    const ctx = document.getElementById("earningsChart").getContext("2d");

    const labels = Object.keys(data);
    const revenues = Object.values(data).map((d) => d.revenue);
    const colors = [
      "#1FB8CD",
      "#FFC185",
      "#B4413C",
      "#ECEBD5",
      "#5D878F",
      "#DB4545",
      "#D2BA4C",
      "#964325",
      "#944454",
      "#13343B",
    ];

    // Clear existing chart
    if (window.earningsChartInstance) {
      window.earningsChartInstance.destroy();
    }

    window.earningsChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Revenue by Treatment Type",
            data: revenues,
            backgroundColor: colors.slice(0, labels.length),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "$" + value;
              },
            },
          },
        },
      },
    });
  }

  // Appointments
  renderAppointments() {
    const container = document.getElementById("appointmentsList");

    if (this.appointments.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <h3>No appointments scheduled</h3>
                    <p>Schedule your first appointment to get started.</p>
                    <button class="btn btn--primary" onclick="app.openAppointmentModal()">Schedule Appointment</button>
                </div>
            `;
      return;
    }

    container.innerHTML = this.appointments
      .map((appointment) => {
        const patient = this.patients.find(
          (p) => p.id === appointment.patientId
        );
        return `
                <div class="appointment-card">
                    <div class="appointment-card__header">
                        <h4 class="appointment-card__title">${
                          patient ? patient.name : "Unknown Patient"
                        }</h4>
                        <div class="appointment-card__actions">
                            <button class="btn btn--sm btn--secondary" onclick="app.markCompleted(${
                              appointment.id
                            })">
                                ${
                                  appointment.status === "completed"
                                    ? "Completed"
                                    : "Mark Complete"
                                }
                            </button>
                            <button class="btn btn--sm btn--danger" onclick="app.deleteAppointment(${
                              appointment.id
                            })">Delete</button>
                        </div>
                    </div>
                    <div class="appointment-card__info">
                        <div class="info-item">
                            <strong>Date</strong>
                            <span>${this.formatDate(appointment.date)}</span>
                        </div>
                        <div class="info-item">
                            <strong>Time</strong>
                            <span>${appointment.time}</span>
                        </div>
                        <div class="info-item">
                            <strong>Treatment</strong>
                            <span>${
                              appointment.treatmentType || "Consultation"
                            }</span>
                        </div>
                        <div class="info-item">
                            <strong>Status</strong>
                            <span class="status status--${
                              appointment.status === "completed"
                                ? "success"
                                : "info"
                            }">${appointment.status || "Scheduled"}</span>
                        </div>
                        ${
                          appointment.notes
                            ? `
                        <div class="info-item" style="grid-column: 1 / -1;">
                            <strong>Notes</strong>
                            <span>${appointment.notes}</span>
                        </div>
                        `
                            : ""
                        }
                    </div>
                </div>
            `;
      })
      .join("");
  }

  // Appointment Modal
  openAppointmentModal() {
    const modal = document.getElementById("appointmentModal");
    this.clearAppointmentForm();
    modal.classList.remove("hidden");
  }

  closeAppointmentModal() {
    document.getElementById("appointmentModal").classList.add("hidden");
    this.clearAppointmentForm();
  }

  clearAppointmentForm() {
    document.getElementById("appointmentForm").reset();
  }

  saveAppointment() {
    const patientId = parseInt(
      document.getElementById("appointmentPatient").value
    );
    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("appointmentTime").value;
    const treatmentType = document.getElementById("appointmentTreatment").value;
    const notes = document.getElementById("appointmentNotes").value.trim();

    if (!patientId || !date || !time) {
      alert("Please fill in all required fields.");
      return;
    }

    const appointmentData = {
      id: this.generateId(this.appointments),
      patientId,
      date,
      time,
      treatmentType,
      notes,
      status: "scheduled",
    };

    this.appointments.push(appointmentData);
    this.saveData();
    this.closeAppointmentModal();
    this.renderAppointments();
    this.showToast("Appointment scheduled successfully!");
  }

  markCompleted(id) {
    const appointment = this.appointments.find((a) => a.id === id);
    if (appointment && appointment.status !== "completed") {
      appointment.status = "completed";
      this.saveData();
      this.renderAppointments();
      this.showToast("Appointment marked as completed!");
    }
  }

  deleteAppointment(id) {
    if (confirm("Are you sure you want to delete this appointment?")) {
      this.appointments = this.appointments.filter((a) => a.id !== id);
      this.saveData();
      this.renderAppointments();
      this.showToast("Appointment deleted successfully!");
    }
  }

  // Export Reports
  exportReport() {
    const reportType = document.getElementById("reportType").value;
    const startDate = document.getElementById("reportStartDate").value;
    const endDate = document.getElementById("reportEndDate").value;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("Dental Care Clinic", 20, 20);
    doc.setFontSize(16);
    doc.text(
      `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      20,
      35
    );

    if (startDate && endDate) {
      doc.setFontSize(12);
      doc.text(
        `Period: ${this.formatDate(startDate)} - ${this.formatDate(endDate)}`,
        20,
        45
      );
    }

    let yPos = 60;
    doc.setFontSize(12);

    if (reportType === "patients") {
      let patients = this.patients;
      if (startDate && endDate) {
        patients = patients.filter(
          (p) => p.createdDate >= startDate && p.createdDate <= endDate
        );
      }

      patients.forEach((patient, index) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.text(`${index + 1}. ${patient.name}`, 20, yPos);
        doc.text(`Phone: ${patient.phone}`, 30, yPos + 10);
        doc.text(`Email: ${patient.email || "N/A"}`, 30, yPos + 20);
        doc.text(`Age: ${patient.age || "N/A"}`, 30, yPos + 30);
        yPos += 45;
      });
    } else if (reportType === "treatments") {
      let treatments = this.treatments;
      if (startDate && endDate) {
        treatments = treatments.filter(
          (t) => t.date >= startDate && t.date <= endDate
        );
      }

      treatments.forEach((treatment, index) => {
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }

        const patient = this.patients.find((p) => p.id === treatment.patientId);
        doc.text(
          `${index + 1}. ${treatment.treatmentType} - ${this.formatCurrency(
            treatment.fee
          )}`,
          20,
          yPos
        );
        doc.text(
          `Patient: ${patient ? patient.name : "Unknown"}`,
          30,
          yPos + 10
        );
        doc.text(`Date: ${this.formatDate(treatment.date)}`, 30, yPos + 20);
        doc.text(
          `Description: ${treatment.description || "N/A"}`,
          30,
          yPos + 30
        );
        yPos += 45;
      });
    } else if (reportType === "earnings") {
      let treatments = this.treatments;
      if (startDate && endDate) {
        treatments = treatments.filter(
          (t) => t.date >= startDate && t.date <= endDate
        );
      }

      const totalRevenue = treatments.reduce((sum, t) => sum + t.fee, 0);
      const treatmentCount = treatments.length;

      doc.text(`Total Treatments: ${treatmentCount}`, 20, yPos);
      doc.text(
        `Total Revenue: ${this.formatCurrency(totalRevenue)}`,
        20,
        yPos + 15
      );
      doc.text(
        `Average per Treatment: ${this.formatCurrency(
          treatmentCount > 0 ? totalRevenue / treatmentCount : 0
        )}`,
        20,
        yPos + 30
      );

      yPos += 50;

      // Group by treatment type
      const byType = {};
      treatments.forEach((t) => {
        if (!byType[t.treatmentType]) {
          byType[t.treatmentType] = { count: 0, revenue: 0 };
        }
        byType[t.treatmentType].count++;
        byType[t.treatmentType].revenue += t.fee;
      });

      doc.text("Revenue by Treatment Type:", 20, yPos);
      yPos += 20;

      Object.entries(byType).forEach(([type, data]) => {
        doc.text(
          `${type}: ${data.count} treatments, ${this.formatCurrency(
            data.revenue
          )}`,
          30,
          yPos
        );
        yPos += 15;
      });
    }

    const fileName = `dental_clinic_${reportType}_report.pdf`;
    doc.save(fileName);
    this.showToast("Report exported successfully!");
  }
}

// Initialize the app
const app = new DentalClinicApp();

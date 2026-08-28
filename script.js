const HIGH_USAGE_LIMIT = 100;

let records = [
  { date: "2026-08-25", location: "Academic Block", usage: 86 },
  { date: "2026-08-25", location: "Library", usage: 54 },
  { date: "2026-08-25", location: "Hostel", usage: 118 },
  { date: "2026-08-26", location: "Academic Block", usage: 92 },
  { date: "2026-08-26", location: "Library", usage: 61 },
  { date: "2026-08-26", location: "Hostel", usage: 105 },
  { date: "2026-08-27", location: "Academic Block", usage: 79 },
  { date: "2026-08-27", location: "Library", usage: 48 },
  { date: "2026-08-27", location: "Hostel", usage: 124 }
];

let chart;

function render() {
  const total = records.reduce((sum, r) => sum + r.usage, 0);
  const highest = Math.max(...records.map(r => r.usage));
  const highCount = records.filter(r => r.usage > HIGH_USAGE_LIMIT).length;

  document.getElementById("totalUsage").textContent = total.toFixed(1) + " kWh";
  document.getElementById("highestUsage").textContent = highest.toFixed(1) + " kWh";
  document.getElementById("highCount").textContent = highCount;

  const table = document.getElementById("usageTable");
  table.innerHTML = "";

  records.forEach(r => {
    const high = r.usage > HIGH_USAGE_LIMIT;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.date}</td>
      <td>${r.location}</td>
      <td>${r.usage.toFixed(1)}</td>
      <td class="${high ? "high" : "normal"}">${high ? "High Usage" : "Normal"}</td>
    `;
    table.appendChild(row);
  });

  const locations = ["Academic Block", "Library", "Hostel"];
  const totals = locations.map(loc =>
    records.filter(r => r.location === loc)
      .reduce((sum, r) => sum + r.usage, 0)
  );

  const ctx = document.getElementById("usageChart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: locations,
      datasets: [{
        label: "Total Usage (kWh)",
        data: totals
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

document.getElementById("usageForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const date = document.getElementById("date").value;
  const location = document.getElementById("location").value;
  const usage = Number(document.getElementById("usage").value);

  records.push({ date, location, usage });
  this.reset();
  render();
});

render();

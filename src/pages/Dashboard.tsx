import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      <p>Αυτή είναι η κεντρική σελίδα αφού ο χρήστης συνδεθεί.</p>

      {/* 📌 Εδώ θα μπει αργότερα το περιεχόμενο (projects, tasks, users, κλπ.) */}
      <div
        style={{
          marginTop: "2rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          minHeight: "150px",
        }}
      >
        <h4>Περιεχόμενο</h4>
        <p>(Θα φορτώνει δεδομένα από το backend)</p>
      </div>
    </div>
  );
};

export default Dashboard;

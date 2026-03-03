import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function UserList({ users, onSelectUser }) {
  const downloadPDF = () => {
    const doc = new jsPDF();

    const tableColumn = ["Name", "Email"];

    const tableRows = users.map((user) => [user.name, user.email]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("RegisteredUsers.pdf");
  };

  return (
    <div className="container-fluid my-5">
      <div className="card shadow border-0 rounded-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-primary mb-0">Registered Users</h5>
            <div className="d-flex gap-2">
              <button
                className="btn btn-danger btn-sm"
                onClick={downloadPDF}
                disabled={users.length === 0}
              >
                Download PDF
              </button>

              <span className="badge bg-primary align-self-center">
                Total: {users.length}
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th style={{ minWidth: "120px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-muted py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.email}>
                      <td className="fw-semibold">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button
                          className="btn btn-outline-info btn-sm px-3"
                          onClick={() => onSelectUser(user)}
                        >
                          View Intakes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserList;

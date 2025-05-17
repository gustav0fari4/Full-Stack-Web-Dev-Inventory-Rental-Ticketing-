import NavbarAssignment1 from "/components/navbar-assignment1";
import { useEffect, useState } from "react";

export default function InventoryList() {
  const [inventory, setInventory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [eircodeFilter, setEircodeFilter] = useState("");

  useEffect(() => {
    fetch("/api/assignment1/register")
      .then(res => res.json())
      .then(data => {
        setInventory(data);
        setFiltered(data);
      })
      .catch(err => console.error("Error fetching inventory:", err));
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value.toUpperCase();
    setEircodeFilter(value);
    const filteredItems = inventory.filter(item =>
      item.eircode.toUpperCase().includes(value)
    );
    setFiltered(filteredItems);
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch("/api/assignment1/inventory/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
  
      if (res.ok) {
        const updated = inventory.filter(item => item.id !== id);
        setInventory(updated);
        setFiltered(updated.filter(item => item.eircode.toUpperCase().includes(eircodeFilter.toUpperCase())));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  

  return (
    <div>
      <NavbarAssignment1/>
      <div style={{ padding: "2rem" }}>
        <h2>All Registered Appliances</h2>

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Filter by Eircode"
            value={eircodeFilter}
            onChange={handleFilterChange}
            style={{ padding: "8px", width: "300px" }}
          />
        </div>

        {filtered.length === 0 ? (
          <p>No appliances match the filter.</p>
        ) : (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {filtered.map((item) => (
              <li key={item.id} style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem"
              }}>
                <strong>{item.applianceType}</strong> ({item.brand})<br />
                Model: {item.modelNumber}, Serial: {item.serialNumber}<br />
                Eircode: {item.eircode}<br />
                Purchase: {item.purchaseDate} | Warranty: {item.warrantyDate}
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "4px 10px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "10px"
                  }}
                >
                  Delete
                </button>
              </li>  
            ))}
          </ul>
        )}
      </div>
    </div>

    
  );
}


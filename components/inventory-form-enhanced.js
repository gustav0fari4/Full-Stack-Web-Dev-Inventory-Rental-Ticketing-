import { useState } from "react";
import styles from "../styles/inventory-form.module.css";

export default function InventoryFormEnhanced() {
  const [formData, setFormData] = useState({
    eircode: "",
    applianceType: "",
    brand: "",
    modelNumber: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyDate: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      const response = await fetch("/api/assignment1/enhanced/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `✔️ Appliance registered: ${data.appliance.applianceType} (${data.appliance.brand}) at ${data.appliance.eircode}`
        );
        setFormData({
          eircode: "",
          applianceType: "",
          brand: "",
          modelNumber: "",
          serialNumber: "",
          purchaseDate: "",
          warrantyDate: "",
        });

        setTimeout(() => setMessage(""), 5000);
      } else {
        setErrors(data.errors || {});
      }
    } catch (error) {
      setErrors({ api: "An error occurred. Please try again later." });
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Enhanced House Appliance Inventory</h2>

      {message && (
        <p className={`${styles.alert} ${styles.alertSuccess}`}>{message}</p>
      )}

      {errors.api && (
        <p className={`${styles.alert} ${styles.alertError}`}>{errors.api}</p>
      )}

      <form onSubmit={handleSubmit}>
        {[
          { label: "Eircode", name: "eircode", type: "text", pattern: "^[A-Za-z0-9]{3} ?[A-Za-z0-9]{4}$" },
          { label: "Brand", name: "brand", type: "text" },
          { label: "Model Number", name: "modelNumber", type: "text", pattern: "^[A-Za-z0-9\\-]+$" },
          { label: "Serial Number", name: "serialNumber", type: "text", pattern: "^[A-Za-z0-9\\-]+$" },
          { label: "Purchase Date", name: "purchaseDate", type: "date" },
          { label: "Warranty Expiration Date", name: "warrantyDate", type: "date" },
        ].map((field) => (
          <div className="mb-3" key={field.name}>
            <label className={styles.formLabel}>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              className={`${styles.selectField} ${errors[field.name] ? styles.inputError : ""}`}
              pattern={field.pattern}
              required
              value={formData[field.name]}
              onChange={handleChange}
            />
            {errors[field.name] && (
              <small className="text-danger">{errors[field.name]}</small>
            )}
          </div>
        ))}

        <div className="mb-3">
          <label className={styles.formLabel}>Appliance Type</label>
          <select
            name="applianceType"
            className={styles.selectField}
            required
            value={formData.applianceType}
            onChange={handleChange}
          >
            <option value="">Select an Appliance</option>
            <option value="Refrigerator">Refrigerator</option>
            <option value="Washing Machine">Washing Machine</option>
            <option value="Microwave">Microwave</option>
            <option value="Dishwasher">Dishwasher</option>
          </select>
          {errors.applianceType && (
            <small className="text-danger">{errors.applianceType}</small>
          )}
        </div>

        <button type="submit" className={styles.submitButton}>
          Add to Inventory
        </button>
      </form>
    </div>
  );
}

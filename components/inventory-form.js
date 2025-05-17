import { useState } from "react";
import styles from "../styles/inventory-form.module.css"; 

export default function InventoryForm() {
  // State to manage form data for appliance registration
  const [formData, setFormData] = useState({
    eircode: "",  // Eircode of the appliance's location
    applianceType: "",  // Type of appliance (e.g., Refrigerator, Washing Machine)
    brand: "",  // Brand of the appliance
    modelNumber: "",  // Model number of the appliance
    serialNumber: "",  // Serial number of the appliance
    purchaseDate: "",  // Date when the appliance was purchased
    warrantyDate: "",  // Warranty expiration date
  });

  // State for success or error message after form submission
  const [message, setMessage] = useState("");

  // State to store form validation errors
  const [errors, setErrors] = useState({});

  // Handle input change and update corresponding form data field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (asynchronous operation)
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior
    setErrors({});  // Reset errors on each submission
    setMessage("");  // Reset the success message

    try {
      // Send POST request with form data to the server API endpoint
      const response = await fetch("/api/assignment1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),  // Send the form data as JSON
      });

      // Parse the response from the server
      const data = await response.json();

      if (response.ok) {
        // Success message on successful submission
        if (response.ok) {
          setMessage(`✔️ Appliance registered: ${data.appliance.applianceType} (${data.appliance.brand}) at ${data.appliance.eircode}`);
          // Auto-clear message after 5 seconds
          setTimeout(() => setMessage(""), 5000);
        }
        
        // Reset the form after successful submission
        setFormData({
          eircode: "",
          applianceType: "",
          brand: "",
          modelNumber: "",
          serialNumber: "",
          purchaseDate: "",
          warrantyDate: "",
        });
      } else {
        // Set form errors based on the response from the server
        setErrors(data.errors);
      }
    } catch (error) {
      // Handle any unexpected errors and display a generic error message
      setErrors({ api: "An error occurred. Please try again later." });
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>House Appliance Inventory</h2>
      
      {/* Display success message if appliance is registered successfully */}
      {message && <p className={`${styles.alert} ${styles.alertSuccess}`}>{message}</p>}
      
      {/* Display error message if an error occurs during form submission */}
      {errors.api && <p className={`${styles.alert} ${styles.alertError}`}>{errors.api}</p>}
      
      {/* Start of the form */}
      <form onSubmit={handleSubmit}>
        
        {/* Eircode input field */}
        <div className="mb-3">
          <label className={styles.formLabel}>Eircode</label>
          <input
            type="text"
            name="eircode"
            className={styles.inputField}
            pattern="^[A-Za-z0-9]{3} ?[A-Za-z0-9]{4}$"  // Eircode validation pattern
            title="Enter a valid Dublin Eircode (e.g., D02X285)"
            required
            value={formData.eircode}
            onChange={handleChange}
          />
          {errors.eircode && <small className="text-danger">{errors.eircode}</small>}
        </div>

        {/* Appliance type dropdown */}
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
          {errors.applianceType && <small className="text-danger">{errors.applianceType}</small>}
        </div>

        {/* Brand input field */}
        <div className="mb-3">
          <label className={styles.formLabel}>Brand</label>
          <input
            type="text"
            name="brand"
            className={styles.selectField}
            required
            maxLength="50"
            value={formData.brand}
            onChange={handleChange}
          />
          {errors.brand && <small className="text-danger">{errors.brand}</small>}
        </div>

        {/* Model number input field */}
        <div className="mb-3">
          <label className={styles.formLabel}>Model Number</label>
          <input
            type="text"
            name="modelNumber"
            className={styles.selectField}
            pattern="^[A-Za-z0-9\-]+$"  // Model number validation pattern
            required
            value={formData.modelNumber}
            onChange={handleChange}
          />
          {errors.modelNumber && <small className="text-danger">{errors.modelNumber}</small>}
        </div>

        {/* Serial number input field */}
        <div className="mb-3">
          <label className={styles.formLabel}>Serial Number</label>
          <input
            type="text"
            name="serialNumber"
            className={styles.selectField}
            pattern="^[A-Za-z0-9\-]+$"  // Serial number validation pattern
            required
            value={formData.serialNumber}
            onChange={handleChange}
          />
          {errors.serialNumber && <small className="text-danger">{errors.serialNumber}</small>}
        </div>

        {/* Purchase date input field */}
        <div className="mb-3">
          <label className={styles.formLabel}>Purchase Date</label>
          <input
            type="date"
            name="purchaseDate"
            className={styles.selectField}
            required
            value={formData.purchaseDate}
            onChange={handleChange}
          />
          {errors.purchaseDate && <small className="text-danger">{errors.purchaseDate}</small>}
        </div>

        {/* Warranty expiration date input field */}
        <div className="mb-3">
          <label className={styles.formLabel}>Warranty Expiration Date</label>
          <input
            type="date"
            name="warrantyDate"
            className={styles.selectField}
            required
            value={formData.warrantyDate}
            onChange={handleChange}
          />
          {errors.warrantyDate && <small className="text-danger">{errors.warrantyDate}</small>}
        </div>

        {/* Submit button to add appliance to the inventory */}
        <button type="submit" className={styles.submitButton}>
          Add to Inventory
        </button>
      </form>
    </div>
  );
}

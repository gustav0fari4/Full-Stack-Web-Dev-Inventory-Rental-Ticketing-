import { useState } from "react";
import styles from "../styles/booking-form.module.css"; 

export default function BookingForm() {
  // State variables to store form inputs and confirmation message
  const [movie, setMovie] = useState(""); // Selected movie
  const [showtime, setShowtime] = useState(""); // Selected showtime
  const [phone, setPhone] = useState(""); // Phone number input
  const [confirmation, setConfirmation] = useState(""); // Confirmation message

  // State for storing form validation errors
  const [errors, setErrors] = useState({});

  // Movies and their available showtimes
  const movies = {
    "Top Gun Maverick": ["12:00 PM", "3:00 PM", "6:00 PM"],
    "Avengers: Endgame": ["1:00 PM", "4:00 PM", "8:00 PM"],
    "The Batman": ["2:00 PM", "5:00 PM", "9:00 PM"],
  };

  // Function to validate the form inputs
  function validateForm() {
    let newErrors = {};

    // Check if a movie is selected
    if (!movie) newErrors.movie = "Please select a movie";
    
    // Check if a showtime is selected
    if (!showtime) newErrors.showtime = "Please select a showtime";
    
    // Check if the phone number is valid (10 digits)
    if (!phone || !/^\d{10}$/.test(phone))
      newErrors.phone = "Please enter a valid 10-digit phone number";

    setErrors(newErrors); // Update errors state
    return Object.keys(newErrors).length === 0; // Return true if no errors
  }

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault(); // Prevent page reload on form submission

    if (!validateForm()) return; // Stop submission if validation fails

    try {
      // Send the booking data to the server via a POST request
      const response = await fetch("/api/assignment1/book-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie, showtime, phone }),
      });

      const data = await response.json();

      // If the booking is successful, display confirmation message
      if (response.ok) {
        setConfirmation(data.message);
        setMovie(""); // Clear movie selection
        setShowtime(""); // Clear showtime selection
        setPhone(""); // Clear phone number
        setErrors({}); // Clear any validation errors
      } else {
        // If there's an error, set API error message
        setErrors({ api: data.error || "Booking failed. Try again." });
      }
    } catch (error) {
      // If there's a network error, show a generic error message
      setErrors({ api: "An error occurred. Please try again later." });
    }
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Book a Cinema Ticket</h2>

      {/* Display confirmation message if booking was successful */}
      {confirmation && <p className={styles.successMessage}>{confirmation}</p>}

      {/* The booking form */}
      <form onSubmit={handleSubmit}>
        {/* Movie selection */}
        <label className={styles.formLabel}>Movie:</label>
        <select
          className={styles.selectField}
          value={movie}
          onChange={(e) => setMovie(e.target.value)} // Update movie selection
        >
          <option value="">Select a movie</option>
          {/* Render movie options */}
          {Object.keys(movies).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        {/* Show error message if movie is not selected */}
        {errors.movie && <p className={styles.errorMessage}>{errors.movie}</p>}

        {/* Showtime selection */}
        <label className={styles.formLabel}>Showtime:</label>
        <select
          className={styles.selectField}
          value={showtime}
          onChange={(e) => setShowtime(e.target.value)} // Update showtime selection
        >
          <option value="">Select a showtime</option>
          {/* Render available showtimes based on selected movie */}
          {movie &&
            movies[movie].map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
        </select>
        {/* Show error message if showtime is not selected */}
        {errors.showtime && <p className={styles.errorMessage}>{errors.showtime}</p>}

        {/* Phone number input */}
        <label className={styles.formLabel}>Mobile Number:</label>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Enter your mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)} // Update phone number
        />
        {/* Show error message if phone number is invalid */}
        {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}

        {/* Submit button, disabled if form is incomplete */}
        <button
          className={styles.submitButton}
          type="submit"
          disabled={!movie || !showtime || !phone}
        >
          Book Tickets
        </button>
      </form>

      {/* Display API error message if booking failed */}
      {errors.api && <p className={styles.errorMessage}>{errors.api}</p>}
    </div>
  );
}

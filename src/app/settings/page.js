"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ChangeProfile() {
  const [userInfo, setUserInfo] = useState({
    currentEmail: "",
    currentPassword: "",
    newEmail: "",
    newPassword: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [changeEmail, setChangeEmail] = useState(false); // Track if user wants to change email or password
  const router = useRouter();

  // Fetch user profile info from API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/api/user/profile");
        if (response.data.success) {
          setUserInfo((prevState) => ({
            ...prevState,
            currentEmail: response.data.email,
            phoneNumber: response.data.phoneNumber, // Added phone number
          }));
        }
      } catch (error) {
        setErrorMessage("Något gick fel vid hämtning av profilinformation.");
      }
    };
    fetchUserInfo();
  }, []);

  // Handle form submission (either email, password, or phone number change)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (changeEmail && !userInfo.newEmail) {
      setErrorMessage("Ny email måste anges.");
      return;
    }

    if (!changeEmail && (!userInfo.newPassword || userInfo.newPassword !== userInfo.confirmPassword)) {
      setErrorMessage("Lösenord och bekräftat lösenord matchar inte.");
      return;
    }

    if (!changeEmail && !userInfo.phoneNumber) {
      setErrorMessage("Telefonnummer måste anges.");
      return;
    }

    try {
      const data = changeEmail
        ? { currentPassword: userInfo.currentPassword, newEmail: userInfo.newEmail }
        : userInfo.phoneNumber // Updating phone number
        ? { currentPassword: userInfo.currentPassword, phoneNumber: userInfo.phoneNumber }
        : { currentPassword: userInfo.currentPassword, newPassword: userInfo.newPassword };

      const response = await axios.put("/api/user/change-profile", data);

      if (response.data.success) {
        setSuccessMessage("Profiluppgifter uppdaterades framgångsrikt.");
        setUserInfo({
          currentEmail: response.data.email || userInfo.currentEmail,
          phoneNumber: response.data.phoneNumber || userInfo.phoneNumber,
          currentPassword: "",
          newEmail: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setErrorMessage(response.data.errorMessage || "Något gick fel.");
      }
    } catch (error) {
      setErrorMessage("Fel vid uppdatering av profil.");
    }
  };

  return (
    <div className="change-profile">
      <div className="profile-info">
        <h3>Profilinformation</h3>
        <p><strong>Email:</strong> {userInfo.currentEmail}</p>
        <p><strong>Lösenord:</strong> ********** (du kan ändra det nedan)</p>
        <p><strong>Telefonnummer:</strong> {userInfo.phoneNumber || "Ej angivet"}</p> {/* Show phone number */}
      </div>

      <div className="form-container">
        <h2>Ändra Profil</h2>

        {/* Option to choose between changing email or password */}
        <div>
          <button type="button" onClick={() => setChangeEmail(true)}>Ändra Email</button>
          <button type="button" onClick={() => setChangeEmail(false)}>Ändra Lösenord</button>
        </div>

        <form onSubmit={handleSubmit}>
          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}

          {/* If changing password */}
          {!changeEmail && (
            <>
              <div>
                <label>Nuvarande lösenord</label>
                <input
                  type="password"
                  value={userInfo.currentPassword}
                  onChange={(e) => setUserInfo({ ...userInfo, currentPassword: e.target.value })}
                  required
                />
              </div>

              <div>
                <label>Ny Lösenord</label>
                <input
                  type="password"
                  value={userInfo.newPassword}
                  onChange={(e) => setUserInfo({ ...userInfo, newPassword: e.target.value })}
                  required
                />
              </div>

              <div>
                <label>Bekräfta Lösenord</label>
                <input
                  type="password"
                  value={userInfo.confirmPassword}
                  onChange={(e) => setUserInfo({ ...userInfo, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {/* If changing email */}
          {changeEmail && (
            <div>
              <label>Ny Email</label>
              <input
                type="email"
                value={userInfo.newEmail}
                onChange={(e) => setUserInfo({ ...userInfo, newEmail: e.target.value })}
                required
              />
            </div>
          )}

          {/* If changing phone number */}
          <div>
            <label>Telefonnummer</label>
            <input
              type="text"
              value={userInfo.phoneNumber}
              onChange={(e) => setUserInfo({ ...userInfo, phoneNumber: e.target.value })}
            />
          </div>

          <button type="submit">{changeEmail ? "Ändra Email" : "Ändra Lösenord"}</button>
        </form>
      </div>
    </div>
  );
}

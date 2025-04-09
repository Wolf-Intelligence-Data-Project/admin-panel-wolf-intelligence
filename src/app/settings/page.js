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
  const [changeEmail, setChangeEmail] = useState(false);
  const [mod, setMod] = useState({
    email: "",
    phoneNumber: ""
  });
  const router = useRouter();

  useEffect(() => {
    const fetchModInfo = async () => {
      try {
        const response = await axios.get("/api/admin/get-profile");

        const { email, phoneNumber } = response.data.Moderator;
        setMod(response.data.Moderator);
        setUserInfo((prev) => ({
          ...prev,
          currentEmail: email,
          phoneNumber: phoneNumber || "",
        }));
      } catch (error) {
        setErrorMessage("Något gick fel vid hämtning av profilinformation.");
      }
    };

    fetchModInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (changeEmail && !userInfo.newEmail) {
      setErrorMessage("Ny email måste anges.");
      return;
    }

    if (!changeEmail) {
      if (!userInfo.newPassword || userInfo.newPassword !== userInfo.confirmPassword) {
        setErrorMessage("Lösenord och bekräftat lösenord matchar inte.");
        return;
      }
      if (!userInfo.phoneNumber) {
        setErrorMessage("Telefonnummer måste anges.");
        return;
      }
    }

    try {
      const payload = changeEmail
        ? {
            currentPassword: userInfo.currentPassword,
            newEmail: userInfo.newEmail,
          }
        : {
            currentPassword: userInfo.currentPassword,
            newPassword: userInfo.newPassword,
            phoneNumber: userInfo.phoneNumber,
          };

      const response = await axios.put("/api/user/change-profile", payload);

      if (response.data.success) {
        setSuccessMessage("Profiluppgifter uppdaterades framgångsrikt.");
        setUserInfo((prev) => ({
          ...prev,
          currentEmail: response.data.email || prev.currentEmail,
          phoneNumber: response.data.phoneNumber || prev.phoneNumber,
          currentPassword: "",
          newEmail: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        setErrorMessage(response.data.errorMessage || "Något gick fel.");
      }
    } catch (error) {
      setErrorMessage("Fel vid uppdatering av profil.");
    }
  };

  return (
    <div className="change-profile">
   

      <div className="form-container">
      <div className="profile-info">
        <div>
        <h3>Profilinformation</h3>
        <p><strong>Email:</strong> {userInfo.currentEmail || "Ej angiven"}</p>
        <p><strong>Telefonnummer:</strong> {userInfo.phoneNumber || "Ej angivet"}</p>
        </div>
        <div> <h2>Ändra Profil</h2>
  {/* Shared current password */}
  <div>
    <label>Nuvarande lösenord *</label>
    <input
      type="password"
      value={userInfo.currentPassword}
      onChange={(e) => setUserInfo({ ...userInfo, currentPassword: e.target.value })}
      required
    />
      </div>
   
  </div></div>  
        <form className='change-form'onSubmit={(e) => handleSubmit(e, 'all')}>
  {errorMessage && <p className="error">{errorMessage}</p>}
  {successMessage && <p className="success">{successMessage}</p>}


  {/* Change Email Section */}
  <div>
    <h3>Byt Email</h3>
    <label>Ny Email</label>
    <input
      type="email"
      value={userInfo.newEmail}
      onChange={(e) => setUserInfo({ ...userInfo, newEmail: e.target.value })}
    />
    <button className='button-positive' type="button" onClick={(e) => handleSubmit(e, 'email')}>
      Uppdatera Email
    </button>
  </div>

  {/* Change Password Section */}
  <div>
    <h3>Byt Lösenord</h3>
    <label>Ny Lösenord</label>
    <input
      type="password"
      value={userInfo.newPassword}
      onChange={(e) => setUserInfo({ ...userInfo, newPassword: e.target.value })}
    />
    <label>Bekräfta Lösenord</label>
    <input
      type="password"
      value={userInfo.confirmPassword}
      onChange={(e) => setUserInfo({ ...userInfo, confirmPassword: e.target.value })}
    />
    <button className='button-positive' type="button" onClick={(e) => handleSubmit(e, 'password')}>
      Uppdatera Lösenord
    </button>
  </div>

  {/* Change Phone Number Section */}
  <div>
    <h3>Byt Telefonnummer</h3>
    <label>Nytt Telefonnummer</label>
    <input
      type="text"
      value={userInfo.phoneNumber}
      onChange={(e) => setUserInfo({ ...userInfo, phoneNumber: e.target.value })}
    />
    <button className='button-positive' type="button" onClick={(e) => handleSubmit(e, 'phone')}>
      Uppdatera Telefonnummer
    </button>
  </div>
</form>

      </div>
    </div>
  );
}

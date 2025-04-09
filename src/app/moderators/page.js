"use client"
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function ModeratorsManagementPage() {
    const [moderators, setModerators] = useState([]);
    const [newModerator, setNewModerator] = useState({
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
        role: "Moderator",
        identificationNumber: "",
        fullName: "",
        phoneNumber: ""
    });

    const [showModal, setShowModal] = useState(false);
    const [moderatorToDelete, setModeratorToDelete] = useState(null);
    const modalRef = useRef(null);
    const [visibleEmails, setVisibleEmails] = useState({});
    const [visibleIds, setVisibleIds] = useState({});
    const [visiblePhones, setVisiblePhones] = useState({});

    const toggleEmailVisibility = (id) => {
        setVisibleEmails((prevState) => ({
          ...prevState,
          [id]: !prevState[id],
        }));
    };
    const togglePhoneVisibility = (id) => {
        setVisiblePhones((prevState) => ({
          ...prevState,
          [id]: !prevState[id],
        }));
    };
    const toggleIdVisibility = (id) => {
        setVisibleIds((prevState) => ({
          ...prevState,
          [id]: !prevState[id],
        }));
    };

    useEffect(() => {
        fetchModerators();
    }, []);

    const fetchModerators = async () => {
        try {
            const response = await axios.get("/api/admin/get-all", {
                withCredentials: true
            });
            setModerators(Array.isArray(response.data.Moderators) ? response.data.Moderators : []);
        } catch (error) {
            console.error("Error fetching moderators", error);
        }
    };
    const addModerator = async () => {
        // Check if email and password match without confirmation
        if (newModerator.password !== newModerator.confirmPassword) {
            alert("Password and Confirm Password do not match!");
            return;
        }
    
        try {
            const { email, password, role, identificationNumber, fullName, phoneNumber } = newModerator;
        
            const response = await axios.post("/api/admin/add-mod", {
                email, password, role, identificationNumber, fullName, phoneNumber
            }, {
                withCredentials: true
            });
        
            fetchModerators(); 
            
            const createdModerator = response.data?.newModerator;
            setModerators(prev => [...prev, createdModerator]);

            clearForm();   
        } catch (error) {
            console.error("Error adding moderator", error);
            clearForm();         
        }
    };
    
    
    const deleteModerator = async (moderatorToDelete) => {
        try {
            // Log the type of moderatorToDelete to ensure it's just the ID (string or number)
            console.log('adminId:', moderatorToDelete);
    
            if (moderatorToDelete) {
                await axios.delete('/api/admin/delete-mod', {
                    data: { adminId: moderatorToDelete }, // Only send adminId here
                    withCredentials: true
                });
    
                fetchModerators(); // Refresh moderators
                setShowModal(false); // Close the modal
                setModeratorToDelete(null); // Clear the selected moderator
            }
        } catch (error) {
            console.error("Error deleting moderator", error);
        }
    };
    const clearForm = () => {
        setNewModerator({
            email: "",
            confirmEmail: "",
            password: "",
            confirmPassword: "",
            role: "Moderator",
            identificationNumber: "",
            fullName: "",
            phoneNumber: ""
        });
    };
      
      const handleDeleteClick = (adminId) => {
        console.log("Admin ID to delete:", adminId);  // Log to confirm you are passing a primitive ID
        setModeratorToDelete(adminId);  
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModeratorToDelete(null); // Reset the moderator ID
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false); // Close modal if clicked outside
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="admin-section" style={{ padding: "20px" }}>
                <div className="list">
                    <div className="card">
                        <div className="info-item"><h6>Namn</h6></div>
                        <div className="info-item"><h6>Roll</h6></div>
                        <div className="info-item"><h6>E-post</h6></div>
                        <div className="info-item"><h6>Telefonnummer</h6></div>
                        <div className="info-item"><h6>Personnummer</h6></div>   
                        <div className="info-item"></div>
                    </div>

                    {moderators.length > 0 ? (
                        moderators.map((mod) => (
                            <div key={mod.adminId} className="card">
                                <h4 className="info-item">{mod.fullName}</h4>
                                <p className="info-item">{mod.role}</p>

                                {/* Email */}
                                <div className="info-item">
                                    {visibleEmails[mod.adminId] ? mod.email : <strong>{Array(mod.email.length).fill('*').join('')}</strong>}
                                    <div className="eye">
                                        <button onClick={() => toggleEmailVisibility(mod.adminId)}>
                                            <FontAwesomeIcon icon={visibleEmails[mod.adminId] ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>
                                 {/* Phone Number */}
                                 <div className="info-item">
                                    {visiblePhones[mod.adminId] ? mod.phoneNumber : <strong>{Array(mod.phoneNumber.length).fill('*').join('')}</strong>}
                                    <div className="eye">
                                        <button onClick={() => togglePhoneVisibility(mod.adminId)}>
                                            <FontAwesomeIcon icon={visiblePhones[mod.adminId] ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>

                                {/* ID Number */}
                                <div className="info-item">
                                    {visibleIds[mod.adminId] ? mod.identificationNumber : <strong>{Array(mod.identificationNumber.length).fill('*').join('')}</strong>}
                                    <div className="eye">
                                        <button onClick={() => toggleIdVisibility(mod.adminId)}>
                                            <FontAwesomeIcon icon={visibleIds[mod.adminId] ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <div className="info-item">
                                    <a onClick={() => handleDeleteClick(mod.adminId)}>
                                        <FontAwesomeIcon icon={faTrash} /> Ta bort
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Inga moderatorer hittades.</p>
                    )}
                </div>

            <div className="section">
                <h3>Lägg till en <div className="select-container">
                    <select
                        className="button-dropdown"
                        value={newModerator.role}
                        onChange={(e) => setNewModerator({ ...newModerator, role: e.target.value })}
                    >
                        <option value="Admin">👑 Admin</option>
                        <option value="Moderator">🛡️ Moderator</option>
                    </select>
                </div></h3>
                <input
                    type="email"
                    placeholder="E-post"
                    value={newModerator.email}
                    onChange={(e) => {
                        setNewModerator({ ...newModerator, email: e.target.value });
                    }}
                    />
                <input
                    type="email"
                    placeholder="Bekräfta E-post"
                    value={newModerator.confirmEmail}
                    onChange={(e) => setNewModerator({ ...newModerator, confirmEmail: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Telefonnummer"
                    value={newModerator.phoneNumber}
                    onChange={(e) => setNewModerator({ ...newModerator, phoneNumber: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Lösenord"
                    value={newModerator.password}
                    onChange={(e) => setNewModerator({ ...newModerator, password: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Bekräfta Lösenord"
                    value={newModerator.confirmPassword}
                    onChange={(e) => setNewModerator({ ...newModerator, confirmPassword: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Personnummer"
                    value={newModerator.identificationNumber}
                    onChange={(e) => setNewModerator({ ...newModerator, identificationNumber: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Namn och efternamn"
                    value={newModerator.fullName}
                    onChange={(e) => setNewModerator({ ...newModerator, fullName: e.target.value })}
                />
                <button className='button-positive' onClick={addModerator}>Lägg till Moderator</button>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" ref={modalRef}>
                        <h4>Är du säker?</h4>
                        <p>Vill du verkligen ta bort denna moderator?</p>
                        <button className='button-neutral' onClick={() => deleteModerator(moderatorToDelete)}>Ja</button>

                        <button className='button-neutral' onClick={closeModal}>Nej</button>
                    </div>
                </div>
            )}
        </div>
    );
}

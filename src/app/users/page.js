'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useOrderContext } from '../../context/orderContext.js';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import BarChart from "../components/BarChart";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);
  const [UsersLoading, setUsersLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [privateAccountsPercentage, setPrivateAccountsPercentage] = useState(0);
  const [companyAccountsPercentage, setCompanyAccountsPercentage] = useState(0);
  const [privateAccountsCount, setPrivateAccountsCount] = useState(0);
  const [companyAccountsCount, setCompanyAccountsCount] = useState(0);
  const [foundUser, setFoundUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const containerRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);  // Modal visibility
  const [userIdToDelete, setUserIdToDelete] = useState(null); 
  const closeModal = () => setSelectedUser(null);
  const { setUserId } = useOrderContext();

  const chartData = useMemo(() => [
    { name: "Totalt", count: totalCount },
    { name: "Företagskonton", count: companyAccountsCount },
    { name: "Privatkonton", count: privateAccountsCount },
  ], [totalCount, companyAccountsCount, privateAccountsCount]);
  
  // Close the user card if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSelectedUserId(null); // Close the card if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const fetchAllUsers = async () => {
    setMessage('');
    setUsersLoading(true);
  
    try {
      const response = await axios.get('/api/users/get-all', {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize
        },
        withCredentials: true,
      });
  
      console.log("Fetched Users:", response.data); // Debugging line
  
      setUsers(Array.isArray(response.data.Users) ? response.data.Users : []);
      setTotalCount(response.data.TotalCount);
      setCompanyAccountsCount(response.data.CompanyAccountsCount);
      setCompanyAccountsPercentage(response.data.CompanyAccountsPercentage);
      setPrivateAccountsCount(response.data.PrivateAccountsCount);
      setPrivateAccountsPercentage(response.data.PrivateAccountsPercentage);
      
      // Use the totalPages value directly from the backend response
      setTotalPages(response.data.TotalPages);
    console.log('fetched company count: ', companyAccountsCount)
    } catch (err) {
      console.error("Error fetching users:", err);
      setError('Ett fel uppstod vid hämtning av användardata.');
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

useEffect(() => {
  // Fetch all users when the page loads or pagination changes
  fetchAllUsers();
}, [pageNumber, pageSize]);
  

    // Function to handle page change
    const changePage = (newPage) => {
        setPageNumber(newPage);
        fetchAllUsers();
    };

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const updateAdminNote = async () => {
    setMessage('');
    try {
      const res = await fetch('/api/user/update-note', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUserId, adminNote }),
      });
      const data = await res.json();
      setMessage(data.Message);
    } catch (error) {
      setMessage('Failed to update admin note');
    }
  };

  const [adminNote, setAdminNote] = useState(users.adminNote || '');
  useEffect(() => {
    if (selectedUser) {
      setAdminNote(selectedUser.adminNote || ''); // Set admin note on user selection
    }
  }, [selectedUser]);
  // Step 3: Handle the change in the textarea (making the note editable)
  const handleNoteChange = (e) => {
    setAdminNote(e.target.value); // Update local state when note is edited
  };
  const handleSaveNote = async () => {
    try {
      if (!selectedUser || !selectedUser.userId) {
        alert('No user selected');
        return;
      }
  
      // First fetch: Save the admin note by calling the backend API
      const response = await axios.patch('/api/users/update-note', {
        userId: selectedUser.userId,  // Send the selected user ID
        adminNote: adminNote,  // Send the updated note
        withCredentials: true
    });
  
      if (response.status === 200) {
        // Success: Set the updated admin note to local state
        setAdminNote(response.data.updatedNote);  // Update the note in the frontend
        alert('Admin note updated successfully');
      } else {
        alert('Error updating admin note');
      }
    } catch (error) {
      console.error('Error saving admin note:', error);
      alert('Error saving admin note');
    }
  };
  
  const getUserDetails = async (userId) => {
    setIsUserLoading(true);
  
    try {
      const response = await axios.post("/api/users/get-user", 
        { UserId: userId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("User details fetched:", response.data);
  
      // Set the selected user with the fetched data
      setSelectedUser(response.data);
  
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn("User not found.");
        setSelectedUser(null);  // No user found, reset the selectedUser
      } else {
        console.error("Error fetching user:", error);
        setSelectedUser(null);  // Reset in case of error
      }
    } finally {
      setIsUserLoading(false);
    }
  };
  
   
  useEffect(() => {
    if (searchQuery) {
      // If search query is present, call the API to fetch filtered users
      searchUser(searchQuery);
    } else {
      // If search query is empty, show all users
      setFoundUsers(users);
    }
  }, [searchQuery, users]);  // Run when searchQuery or users changes
  
  const searchUser = async (searchQuery) => {
    setUsersLoading(true);
  
    try {
      const response = await axios.post("/api/users/get-users", 
        { SearchQuery: searchQuery },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Search Result:", response.data);
      
      // Ensure foundUsers gets an array
      setFoundUsers(Array.isArray(response.data) ? response.data : [response.data]);
  
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn("User not found, setting empty array.");
        setFoundUsers([]);  // Treat 404 as empty result
      } else {
        console.error("Error fetching users:", error);
        setFoundUsers([]);
      }
    } finally {
      setUsersLoading(false);
    }
  };
  
  // When users are fetched or search query changes, filter users
  useEffect(() => {
    if (!searchQuery) {
      setFoundUsers(users); // Reset to all users if searchQuery is cleared
    } else {
      const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFoundUsers(filteredUsers); // Update found users based on searchQuery
    }
  }, [searchQuery, users]);  // Only trigger when searchQuery or users change
  

  // Handle input changes and trigger the search function
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteClick = (userId) => {
    setUserIdToDelete(userId);  // Set user ID for the modal
    setShowDeleteModal(true);  // Show the modal
};

const handleCancel = () => {
    setShowDeleteModal(false);  // Close the modal without deleting
};

const handleConfirmDelete = () => {
    deleteUser(userIdToDelete);  // Proceed with deletion
    setShowDeleteModal(false);  // Close the modal after action
};
  const deleteUser = async (userId) => {

    try {
        const response = await axios.delete("/api/users/delete-user", {
            data: { UserId: userId },  // Pass the payload in the 'data' field
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });

        console.log("User deleted:", response.data);

        setSelectedUser(null); // Clear the selected user after deletion

    } catch (error) {
        if (error.response?.status === 404) {
            console.warn("Användaren hittades inte.");
        } else {
            console.error("Fel vid borttagning av användare:", error);
        }

        // Reset selectedUser in case of error
        setSelectedUser(null);
    }
};

const router = useRouter();


// In your first page component where the user is selected
const handleFindOrdersClick = () => {
  if (selectedUser?.userId) {
    setUserId(selectedUser.userId);  // This sets the userId in context
    router.push('/orders');  // Redirect to orders page
  }
};




  return (
    <div className="users-section">
      {message && <p>{message}</p>}

        <div className='search-bar'>
          <div className='search'>
<h2>Användarlist</h2>
        <input
            type="text"
            placeholder="Skriv e-post / organisationsnummer / personnummer / namn / företagsnamn"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          /></div>
            <div className='users-overview'>
        <div className='user-stats'>
          <BarChart data={chartData} width={450} height={250} />
      </div>
      </div> 
</div>      <div className="list">
        <div className="card">
          <strong className="info-item">Namn</strong>
          <strong  className="info-item">E-post</strong>
          <strong className="info-item">Bransch</strong>
          <strong  className="info-item">Antal ordrar</strong>
          <strong  className="info-item">Typ av konto</strong>
        </div>
        
        {UsersLoading ? (
  <LoadingSpinner />
) : error ? (
  <p>{error}</p>
) : (
  // Check if there are no users to display
  (searchQuery.length > 0 ? foundUsers : users)?.length === 0 ? (
    <p>Inga användare hittades</p> // Show message if no users found
  ) : (
    (searchQuery.length > 0 ? foundUsers : users)?.map((user, index) => (
      <div key={user.userId || `user-${index}`} className="card"  onClick={() => getUserDetails(user.userId)}>
        <div
          className="info-item"
          onClick={() => getUserDetails(user.userId)} // Fetch details on click
        >
          {index + 1} {/* Display user index */}
        </div>
        <div
          className="info-item"
          onClick={() => getUserDetails(user.userId)} // Fetch details on click
        >
          {user.isCompany ? user.companyName : user.fullName}
        </div>
        <div className="info-item">
          {user.isCompany ? user.businessType : ""}
        </div>
        <a
          className="info-item"
          onClick={() => handleFindOrdersClick(user)}
        >
          {user.orderCount || "0"}
        </a>
        <div className="info-item">
          {user.isCompany ? "Företag" : "Privat"}
        </div>
      </div>
    ))
  )
)}

        </div>
      {selectedUser || isUserLoading ? (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3 className="modal-title">Användarinformation</h3>
      <div className="modal-body">
        {/* Show loading spinner until user data is fetched */}
        {isUserLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* User Info */}
            <div className="info-row">
              <div className="info-box"><strong>E-post:</strong> {selectedUser.email || "N/A"}</div>
              <div className="info-box"><strong>Namn:</strong> {selectedUser.fullName || "N/A"}</div>
              <div className="info-box"><strong>Organisationsnummer:</strong> {selectedUser.identificationNumber || "N/A"}</div>
            </div>

            {/* Additional Rows */}
            <div className="info-row">
              <div className="info-box"><strong>Företagsnamn:</strong> {selectedUser.companyName || "N/A"}</div>
              <div className="info-box"><strong>Affärstyp:</strong> {selectedUser.businessType || "N/A"}</div>
              <div className="info-box"><strong>Telefonnummer:</strong> {selectedUser.phoneNumber || "N/A"}</div>
            </div>
            <div className="info-row">
              <div className="info-box"><strong>Verifierad:</strong> {selectedUser.isVerified ? "Ja" : "Nej"}</div>
              <div className="info-box"><strong>Antal Ordrar:</strong><a onClick={handleFindOrdersClick}> {selectedUser.orderCount || "0"}</a></div>
              <div className="info-box"><strong>Registreringsdatum:</strong> {selectedUser.registeredAt ? new Date(selectedUser.registeredAt).toLocaleDateString() : "N/A"}</div>
            </div>
            <div className="info-row">
            
            </div>
            
            {/* Address Section */}
            <h4 className="address-title">Adresser</h4>
            {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
              selectedUser.addresses.map((address, index) => (
                <div key={index} className="info-row">
                  <div className="address-box">
                    <strong>
                      {address.isPrimary ? "Huvudkontor" : `Ytterligare address ${index}`}
                    </strong>
                    <div className="info-box">
                      {address.streetAndNumber || "N/A"}, {address.city || "N/A"}, {address.postalCode || "N/A"}, {address.region || "N/A"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Ingen adress tillgänglig</p>
            )}


                    {/* Modal for confirmation */}
                    {showDeleteModal && (
                        <div className="delete-modal">
                            <div className="modal-content">
                                <p>Är du säker på att du vill ta bort användaren?</p>
                                <button className='button-neutral' onClick={handleConfirmDelete}>Ja, ta bort</button>
                                <button className='button-neutral' onClick={handleCancel}>Nej, stäng</button>
                            </div>
                        </div>
                    )}
               <div className='aa'> <label>Adminanteckning:</label>                        {/* Button to trigger the deletion */}
                    <a 
                        onClick={() => handleDeleteClick('user-id')}>
                        Ta bort användaren
                    </a></div>
                <textarea
                className="admin-note"
                value={adminNote}
                onChange={handleNoteChange}
                />
                <button className="button-positive" onClick={handleSaveNote}>
                Spara anteckningen
                </button>

          </>
        )}
      </div>
    </div>
  </div>
) : null}

      <div className="pagination"><div>
  {/* Previous Button */}
  <button
    className="button-utils"
    onClick={() => handlePageChange(pageNumber - 1)}
    disabled={pageNumber === 1}
  >
    Föregående
  </button>

  {/* First Page */}
  {pageNumber > 4 && (
    <>
      <a
        className="page-button"
        onClick={() => handlePageChange(1)}
      >
        1
      </a>
      <span className="dots">...</span>
    </>
  )}

  {/* Page Numbers (3 before & 3 after) */}
  {Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    if (page >= pageNumber - 3 && page <= pageNumber + 3) {
      return (
        <a
          key={page}
          className={`page-button ${pageNumber === page ? 'active' : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </a>
      );
    }
    return null;
  })}

  {/* Last Page */}
  {pageNumber < totalPages - 3 && (
    <>
      <span className="dots">...</span>
      <a
        className="page-button"
        onClick={() => handlePageChange(totalPages)}
      >
        {totalPages}
      </a>
    </>
  )}

  {/* Next Button */}
  <button
    className="button-utils"
    onClick={() => handlePageChange(pageNumber + 1)}
    disabled={pageNumber === totalPages}
  >
    Nästa
  </button>
</div>
{/* Total Pages Display */}
<div className="pagination-info">
  Sida <strong>{pageNumber}</strong> av <strong>{totalPages}</strong>
</div>

</div>
    
</div>
  );
}

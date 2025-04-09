"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { useOrderContext } from "@/context/orderContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint,faChevronRight  } from '@fortawesome/free-solid-svg-icons'; // Importing the print icon
export default function OrdersManagementPage() {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const containerRef = useRef(null);
  const modalRef = useRef(null); // Ref for modal container
  const modalOverlayRef = useRef(null); // Ref for modal overlay
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  // Refs for Customer and Order Modal overlays and content
  const customerModalOverlayRef = useRef(null);
  const customerModalContentRef = useRef(null);
  const orderModalOverlayRef = useRef(null);
  const orderModalContentRef = useRef(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState();
  const [isCustomerLoading, setIsCustomerLoading] = useState();
  const router = useRouter();
  const handlePrint = () => {
    window.print(); // Trigger print dialog
  };
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay for debounce
  
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);
  
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const fetchOrders = async () => {
    setLoading(true);  // Start loading before making the request
  
    if (!debouncedSearchQuery.trim()) {
      setDebouncedSearchQuery(""); // Set query to an empty string if no search query is given
    }
  
    try {
      const response = await axios.post("/api/orders/search", {
        query: debouncedSearchQuery, 
        pageNumber,
        pageSize,
      }, {
        withCredentials: true
      });
  
      if (response.data?.Orders?.length === 0) {
        setOrders([]);  // No orders found, so set the orders to an empty array
        setTotalCount(0);
      } else {
        setOrders(response.data.Orders);
        setTotalCount(response.data.TotalCount);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);  // In case of error, set orders to an empty array
      setTotalCount(0);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

useEffect(() => {
  fetchOrders(); // Fetch orders whenever the debounced search query or pagination changes
}, [debouncedSearchQuery, pageNumber, pageSize]);
const handlePageChange = (newPageNumber) => {
  setPageNumber(newPageNumber);
};

const handleSearchChange = (e) => {
  setSearchQuery(e.target.value); // Trigger search query update
};
  // Fetch orders by date range
  const fetchOrdersByDateRange = async (start, end) => {
    try {
      const response = await axios.get("/api/orders/date-range", {
        params: { startDate: start, endDate: end },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders by date range", error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const query = router.query.query; // Access query parameter directly
      if (query) {
        setSearchQuery(query); // Populate the input with the query parameter
      }
    }
  }, [router.isReady, router.query]); 
  // Handle search logic
  const handleSearch = () => {
    if (orderId) {
      fetchOrderById();
    } else if (customerId) {
      fetchOrdersByCustomerId();
    }
  };

  // Handle modal open and close
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
  };
  const { userId, setUserId } = useOrderContext();
  useEffect(() => {
    // This effect runs when the page first loads (after mounting)
    if (userId) {
      // First, set the searchQuery to userId to preserve it in the input field
      setSearchQuery(userId);
  
      // Then clear userId from the context after setting the search query
      setUserId(null);
    }
  }, [userId, setUserId]);  // Dependency array, no stray / here
  
  const handleCloseModal = () => {
    setSelectedOrder(null);
    setSelectedCustomer(null);
  };

   // Close modal if clicked outside the overlay but not inside the content
   useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is inside the modal overlay
      if (customerModalOverlayRef.current && 
          !customerModalContentRef.current.contains(event.target) && 
          customerModalOverlayRef.current.contains(event.target)) {
        setSelectedCustomer(null); // Close customer modal
      }

      // Check if the click is inside the modal overlay
      if (orderModalOverlayRef.current && 
          !orderModalContentRef.current.contains(event.target) && 
          orderModalOverlayRef.current.contains(event.target)) {
        setSelectedOrder(null); // Close order modal
      }
    };

    // Attach the event listener for mouse down to close the modal if outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function to remove the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleViewCustomer = async (customerId) => {
    try {
      setIsCustomerLoading(true);
      const response = await axios.post('api/users/get-user', 
        { UserId: customerId }, 
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      setSelectedCustomer(response.data);
      setIsCustomerLoading(false);
    } catch (error) {
      setIsCustomerLoading(false);
      console.error("Error fetching customer details", error);
    }
  };


  // Refetch orders when searchQuery or pagination changes


  return (
    <div className="orders-section">
      <div className="search-wrapper">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Orders..."
            value={searchQuery} // Th
            onChange={handleSearchChange}
          />
        </div>

        <div className="search-container">
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <h5>till</h5>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            className="button-positive"
            onClick={() => fetchOrdersByDateRange(startDate, endDate)}
          >
            Filtrera
          </button>
        </div>
      </div>

      {/* Order List */}
      <div className="list">
  <div className="card">
    <div className="info-item"></div>
    <div className="info-item">Order-ID</div>
    <div className="info-item">Kund</div> 
    <div className="info-item">Köpt den</div>
    <div className="info-item">Kvantitet</div>
    <div className="info-item">Pris (med moms)</div>
    <div className="info-item">Betalningsstatus</div>
  </div>

   {loading && <LoadingSpinner />}
   {!loading && orders && orders.length > 0 ? (
    orders.map((order, index) => (
      <div key={order.orderId} className="card">
        <div
          className="info-item"
          onClick={() => handleOpenModal(order)}
        >
          {index + 1}
        </div>
        <div
          className="info-item"
          onClick={() => handleOpenModal(order)}
        >
          {order.orderId}
        </div>
        <div className="info-item">
          {/* Replace 'customerId' with 'Visa kund' button */}
          
          <a  onClick={() => {
  console.log("customerId", order.customerId); // <--- Check this
  handleViewCustomer(order.customerId);
}}>
            
    {"Visa kund"}
    {isCustomerLoading && <LoadingSpinner />} {/* Show the loading spinner next to "Visa kund" */}

</a>

        </div>
        <div
          className="info-item"
          onClick={() => handleOpenModal(order)}
        >
          {new Date(order.createdAt).toLocaleString("sv-SE")}
        </div>
        <div
          className="info-item"
          onClick={() => handleOpenModal(order)}
        >
          {order.quantity} st.
        </div>
        <div
          className="info-item"
          onClick={() => handleOpenModal(order)}
        >
          {order.totalPrice} SEK
        </div>
        <div
          className="info-item"
          onClick={() => handleOpenModal(order)}
        >
          {order.paymentStatus}
        </div>
      </div>
    ))
  ) : (
    <div className="info-item">
      <p>Inga ordrar hittades</p>
    </div>
  )}
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

{selectedCustomer && (
  <div className="modal-overlay customer-modal" ref={customerModalOverlayRef}>
    <div className="modal-content customer-modal" ref={customerModalContentRef}>
      <span className="close" onClick={handleCloseModal}>&times;</span>
      <div className="aaa"><h2>Köparen</h2></div>

      {isCustomerLoading ? (
        <LoadingSpinner /> // Show loading text or spinner here
      ) : (
        <>
          <div><strong>Kund ID:</strong> {selectedCustomer.userId}</div>
          <div><strong>Namn:</strong> {selectedCustomer.fullName}</div>
          <div><strong>ID nummer:</strong> {selectedCustomer.identificationNumber}</div>
          <div><strong>E-post:</strong> {selectedCustomer.email}</div>
          <div><strong>Telefonnummer:</strong> {selectedCustomer.phoneNumber}</div>
          <button className="button-positive" onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} /> Skriv Ut {/* Using the print icon */}
          </button>
        </>
      )}
    </div>
  </div>
)}

{/* Modal for showing full order details */}
{selectedOrder && (
  <div className="modal-overlay order-modal" ref={orderModalOverlayRef}>
    <div className="modal-content order-modal" ref={orderModalContentRef}>
      <span className="close" onClick={handleCloseModal}>&times;</span>
      <h2>Order detaljer:</h2>

      {isLoading ? (
        <LoadingSpinner /> // Show loading text or spinner here
      ) : (
        <>
          <div><strong>Order-ID:</strong> {selectedOrder.orderId}</div>
          <div><strong>Kund-ID: </strong> 
            <a onClick={() => handleViewCustomer(selectedOrder.customerId)} style={{ cursor: 'pointer' }}>
              {selectedOrder.customerId} <FontAwesomeIcon icon={faChevronRight} />
              {isCustomerLoading && <LoadingSpinner />}
            </a>
          </div>
          <div><strong>E-post:</strong> {selectedOrder.customerEmail}</div>
          <div><strong>Köpt den:</strong> {new Date(selectedOrder.createdAt).toLocaleString("sv-SE")}</div>
          <div><strong>Pris per data:</strong> {selectedOrder.pricePerProduct} SEK</div>
          <div><strong>Kvantitet:</strong> {selectedOrder.quantity} st.</div>
          <div><strong>Totalt pris utan moms:</strong> {selectedOrder.totalPriceWithoutVat} SEK</div>
          <div><strong>Totalt pris:</strong> {selectedOrder.totalPrice} SEK</div>
          <div><strong>Betalningsstatus:</strong> {selectedOrder.paymentStatus}</div>
          <button className="button-positive" onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} /> Skriv Ut {/* Using the print icon */}
          </button>
        </>
      )}
    </div>
  </div>
)}
    </div>
  );
}

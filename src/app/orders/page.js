"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function OrdersManagementPage() {
    const [orders, setOrders] = useState([]);
    const [orderId, setOrderId] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get("/api/orders/get-all", {
                params: {
                    pageNumber: 1,
                    pageSize: 10
                  },
                withCredentials: true  // Use the correct variable names here
            });
            setOrders(Array.isArray(response.data.Orders) ? response.data.Orders : []);
            console.log('orders: ', orders)
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    };
    
    useEffect(() => {
        fetchAllOrders();
    }, [])

    // useEffect(() => {
    //     const lastWeek = new Date();
    //     lastWeek.setDate(lastWeek.getDate() - 7);
    //     fetchOrders(lastWeek.toISOString().split("T")[0], new Date().toISOString().split("T")[0]);
    // }, []);

    // const fetchOrders = async (start, end) => {
    //     try {
    //         const response = await axios.get("/api/orders/date-range", {
    //             params: { startDate: start, endDate: end }
    //         });
    //         setOrders(response.data);
    //     } catch (error) {
    //         console.error("Error fetching orders", error);
    //     }
    // };
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
      if (orderId) {
        fetchOrderById();  // Fetch order by Order ID
      } else if (customerId) {
        fetchOrdersByCustomerId();  // Fetch orders by Customer ID
      }
    };
    const fetchOrderById = async () => {
        if (!orderId) return;
        try {
            const response = await axios.get(`/api/orders/${orderId}`);
            setOrders([response.data]);
        } catch (error) {
            console.error("Error fetching order", error);
        }
    };

    const fetchOrdersByCustomerId = async () => {
        if (!customerId) return;
        try {
            const response = await axios.get("/api/orders", {
                params: { customerId }
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    };

    return (
        <div className='orders-section'>
            <div className="search-wrapper">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Sök efter Order-ID eller Kund-ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className='button-positive' onClick={handleSearch}>Sök</button>
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
            <button className='button-positive' onClick={() => fetchOrders(startDate, endDate)}>Filtrera</button>
          </div>
       </div>
          {/* Order List */}
          <div className="list">
            <div className="card">
                <div className="info-item"></div>
              <div className="info-item">Order-ID</div>
              <div className="info-item">Kund-ID</div>
              <div className="info-item">E-post</div>
              <div className="info-item">Köpt den</div>
              <div className="info-item">Pris per data</div>
              <div className="info-item">Kvantitet</div>
              <div className="info-item">Totalt pris utan moms</div>
              <div className="info-item">Totalt pris</div>
              <div className="info-item">Betalningsstatus</div>
              <div className="info-item">Filtrar Id</div>
              <div className="info-item">Klarna Betalning</div>
            </div>
      
            {/* List of Orders */}
            {orders && orders.length > 0 ? (
              orders.map((order, index) => (
                <div key={order.orderId} className="card">
                    <div className="info-item">{index + 1}</div>
                  <div className="info-item">{order.orderId}</div>
                  <div className="info-item">{order.customerId}</div>
                  <div className="info-item">{order.customerEmail}</div>
                  <div className="info-item">{new Date(order.createdAt).toLocaleString('sv-SE')}</div>
                  <div className="info-item">{order.pricePerProduct} SEK</div>
                  <div className="info-item">{order.quantity} st.</div>
                  <div className="info-item">{order.totalPriceWithoutVat} SEK</div>
                  <div className="info-item">{order.totalPrice} SEK</div>
                  <div className="info-item">{order.paymentStatus}</div>
                  <div className="info-item">{order.filtersUsed}</div>
                  <div className="info-item">{order.klarnaPaymentId}</div>
                </div>
              ))
            ) : (
              <div className="info-item">
                <p>No orders found</p>
              </div>
            )}
          </div>
        </div>
      );
      
}
import { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [userId, setUserId] = useState(null);

  return (
    <OrderContext.Provider value={{ userId, setUserId }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('it is throwing this error');
  }
  return context;
}

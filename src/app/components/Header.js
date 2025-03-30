'use client';

import Link from "next/link";
import { usePathname } from "next/navigation"; // Get the current path

export default function Header() {
  const pathname = usePathname(); // Get the current URL path

  const renderHeaderContent = () => {
    switch (pathname) {
      case "/dashboard":
        return <h1>Översikt</h1>;
      case "/moderators":
        return <h1>Moderatorhantering</h1>;
      case "/users":
        return <h1>Användarhantering</h1>;
      case "/orders":
        return <h1>Orderhantering</h1>;
      case "/data":
        return <h1>Datahantering</h1>;
      default:
        return <h1>Välkommen till Adminpanellen</h1>;
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="page-title">
          {renderHeaderContent()}
        </div>
      </div>
    </header>
  );
}

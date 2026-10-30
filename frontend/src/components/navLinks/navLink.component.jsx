import React from "react";
import { Link } from "react-router-dom";

export default function CustomNavLink({ to, children, ...props }) {
  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  );
}

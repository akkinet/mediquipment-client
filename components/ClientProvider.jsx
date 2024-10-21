"use client";
import { usePathname } from "next/navigation";

function ClientProvider({ children }) {
  const pathname = usePathname();

  if (
    pathname == "/login" ||
    pathname == "/password-forget" ||
    pathname == "/password-reset" ||
    pathname == "/sign-up"
  )
    return null;

  return (
    <div>
      {children}
    </div>
  )
}

export default ClientProvider;

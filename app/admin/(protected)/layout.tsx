import { getAdminSession } from "@/lib/auth/session";
import { redirect,} from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 const admin= await getAdminSession()
  if (!admin ) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
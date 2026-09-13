import { getDriverSession } from "@/lib/auth/session";
import { getBus } from "@/actions/buses";
import { redirect } from "next/navigation";

export default async function DriverLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const driver = await getDriverSession();

  if (!driver || !id) {
    redirect("/driver");
  }

  const bus = await getBus(id);

  if (!bus) {
    redirect("/driver");
  }

  return <>{children}</>;
}
// "use server";

// import { redirect } from "next/navigation";
// import { supabaseServer } from "@/lib/supabase/server";
// import { adminLoginSchema } from "@/lib/validation";

// export async function loginAdmin(formData: FormData) {
//   const result = adminLoginSchema.safeParse({
//     email: formData.get("email"),
//     password: formData.get("password"),
//   });

//   if (!result.success) {
//     return {
//       error: result.error.issues[0]?.message ?? "Invalid input",
//     };
//   }

//   const { email, password } = result.data;

//   const supabase = supabaseServer();

//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error || !data.user) {
//     return {
//       error: "Invalid email or password.",
//     };
//   }

//   // Make sure the authenticated account is actually
//   // registered in our admins table.
//   const { data: admin, error: adminError } = await supabase
//     .from("admins")
//     .select("id, role")
//     .eq("id", data.user.id)
//     .maybeSingle();

//   if (adminError || !admin) {
//     await supabase.auth.signOut();

//     return {
//       error: "This account does not have administrator access.",
//     };
//   }

//   redirect("/admin");
// }
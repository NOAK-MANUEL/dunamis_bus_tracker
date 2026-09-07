// "use server";

// import { redirect } from "next/navigation";
// import { supabaseServer } from "@/lib/supabase/server";
// import {
//   adminLoginSchema,
// } from "@/lib/validation";
// import { setAdminSession } from "@/lib/auth/session";

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

//   const supabase = supabaseServer();

//   const { data, error } = await supabase.auth.signInWithPassword({
//     email: result.data.email,
//     password: result.data.password,
//   });

//   if (error || !data.session || !data.user) {
//     return {
//       error: "Invalid email or password.",
//     };
//   }

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

//   await setAdminSession(data.session.access_token);

//   redirect("/admin");
// }
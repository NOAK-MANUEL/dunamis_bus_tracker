"use server";
import { getAdminSession, setAdminSession } from "@/lib/auth/session";
import {createClient} from "@/lib/supabase/server"
import { AdminForm, AdminLoginInput, adminLoginSchema, adminSchema } from "@/lib/validation";
import bcrypt from "bcrypt"
import { redirect } from "next/navigation";


export const loginAdmin = async(data:AdminLoginInput)=>{
	const {email,password} = adminLoginSchema.parse(data)

	const superbase = await createClient()
	const {data:admin,error} = await superbase.from("admins").select("id,password").eq("is_active",true).eq("email",email).maybeSingle()

	if (error || !admin){
		throw new Error("Incorrect email or password")
	}

	const valid = bcrypt.compareSync(password,admin.password)


	if (!valid){
		throw new Error("Incorrect email or password")
	}

	setAdminSession(JSON.stringify(admin))

	redirect("/admin")

}

export const addAdmin = async (data: AdminForm) => {
  const { email, password, name } = adminSchema.parse(data)

  const supabase = await createClient()

  const { data: admin, error: selectError } = await supabase
    .from("admins")
    .select("email")
    .eq("email", email)
    .maybeSingle()

  if (selectError) {
    throw new Error(selectError.message)
  }

  if (admin) {
    throw new Error("Email already exists")
  }

  const passwordHashed = bcrypt.hashSync(
    password,
    bcrypt.genSaltSync()
  )

  const { error: insertError } = await supabase
    .from("admins")
    .insert({
      email,
      name,
      password: passwordHashed,
    })

  if (insertError) {
    throw new Error(insertError.message)
  }

  return { success: true }
}


export const countAdmin = async()=>{

	const superbase = await createClient()
	const {data:records,error} = await superbase.from("admins").select("count").eq("is_active",true)

	if (error){
		throw new Error("An error occured",error)
	}
	return records[0]
}




export const isAdmin = async()=>{
    const admin = await getAdminSession()
    if (!admin) return false

  const supabase = await createClient()

  const {data:valid} = await supabase.from("admins").select("id").eq("id",JSON.parse(admin).id).eq("is_active",true).single()

  return valid
}


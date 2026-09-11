"use server"

import { createClient } from "@/lib/supabase/server"
import { CreateLocationInput, locationSchema } from "@/lib/validation"
import { isAdmin } from "./admin"

export const addLocation = async (data:CreateLocationInput )=>{
	const {name,description} = locationSchema.parse(data)
	const admin = await isAdmin()
	if (!admin){
		throw new Error("No Admin detail found ")
	}
	const supabase = await createClient()
	const {error}=await supabase.from("locations").insert({description,name, admin_id: admin.id})
	if (error){
		throw new Error(error.message)
	}
	
}

export const getAllLocations = async ( )=>{
	const supabase = await createClient()
	const {data:locations,error} = await supabase.from("locations").select("id,name,is_active,buses (id,is_active)").order("name",{ascending:true})
	if (error){
		throw new Error(error.message)
	}

	return locations
}

export const getLocations = async ( )=>{
	const supabase = await createClient()
	const {data:locations,error} = await supabase.from("locations").select("id,name,buses (id,is_active)").eq("is_active",true).order("name",{ascending:true})
	if (error){
		throw new Error(error.message)
	}

	return locations
}

export const searchLocation = async (locationName:string)=>{
	const supabase = await createClient()
	const locations = await supabase.from("locations").select("id,name,buses (count)").ilike("name",`%${locationName}`)

	return locations
}


export async function adminLocationSetActive(location_id:string, to_set:boolean){
	

	 const valid = await isAdmin()
	  if(!valid){
		throw new Error("No admin detail found")
	  }

	  const supabase = await createClient()

	 



	const {error}=await supabase.from("locations").update({is_active:to_set}).eq("id",location_id)
	if (error) throw new Error(error.message);

}




"use server"

import { createClient } from "@/lib/supabase/server"
import { CreateLocationInput, locationSchema } from "@/lib/validation"

export const addLocation = async (data:CreateLocationInput ):Promise<boolean>=>{
	const {name,description} = locationSchema.parse(data)
	const supabase = await createClient()
	await supabase.from("locations").insert({description,name})
	return true
}

export const getLocations = async ( )=>{
	const supabase = await createClient()
	const {data:locations,error} = await supabase.from("locations").select("id,name,buses (id,is_active)").eq("is_active",true)
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





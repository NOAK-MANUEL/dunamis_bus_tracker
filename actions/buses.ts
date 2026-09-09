"use server"

import {createClient} from "@/lib/supabase/server"
import { CreateBusInput, createBusSchema } from "@/lib/validation";

export async function getBuses(location_id?:string){
	const supabase = await createClient()

	let query =  supabase.from("buses").select("plate,name,is_active,id,updated_at");
	if (location_id){
		query = query.eq("location_id",location_id)
	}
	const {data,error} = await query

	if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function create_bus(data:CreateBusInput):Promise<boolean>{
	const {pin,name,plateNumber,locationId}= createBusSchema.parse(data)


	const supabase = await createClient()

	await supabase.from("buses").insert({
		pin_hash: pin,name,plate_number:plateNumber, location_id:locationId
	})
	return true
}

export async function delete_bus(bus_id:string){
	const supabase = await createClient()

	 await supabase.from("buses").delete().eq("id",bus_id)

	
}
export async function admin_change_pin(pin:number,bus_id:string){
	const supabase = await createClient()

	 await supabase.from("buses").update({pin_hash:pin}).eq("id",bus_id)

	
}

export async function activate_bus(bus_id:string){
	const supabase = await createClient()

	const busUpdate = await supabase.from("buses").update({is_active:true}).eq("id",bus_id).select("id,is_active,updated_at").single()
	return busUpdate
}

export async function deactivate_bus(bus_id:string){
	const supabase = await createClient()

	const busUpdate = await supabase.from("buses").update({is_active:false}).eq("id",bus_id).select("id,is_active,updated_at").single()
	return busUpdate
}


export async function admin_bus_set(location_id:string, to_set:boolean){
	const supabase = await createClient()

	await supabase.from("buses").update({is_active:to_set}).eq("location_id",location_id)
	return true
}

"use server"

import {createClient} from "@/lib/supabase/server"
import { CreateBusInput, createBusSchema } from "@/lib/validation";
import {  isAdmin } from "./admin";

export async function getBuses(location_id?:string){
	const supabase = await createClient()

	let query =  supabase.from("buses").select("plate_number,pin_hash,name,is_active,id,updated_at,location_id").order("updated_at",{ascending:true});
	if (location_id){
		query = query.eq("location_id",location_id)
	}
	const {data:buses,error} = await query

	if (error) {
    throw new Error(error.message);
  }

  return buses;
}

export async function addBus(data:CreateBusInput){

	const {pin,name,plateNumber,locationId}= createBusSchema.parse(data);
		const admin = await isAdmin()
		if(!admin) throw new Error("No admin detail")


	const supabase = await createClient()

	const {error} = await supabase.from("buses").insert({
		pin_hash: pin,name,plate_number:plateNumber, location_id:locationId,is_active:false, admin_id: admin.id
	})

	if (error){
		throw new Error(error.message)
	}

}

export async function adminDeleteBus(bus_id:string){
	const valid = await isAdmin()
	if (!valid){
		throw new Error("Admin detail not found")
	}
  const supabase = await createClient()

  const {error}= await supabase.from("buses").delete().eq("id",bus_id)
  if (error) throw new Error(error.message)

  
}
export async function adminChangeBusPin(pin:string,bus_id:string){
	const valid = await isAdmin()
	if (!valid){
		throw new Error("Admin detail not found")
	}
  const supabase = await createClient()

   const {error} = await supabase.from("buses").update({pin_hash:pin}).eq("id",bus_id)

    if (error) throw new Error(error.message)

}

export async function activateBus(bus_id:string){
	const supabase = await createClient()

	const busUpdate = await supabase.from("buses").update({is_active:true}).eq("id",bus_id).select("id,is_active,updated_at").single()
	return busUpdate
}

export async function deactivateBus(bus_id:string){
	const supabase = await createClient()

	const busUpdate = await supabase.from("buses").update({is_active:false}).eq("id",bus_id).select("id,is_active,updated_at").single()
	return busUpdate
}




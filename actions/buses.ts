"use server"

import {createClient} from "@/lib/supabase/server"
import { CreateBusInput, createBusSchema } from "@/lib/validation";
import {  isAdmin } from "./admin";
import { getDefaultSession, setDefaultSession, setDriverSession } from "@/lib/auth/session";

export async function getAdminBuses(location_id?:string){
	const admin = await isAdmin()
	if(!admin){
		throw new Error("No admin detail found")
	}
	const supabase = await createClient()

	let query =  supabase.from("buses").select("id,plate_number,pin_hash,name,is_active,id,updated_at,location_id").order("updated_at",{ascending:true});
	if (location_id){
		query = query.eq("location_id",location_id)
	}
	const {data:buses,error} = await query

	if (error) {
    throw new Error(error.message);
  }

  return buses;
}

export async function getBuses(location_id?:string){
	const supabase = await createClient()

	let query =  supabase.from("buses").select("id,plate_number,name,is_active,id,updated_at,location_id,locations (name)").order("updated_at",{ascending:true});
	if (location_id){
		query = query.eq("location_id",location_id)
	}
	const {data:buses,error} = await query

	if (error) {
    throw new Error(error.message);
  }

  return buses;
}

export async function getBus(id:string){
	const supabase = await createClient()

	
	const {data:bus,error} = await  supabase.from("buses").select("id,plate_number,name,is_active,id").eq("id",id).single();
 

	if (error) {
    throw new Error(error.message);
  }

  return bus;
}


export async function getBusesLocation(location_id?:string){
	const supabase = await createClient()

	let query =  supabase.from("buses").select("id,plate_number,name,is_active, bus_locations (longitude,latitude,accuracy,recorded_at)").order("recorded_at",{ascending:false});
	if (location_id){
		query = query.eq("location_id",location_id)
	}
	const {data:buses,error} = await query

	if (error) {
    throw new Error(error.message);
  }

  return buses;
}

export async function addBusLocation(bus_id: string, longitude:number, latitude: number, accuracy:number){
	const isValid = await getDefaultSession(bus_id)
	if(!isValid){
		throw new Error("Not logged In")
	}
	const supabase = await createClient()

	
	let {data:bus,error} = await supabase.from("bus_locations").select("id").eq("bus_id", bus_id).single();

	if (error){
		throw new Error("Sorry, unable to get location: "+error.message+"\n Please contact the admin")
	}

	if(bus ){
		await supabase.from("bus_locations").update({longitude, latitude, accuracy, recorded_at: Date.now()}).eq("bus_id", bus_id);
	}else {
				await supabase.from("bus_locations").update({longitude, latitude, accuracy, recorded_at: Date.now()}).eq("bus_id", bus_id);

	}

  
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

	const {error} = await supabase.from("buses").update({is_active:true}).eq("id",bus_id).select("id,is_active,updated_at")
	if (error){
		throw new Error(error.message)
	}
}

export async function deactivateBus(bus_id:string){
	const supabase = await createClient()

	const busUpdate = await supabase.from("buses").update({is_active:false}).eq("id",bus_id).select("id,is_active,updated_at").single()
	return busUpdate
}


export async function logDriverIn(bus_id:string,pin: string){
		let session: string|null|{count:number} = await getDefaultSession(bus_id)
		session = (session ? JSON.parse(session) : {count:0}) as {count:number}

		if (session  ){
			if (session.count >=5){

				throw new Error("To many tries")
			}
		}


		const supabase = await createClient()

		const {data:bus}= await supabase.from("buses").select("id").eq("id",bus_id).eq("pin_hash",pin).single()


		await setDefaultSession(bus_id,JSON.stringify({count:session?.count+1},))
		if(!bus) throw new Error("Incorrect pin");

		await setDriverSession(JSON.stringify({...bus, time: Date.now()}))

}



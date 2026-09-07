"use server"

import {createClient} from "@/lib/superbase/server"

export async function getBuses(){
	const superbase = await createClient()

	const {data,error} = await superbase.from("buses").select("plate,name");

	if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createBus(){
	const superbase = await createClient()

	await superbase.from("buses").insert({})
}
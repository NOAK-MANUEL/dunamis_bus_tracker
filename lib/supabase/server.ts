

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookiStore = await cookies()

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      cookies:{
        getAll(){
          return cookiStore.getAll()
        },

        setAll(cookiesToSet){
          try{
            cookiesToSet.forEach(({name,value,options})=>{
              cookiStore.set(name,value,options)
            })
          }catch{

          }
        }
      }
    }
   
  );
}
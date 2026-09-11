"use client"
import {  CreateBusInput, createBusSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {toast} from "react-toastify"
import Input from "../input";
import LoadingButton from "../loader";
import { Location } from "@/types/database";
import { addBus } from "@/actions/buses";
export default function AddBus({setModal,locations}:{setModal:()=>void,locations:Location[]}){
   const {register,formState:{errors,isSubmitting},reset,handleSubmit} = useForm<CreateBusInput>({
    resolver: zodResolver(createBusSchema),
   
  });

  const submitBus = async (data: CreateBusInput) => {
    try{

      await addBus(data)

    toast.success("Bus added successfully");
    reset();
    setModal();
  }catch(error){
    toast.error(error instanceof Error && error.message)
  }

    // setTimeout(() => setSuccess(""), 3000);
  };
  

  return <form
                onSubmit={handleSubmit(submitBus)}
                className="space-y-4 p-5"
              >
                <Input
                  label="Bus name"
                  placeholder="Dunamis Bus 05"
                  {...register("name")}
                  error={errors.name?.message}
                />

                <Input
                  label="Plate number"
                  placeholder="ENU-123-AB"
                  {...register("plateNumber")}
                  error={errors.plateNumber?.message}
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Location
                  </label>

                  <select
                    {...register("locationId")}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                  >
                    <option value="" className="bg-[#0b1711]">
                      Select location
                    </option>

                    {locations.map((location) => (
                      <option
                        key={location.id}
                        value={location.id}
                        className="bg-[#0b1711]"
                      >
                        {location.name}
                      </option>
                    ))}
                  </select>

                  {errors.locationId && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.locationId.message}
                    </p>
                  )}
                </div>

                <Input
                  label="Driver PIN"
                  type="password"
                  inputMode="numeric"
                  
                  placeholder="••••"
                  {...register("pin")}
                  error={errors.pin?.message}
                />

                <LoadingButton
                  type="submit"
                  loading={isSubmitting}
                >
                  Add bus
                </LoadingButton>
              </form>
}
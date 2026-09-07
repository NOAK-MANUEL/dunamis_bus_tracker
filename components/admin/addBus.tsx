"use client"
import { BusForm, busSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {toast} from "react-toastify"
import Input from "../input";
import LoadingButton from "../loader";
export default function AddBus({setModal}:{setModal:()=>void}){
   const {register,formState:{errors,isSubmitting},reset,handleSubmit} = useForm<BusForm>({
    resolver: zodResolver(busSchema),
   
  });
  const submitBus = async (data: BusForm) => {
    console.log(data);

    // Temporary loading UI until backend is connected.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Bus added successfully");
    reset();
    setModal();

    // setTimeout(() => setSuccess(""), 3000);
  };
  const locations = [
  { id: "1", name: "Enugu", buses: 8, live: 7 },
  { id: "2", name: "Abuja", buses: 7, live: 6 },
  { id: "3", name: "Nsukka", buses: 5, live: 5 },
  { id: "4", name: "Onitsha", buses: 6, live: 5 },
  { id: "5", name: "Lagos", buses: 5, live: 4 },
  { id: "6", name: "Ibadan", buses: 4, live: 2 },
];

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
                    {...register("location")}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                  >
                    <option value="" className="bg-[#0b1711]">
                      Select location
                    </option>

                    {locations.map((location) => (
                      <option
                        key={location.id}
                        value={location.name}
                        className="bg-[#0b1711]"
                      >
                        {location.name}
                      </option>
                    ))}
                  </select>

                  {errors.location && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <Input
                  label="Driver PIN"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
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
"use client"

import { useForm } from "react-hook-form";
import Input from "../input"
import { LocationForm, locationSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {toast} from "react-toastify"
import LoadingButton from "../loader";

export default function AddLocation({closeModal}:{closeModal:()=>void}){


  const {handleSubmit,register,reset,formState:{isSubmitting,errors}} = useForm<LocationForm>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

 

  

  const submitLocation = async (data: LocationForm) => {
    console.log(data);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Location added successfully");
    reset();
    closeModal();

    // setTimeout(() => setSuccess(""), 3000);
  };

  return  <form
                onSubmit={handleSubmit(submitLocation)}
                className="space-y-4 p-5"
              >
                <Input
                  label="Location name"
                  placeholder="Enugu"
                  {...register("name")}
                  error={errors.name?.message}
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Description
                  </label>

                  <textarea
                    {...register("description")}
                    placeholder="Dunamis buses operating around Enugu..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-emerald-400/50"
                  />

                  {errors.description && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <LoadingButton
                  type="submit"
                  loading={isSubmitting}
                >
                  Add location
                </LoadingButton>
              </form>
}
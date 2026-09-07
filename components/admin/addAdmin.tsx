import { AdminForm, adminSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LoadingButton from "../loader";
import {toast} from "react-toastify"
import Input from "../input";
export default function AddAdmin({closeModal}:{closeModal:()=>void}){
   const {handleSubmit, formState:{isSubmitting,errors}, register,reset} = useForm<AdminForm>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

 const submitAdmin = async (data: AdminForm) => {
    console.log(data);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Admin added successfully");
    reset();
    closeModal();

    // setTimeout(() => setSuccess(""), 3000);
  };

  return  <form
                onSubmit={handleSubmit(submitAdmin)}
                className="space-y-4 p-5"
              >
                <Input
                  label="Full name"
                  placeholder="John Doe"
                  {...register("name")}
                  error={errors.name?.message}
                />

                <Input
                  label="Email address"
                  type="email"
                  placeholder="admin@example.com"
                  {...register("email")}
                  error={errors.email?.message}
                />

              <Input
                  label="Password"
                  type="password"
                  placeholder="******"
                  {...register("password")}
                  error={errors.password?.message}
                />  

                 <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="******"
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                />              

                <LoadingButton
                  type="submit"
                  loading={isSubmitting}
                >
                  Add admin
                </LoadingButton>
              </form>


}
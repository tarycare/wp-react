import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const isDev = process.env.NODE_ENV === "development";
const baseUrl = isDev ? "http://mytest.local" : "";

// Validation schema
const FormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string(),
});

function AddOrUpdateStaff({ onSuccess }: any) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "",
    },
  });

  const navigate = useNavigate();
  const { id } = useParams(); // Get user ID from the URL params
  const isUpdating = Boolean(id); // Check if this is an update operation

  useEffect(() => {
    if (isUpdating) {
      // Fetch the user data to prefill the form
      const fetchUserData = async () => {
        try {
          const response = await fetch(`
            ${baseUrl}/wp-json/doc/v1/users/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await response.json();
          form.setValue("username", data.username);
          form.setValue("email", data.email);
          form.setValue("role", data.role); // Set the existing role data
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      fetchUserData();
    }
  }, [isUpdating, id, form]);

  const onSubmit = async (values: any) => {
    try {
      const apiUrl = isUpdating
        ? `${baseUrl}/wp-json/doc/v1/update-staff/${id}`
        : `${baseUrl}/wp-json/doc/v1/add-staff`;
      const method = isUpdating ? "POST" : "POST";

      const response = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        onSuccess();
        navigate("/"); // Redirect to the user list page
      } else {
        console.error("Failed to process user");
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div className=" mx-auto mt-8">
      <div className="max-w-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter username"
                      {...field}
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter role" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="default" className="w-full mt-6">
              {isUpdating ? "Update Staff" : "Add Staff"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AddOrUpdateStaff;

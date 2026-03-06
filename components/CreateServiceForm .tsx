"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const CreateServiceForm  = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/service", {
        method: "POST",
        body: new URLSearchParams(form),
      });

      if (!res.ok) throw new Error();

      toast.success("Service created ✂️");

      router.push("/dashboard/admin/service");
      router.refresh();
    } catch {
      toast.error("Failed to create service");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Create Service</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
            <Input name="name" placeholder="Service name" onChange={handleChange} />

            <Textarea
                name="description"
                placeholder="Description"
                onChange={handleChange}
            />

            <Input
                name="price"
                type="number"
                placeholder="Price"
                onChange={handleChange}
            />

            <Input
                name="duration"
                type="number"
                placeholder="Duration (minutes)"
                onChange={handleChange}
            />

            <Input
                name="category"
                placeholder="Category"
                onChange={handleChange}
            />

            <div className="w-full flex justify-end gap-3 pt-4">
                <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/admin/service")}
                >
                    Cancel
                </Button>

                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Service"}
                </Button>
            </div>

            
        </CardContent>
    </Card>
  )
}

export default CreateServiceForm 
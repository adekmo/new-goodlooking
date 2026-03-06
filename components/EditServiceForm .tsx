"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Props {
  service: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    category: string;
  };
}

const EditServiceForm  = ({ service }: Props) => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: service.name,
    description: service.description ?? "",
    price: service.price.toString(),
    duration: service.duration.toString(),
    category: service.category,
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

      const res = await fetch(`/api/admin/service/${service.id}`, {
        method: "POST",
        body: new URLSearchParams(form),
      });

      if (!res.ok) throw new Error();

      toast.success("Service updated ✂️");

      router.push("/dashboard/admin/service");
      router.refresh();
    } catch {
      toast.error("Failed to update service");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Edit Service</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
            <Input
                name="name"
                value={form.name}
                onChange={handleChange}
            />

            <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
            />

            <Input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
            />

            <Input
                name="duration"
                type="number"
                value={form.duration}
                onChange={handleChange}
            />

            <Input
                name="category"
                value={form.category}
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
                    {loading ? "Updating..." : "Update Service"}
                </Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default EditServiceForm 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

const CreateStylistForm = () => {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {

      const res = await fetch("/api/admin/stylist", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("Stylist berhasil dibuat");

      router.push("/dashboard/admin/stylist");

      router.refresh();

    } catch (error) {

      toast.error("Gagal membuat stylist");

    } finally {

      setLoading(false);

    }
  };

  return (
    <Card>

      <CardHeader>
        <h1 className="text-xl font-bold">Add Stylist</h1>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input name="name" required />
          </div>

          <div>
            <Label>Specialization</Label>
            <Input name="specialization" required />
          </div>

          <div>
            <Label>Experience</Label>
            <Input name="experience" type="number" required />
          </div>

          <Button disabled={loading}>
            {loading ? "Creating..." : "Create Stylist"}
          </Button>

        </form>

      </CardContent>

    </Card>
  );
};

export default CreateStylistForm;
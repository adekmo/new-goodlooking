"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

type Stylist = {
  id: string;
  name: string;
  specialization: string;
  experience: number;
};

const EditStylistForm = ({ stylist }: { stylist: Stylist }) => {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {

      const res = await fetch(`/api/admin/stylist/${stylist.id}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("Stylist berhasil diupdate");

      router.push("/dashboard/admin/stylist");

      router.refresh();

    } catch (error) {

      toast.error("Gagal update stylist");

    } finally {

      setLoading(false);

    }
  };

  return (
    <Card>

      <CardHeader>
        <h1 className="text-xl font-bold">
          Edit Stylist
        </h1>
      </CardHeader>

      <CardContent>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <Label>Name</Label>
            <Input
              name="name"
              defaultValue={stylist.name}
              required
            />
          </div>

          <div>
            <Label>Specialization</Label>
            <Input
              name="specialization"
              defaultValue={stylist.specialization}
              required
            />
          </div>

          <div>
            <Label>Experience</Label>
            <Input
              name="experience"
              type="number"
              defaultValue={stylist.experience}
              required
            />
          </div>

          <Button disabled={loading}>
            {loading ? "Updating..." : "Update Stylist"}
          </Button>

        </form>

      </CardContent>

    </Card>
  );
};

export default EditStylistForm;
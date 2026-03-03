"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CreateSalonForm = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
    image: "",
    openTime: "",
    closeTime: "",
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

      const res = await fetch("/api/superadmin/salons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success("Salon created successfully 🚀");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to create salon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">
          + Add Salon
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Salon</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input name="name" placeholder="Salon Name" onChange={handleChange} />
          <Input name="address" placeholder="Address" onChange={handleChange} />
          <Input name="phone" placeholder="Phone" onChange={handleChange} />
          <Textarea name="description" placeholder="Description" onChange={handleChange} />
          <Input name="openTime" placeholder="Open Time (08:00)" onChange={handleChange} />
          <Input name="closeTime" placeholder="Close Time (20:00)" onChange={handleChange} />

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Salon"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSalonForm;
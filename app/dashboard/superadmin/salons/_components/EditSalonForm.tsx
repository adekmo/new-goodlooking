'use client';

import { SalonType } from "@/types/salon";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

interface Props {
    salon: SalonType;
}

const EditSalonForm = ({ salon }: Props) => {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: salon.name,
        address: salon.address,
        phone: salon.phone,
        description: salon.description,
        image: salon.image || "",
        openTime: salon.openTime,
        closeTime: salon.closeTime,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/superadmin/salons/${salon.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error();

            toast.success("Salon updated successfully 🚀");
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("Failed to update salon");
        } finally {
        setLoading(false);
        }
    };
    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Edit</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Salon</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Salon Name" />
          <Input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
          <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
          <Input name="openTime" value={form.openTime} onChange={handleChange} placeholder="Open Time" />
          <Input name="closeTime" value={form.closeTime} onChange={handleChange} placeholder="Close Time" />

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditSalonForm
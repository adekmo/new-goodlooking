"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormState {
  name: string;
  address: string;
  phone: string;
  description: string;
  image: string;
  openTime: string;
  closeTime: string;
}

const CreateSalonForm = () => {

    const router = useRouter();

    const [form, setForm] = useState<FormState>({
        name: "",
        address: "",
        phone: "",
        description: "",
        image: "",
        openTime: "",
        closeTime: "",
    });

    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/superadmin/salons", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        });

        if (res.ok) {
        router.refresh();
        setForm({
            name: "",
            address: "",
            phone: "",
            description: "",
            image: "",
            openTime: "",
            closeTime: "",
        });
        }

        setLoading(false);
    };
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border p-4 rounded-lg"
    >
      <h2 className="font-semibold">Create Salon</h2>

      <input
        name="name"
        placeholder="Salon Name"
        value={form.name}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />

      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />

      <input
        name="image"
        placeholder="Image URL (optional)"
        value={form.image}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        name="openTime"
        placeholder="Open Time (08:00)"
        value={form.openTime}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />

      <input
        name="closeTime"
        placeholder="Close Time (20:00)"
        value={form.closeTime}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Salon"}
      </button>
    </form>
  )
}

export default CreateSalonForm
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type Availability = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

const AvailabilityForm = ({stylistId,availability,}: {stylistId: string; availability: Availability[];}) => {

  const router = useRouter();

  const [schedule, setSchedule] = useState(
    days.map((day, index) => {
      const found = availability.find((a) => a.dayOfWeek === index);

      return {
        dayOfWeek: index,
        active: !!found,
        startTime: found?.startTime || "09:00",
        endTime: found?.endTime || "18:00",
      };
    })
  );

  const handleToggle = (index: number) => {
    setSchedule((prev) =>
      prev.map((d, i) =>
        i === index ? { ...d, active: !d.active } : d
      )
    );
  };

  const handleChange = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSchedule((prev) =>
      prev.map((d, i) =>
        i === index ? { ...d, [field]: value } : d
      )
    );
  };

  const handleSave = async () => {

    try {

      const activeSchedule = schedule.filter((d) => d.active);

      const res = await fetch(
        `/api/admin/stylist/${stylistId}/availability`,
        {
          method: "POST",
          body: JSON.stringify(activeSchedule),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Availability updated");

      router.refresh();

    } catch {

      toast.error("Failed to update availability");

    }
  };
  return (
    <div className="space-y-4">

      <h1 className="text-xl font-bold">
        Stylist Availability
      </h1>

      {schedule.map((d, i) => (

        <div
          key={i}
          className="flex items-center gap-4 border p-3 rounded-lg"
        >

          <Switch
            checked={d.active}
            onCheckedChange={() => handleToggle(i)}
          />

          <div className="w-28 font-medium">
            {days[i]}
          </div>

          {d.active && (
            <>
              <Input
                type="time"
                value={d.startTime}
                onChange={(e) =>
                  handleChange(i, "startTime", e.target.value)
                }
              />

              <Input
                type="time"
                value={d.endTime}
                onChange={(e) =>
                  handleChange(i, "endTime", e.target.value)
                }
              />
            </>
          )}

        </div>
      ))}

      <Button onClick={handleSave}>
        Save Schedule
      </Button>

    </div>
  )
}

export default AvailabilityForm
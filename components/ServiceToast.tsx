"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const ServiceToast = () => {

  const params = useSearchParams();

  useEffect(() => {
    if (params.get("created")) {
      toast.success("Service created successfully");
    }
  }, [params]);
  return null;
}

export default ServiceToast
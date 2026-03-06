/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"

type Stylist = {
  id: string
  name: string
}

type Service = {
  id: string
  name: string
  price: number
  duration: number
}

type Salon = {
  id: string
  stylists: Stylist[]
  services: Service[]
}

type Slot = {
  time: string
  available: boolean
}

const BookingForm = ({ salon }: { salon: Salon }) => {

  const [stylistId, setStylistId] = useState("")
  const [date, setDate] = useState("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedTime, setSelectedTime] = useState("")
  const [mounted, setMounted] = useState(false)

    useEffect(() => {
    setMounted(true)
    }, [])

  const toggleService = (id: string) => {

    setSelectedServices((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    )
  }

  useEffect(() => {

    console.log({
        stylistId,
        date,
        selectedServices
    })

    if (!stylistId || !date || selectedServices.length === 0) return

    const controller = new AbortController()

    async function fetchSlots() {

      try {

        const res = await fetch(
          `/api/booking/slots?stylistId=${stylistId}&date=${date}&serviceIds=${selectedServices.join(",")}`,
          { signal: controller.signal }
        )

        if (!res.ok) return

        const data: Slot[] = await res.json()

        setSlots(data)

      } catch {
        // ignore abort error
      }
    }

    fetchSlots()

    return () => controller.abort()

  }, [stylistId, date, selectedServices])

  if (!mounted) return null

  return (
    <form action="/api/booking" method="POST" className="space-y-6">

      <input type="hidden" name="salonId" value={salon.id} />
      <input type="hidden" name="startTime" value={selectedTime} />

      {/* stylist */}
      <Card>
            <CardHeader>
                <CardTitle>Select Stylist</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-3 gap-4">

                {salon.stylists.map((stylist) => (
                <button
                key={stylist.id}
                type="button"
                onClick={() => setStylistId(stylist.id)}
                className={`border rounded-lg p-4 text-left
                ${stylistId === stylist.id ? "border-black" : ""}
                `}
                >
                <div className="font-semibold">{stylist.name}</div>
                </button>
                ))}
            </CardContent>
        </Card>

      {/* services */}
      <Card>

            <CardHeader>
                <CardTitle>Select Services</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">

                {salon.services.map((service) => {
                const selected = selectedServices.includes(service.id)
                return (
                <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                className={`border rounded-lg p-4 text-left
                ${selected ? "border-black bg-muted" : ""}
                `}
                >

                    <div className="font-medium">
                        {service.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {service.duration} mins
                    </div>
                    <Badge className="mt-2">
                        Rp {service.price}
                    </Badge>
                </button>
                )
                })}
            </CardContent>
        </Card>

      {/* date */}
      <Card>
        <CardHeader>
            <CardTitle>Select Date</CardTitle>
        </CardHeader>

        <CardContent>
            <Calendar
                mode="single"
                selected={date ? new Date(date) : undefined}
                onSelect={(d) => {
                    if (!d) return

                    const year = d.getFullYear()
                    const month = String(d.getMonth() + 1).padStart(2, "0")
                    const day = String(d.getDate()).padStart(2, "0")

                    setDate(`${year}-${month}-${day}`)
                }}
            />
        </CardContent>
    </Card>

      {/* slots */}
      {slots.length > 0 && (

        <Card>
            <CardHeader>
                <CardTitle>Available Time</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-4 gap-2">

                {slots.map((slot) => (

                <Button
                type="button"
                key={slot.time}
                variant={selectedTime === slot.time ? "default" : "outline"}
                disabled={!slot.available}
                onClick={() => setSelectedTime(slot.time)}
                >

                {slot.time}

                </Button>

                ))}

            </CardContent>
        </Card>

      )}

      <Card>

            <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
            </CardHeader>

        <CardContent className="space-y-2">

            <p>Stylist: {salon.stylists.find(s => s.id === stylistId)?.name}</p>

            <p>
            Services: {selectedServices.length}
            </p>

            <p>
            Time: {selectedTime || "-"}
            </p>

            </CardContent>

      </Card>

      <Button
        type="submit"
        className="w-full"
        disabled={!selectedTime}
        >
        Create Booking
      </Button>

    </form>
  )
}

export default BookingForm
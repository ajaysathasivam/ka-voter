"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export type Candidate = {
    id?: string
    name: string
    party: string
    flag: string
    profileUrl: string
    description: string
    experience: string
    state: string
    assembly: string
}

type CandidateFormProps = {
  stateData: Record<string, string[]>
  onAdd: (data: Candidate) => void
  onEdit: (data: Candidate) => void
  editingCandidate?: Candidate | null
}

export function CandidateForm({
  stateData,
  onAdd,
  onEdit,
  editingCandidate,
}: CandidateFormProps) {
  const form = useForm<Candidate>({
    defaultValues: {
      name: "",
      party: "",
      flag: "",
      profileUrl: "",
      description: "",
      experience: "",
      state: "",
      assembly: "",
    },
  })

  // Reset form values if editing
  useEffect(() => {
    if (editingCandidate) {
      form.reset(editingCandidate)
    }
  }, [editingCandidate, form])

  const onSubmit = (values: Candidate) => {
    if (editingCandidate) {
      onEdit(values)
    } else {
      onAdd(values)
    }
    form.reset()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {editingCandidate ? "Edit Candidate" : "Add Candidate"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Candidate Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Party */}
            <FormField
              control={form.control}
              name="party"
              rules={{ required: "Party is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party</FormLabel>
                  <FormControl>
                    <Input placeholder="Party" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Flag */}
            <FormField
              control={form.control}
              name="flag"
              rules={{ required: "Flag URL is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flag URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="Flag URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Profile */}
            <FormField
              control={form.control}
              name="profileUrl"
              rules={{ required: "Profile image URL is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="Profile Image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Description is required", minLength: { value: 10, message: "Must be at least 10 characters" } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experience */}
            <FormField
              control={form.control}
              name="experience"
              rules={{ required: "Experience is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Input placeholder="Experience" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State */}
            <FormField
              control={form.control}
              name="state"
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(stateData).map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assembly */}
            <FormField
              control={form.control}
              name="assembly"
              rules={{ required: "Assembly is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assembly</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Assembly" />
                      </SelectTrigger>
                    </FormControl>
                    {/* <SelectContent>
                      {(form.watch("state") &&
                        stateData[form.watch("state")])?.map(
                        (a: string) => (
                          <SelectItem key={a} value={a}>
                            {a}
                          </SelectItem>
                        )
                      )}
                    </SelectContent> */}
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {editingCandidate ? "Update Candidate" : "Add Candidate"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

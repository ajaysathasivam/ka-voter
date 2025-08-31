import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Candidate, TransformedData } from "./candiate-manager";

export default function CandidateForm({ candidate, onSave, stateObj }: { candidate: Candidate | null, onSave: (c: Candidate) => void,stateObj:TransformedData }) {

    const { states, districts, assemblies } = stateObj;
    const form = useForm<Candidate>({
        defaultValues: candidate || {
            name: "",
            party: "",
            flag: "",
            profileUrl: "",
            description: "",
            experience: "",
            state: "",
            district: "",
            assembly: "",
        },
    });

    useEffect(() => { form.reset(candidate || form.getValues()); }, [candidate]);

    const filteredDistricts = useMemo(() => {
        return districts.filter(d => d.stateId === form.getValues("state"));
    }, [form.watch("state")]);

    const filteredAssemblies = useMemo(() => {
        return assemblies.filter(a => a.districtId === form.getValues("district"));
    }, [form.watch("district")]);

    const onSubmit = (values: Candidate) => onSave({ ...candidate, ...values });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* Name & Party */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        name="name"
                        control={form.control}
                        rules={{ required: "Name required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="party"
                        control={form.control}
                        rules={{ required: "Party required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Party</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Flag & Profile URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        name="flag"
                        control={form.control}
                        rules={{ required: "Flag URL required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Flag URL</FormLabel>
                                <FormControl>
                                    <Input type="url" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="profileUrl"
                        control={form.control}
                        rules={{ required: "Profile URL required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile URL</FormLabel>
                                <FormControl>
                                    <Input type="url" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Description */}
                <FormField
                    name="description"
                    control={form.control}
                    rules={{ required: "Description required" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Experience */}
                <FormField
                    name="experience"
                    control={form.control}
                    rules={{ required: "Experience required" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Experience</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* State, District & Assembly */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* State */}
                    <FormField
                        name="state"
                        control={form.control}
                        rules={{ required: "State required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Controller
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={(val) => {
                                                    field.onChange(val);
                                                    form.setValue("district", "");
                                                    form.setValue("assembly", "");
                                                }}
                                                value={field.value || ""}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select State" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {states.map((s) => (
                                                        <SelectItem key={s.id} value={s.id}>
                                                            {s.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* District */}
                    <FormField
                        name="district"
                        control={form.control}
                        rules={{ required: "District required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>District</FormLabel>
                                <FormControl>
                                    <Controller
                                        control={form.control}
                                        name="district"
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={(val) => {
                                                    field.onChange(val);
                                                    form.setValue("assembly", "");
                                                }}
                                                value={field.value || ""}
                                                disabled={!form.getValues("state")}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={form.getValues("state") ? "Select District" : "Select state first"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredDistricts.map((d) => (
                                                        <SelectItem key={d.id} value={d.id}>
                                                            {d.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Assembly */}
                    <FormField
                        name="assembly"
                        control={form.control}
                        rules={{ required: "Assembly required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assembly</FormLabel>
                                <FormControl>
                                    <Controller
                                        control={form.control}
                                        name="assembly"
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ""}
                                                disabled={!form.getValues("district")}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={form.getValues("district") ? "Select Assembly" : "Select district first"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredAssemblies.map((a) => (
                                                        <SelectItem key={a.id} value={a.id}>
                                                            {a.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full mt-2">
                    {candidate ? "Update" : "Add"} Candidate
                </Button>
            </form>
        </Form>
    );
}

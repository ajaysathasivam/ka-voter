"use client"

import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import apiCall from "@/api/apiCall";
import { API_URL } from "@/lib/common";
import CandidateForm from "./candidate-form";


export type Candidate = {
    _id?: string;
    name: string;
    party: string;
    flag: string;
    profileUrl: string;
    description: string;
    experience: string;
    state: string;
    district: string;
    assembly: string;
    assemblyName: string;
    stateName: string;
    districtName: string;
};


// Input types from API
interface AssemblyAPI {
    _id: string;
    name: string;
}

interface DistrictAPI {
    _id: string;
    name: string;
    assemblies: AssemblyAPI[];
}

interface StateAPI {
    _id: string;
    name: string;
    districts: DistrictAPI[];
}

// Output types for form
interface StateOption {
    id: string;
    name: string;
}

interface DistrictOption {
    id: string;
    name: string;
    stateId: string;
}

interface AssemblyOption {
    id: string;
    name: string;
    districtId: string;
}

export interface TransformedData {
    states: StateOption[];
    districts: DistrictOption[];
    assemblies: AssemblyOption[];
}

// Transform function with types
const tranformStates = (data: StateAPI[]): TransformedData => {
    const states: StateOption[] = [];
    const districts: DistrictOption[] = [];
    const assemblies: AssemblyOption[] = [];

    data.forEach((state) => {
        states.push({ id: state._id, name: state.name });

        state.districts.forEach((d) => {
            districts.push({ id: d._id, name: d.name, stateId: state._id });

            d.assemblies.forEach((a) => {
                assemblies.push({ id: a._id, name: a.name, districtId: d._id });
            });
        });
    });

    return { states, districts, assemblies };
};

export default function CandidateManager() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
    const [showSheet, setShowSheet] = useState(false);
    const [states, setStates] = useState<TransformedData>()
    const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const res = await apiCall({ url: `${API_URL}/api/admin/all-candidates`, method: "GET" });
            console.log(res, "api")
            if (res.success) setCandidates(res.data || []);
        } catch (err) {
            toast("Failed to fetch candidates");
        } finally {
            setLoading(false);
        }
    };

    const fetchStates = async () => {
        try {
            const res = await apiCall({
                url: `${API_URL}/api/admin/states`,
                method: "GET",
            });
            const response = res;
            const data = tranformStates(response)
            setStates(data)
        } catch (err) {
            console.error(err);
            toast("Failed to fetch states.");
        }
    };

    useEffect(() => { fetchCandidates(); fetchStates(); }, []);

    // Add or Edit
    const handleSave = async (candidate: Candidate) => {
        try {
            const method = candidate._id ? "PUT" : "POST";

            const url = candidate._id ? `${API_URL}/api/admin/add-candidate/${candidate._id}` : `${API_URL}/api/admin/add-candidate`;
            const res = await apiCall({ url, method, body: candidate });
            console.log(candidate, 'id', url, res)
            if (res.success) {
                toast(`Candidate ${candidate._id ? "updated" : "added"} successfully`);
                setShowSheet(false);
                setEditingCandidate(null);
                fetchCandidates();
            } else {
                toast(`${res.message} `);
            }
        } catch (err) {
            console.log(err, "Api add canditate error catch block")
            toast(`Error occurred`);
        }
    };

    // Delete
    const handleDelete = async (id: string) => {
        try {
            const res = await apiCall({ url: `${API_URL}/api/admin/candidates/${id}`, method: "DELETE" });
            console.log(res, "test")
            if (res.success) {
                toast("Candidate deleted");
                fetchCandidates();
            } else {
                toast(res.message || "Failed to delete");
            }
        } catch (err) {
            toast("Error deleting candidate");
        }
    };

    return (
        <div className="space-y-4">
            {/* Add Candidate Sheet Trigger */}
            <Sheet open={showSheet} onOpenChange={setShowSheet}>
                <SheetTrigger asChild>
                    <Button onClick={() => setEditingCandidate(null)}>Add Candidate</Button>
                </SheetTrigger>
                <SheetContent className="w-[1200px] min-w-[800px] px-4 max-w-none border">
                    <SheetHeader>
                        <SheetTitle>{editingCandidate ? "Edit Candidate" : "Add Candidate"}</SheetTitle>
                    </SheetHeader>
                    <CandidateForm stateObj={states} candidate={editingCandidate} onSave={handleSave} />
                </SheetContent>
            </Sheet>

            {/* Candidate Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Candidate List</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full table-auto border-collapse border border-slate-200">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="border px-2 py-1">Name</th>
                                <th className="border px-2 py-1">Party</th>
                                <th className="border px-2 py-1">State</th>
                                <th className="border px-2 py-1">District</th>
                                <th className="border px-2 py-1">Assembly</th>
                                <th className="border px-2 py-1">Description</th>
                                <th className="border px-2 py-1">Experience</th>
                                <th className="border px-2 py-1">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map((c) => (
                                <tr key={c._id} className="hover:bg-slate-50">
                                    <td className="border px-2 py-1">{c.name}</td>
                                    <td className="border px-2 py-1">{c.party}</td>
                                    <td className="border px-2 py-1">{c.stateName}</td>
                                    <td className="border px-2 py-1">{c.districtName}</td>
                                    <td className="border px-2 py-1">{c.assemblyName}</td>
                                    <td className="border px-2 py-1">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <span className="truncate block max-w-[150px]">{c.description}</span>
                                                </TooltipTrigger>
                                                <TooltipContent>{c.description}</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </td>
                                    <td className="border px-2 py-1">{c.experience}</td>
                                    <td className="border px-2 py-1 flex gap-2">
                                        <Button size="sm" onClick={() => { setEditingCandidate(c); setShowSheet(true); }}>Edit</Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="destructive">Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogAction onClick={() => handleDelete(c._id!)}>Yes, Delete</AlertDialogAction>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
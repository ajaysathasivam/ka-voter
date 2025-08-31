"use client"

import React, { useEffect, useState } from "react";
import apiCall from "@/api/apiCall";
import { API_URL } from "@/lib/common";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function VoteCountPage() {
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [assemblies, setAssemblies] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [filters, setFilters] = useState({ stateId: "", districtId: "", assemblyId: "" });

    const fetchStates = async () => {
        const res = await apiCall({ url: `${API_URL}/api/admin/states`, method: "GET" });
        setStates(res);
    };

    useEffect(() => { fetchStates(); }, []);

    useEffect(() => {
        if (filters.stateId) {
            const state = states.find(s => s._id === filters.stateId);
            setDistricts(state ? state.districts : []);
            setFilters(prev => ({ ...prev, districtId: "", assemblyId: "" }));
            setAssemblies([]);
        }
    }, [filters.stateId]);

    useEffect(() => {
        if (filters.districtId) {
            const district = districts.find(d => d._id === filters.districtId);
            setAssemblies(district ? district.assemblies : []);
            setFilters(prev => ({ ...prev, assemblyId: "" }));
        }
    }, [filters.districtId]);

    const fetchVotes = async () => {
        const query = new URLSearchParams();
        if (filters.stateId) query.append("stateId", filters.stateId);
        if (filters.districtId) query.append("districtId", filters.districtId);
        if (filters.assemblyId) query.append("assemblyId", filters.assemblyId);

        const res = await apiCall({ url: `${API_URL}/api/admin/vote-count?${query.toString()}`, method: "GET" });
        setCandidates(res);
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Vote Count by Candidate</h1>

            <div className="flex gap-4">
                {/* State Select */}
                <Select value={filters.stateId} onValueChange={v => setFilters(prev => ({ ...prev, stateId: v }))}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                        {states.map(s => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                    </SelectContent>
                </Select>

                {/* District Select */}
                <Select value={filters.districtId} onValueChange={v => setFilters(prev => ({ ...prev, districtId: v }))}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                        {districts.map(d => <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>)}
                    </SelectContent>
                </Select>

                {/* Assembly Select */}
                <Select value={filters.assemblyId} onValueChange={v => setFilters(prev => ({ ...prev, assemblyId: v }))}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select Assembly" />
                    </SelectTrigger>
                    <SelectContent>
                        {assemblies.map(a => <SelectItem key={a._id} value={a._id}>{a.name}</SelectItem>)}
                    </SelectContent>
                </Select>

                <Button onClick={fetchVotes}>Fetch Votes</Button>
            </div>

            <div className="mt-4">
                {candidates.length === 0 ? (
                    <p>No results found.</p>
                ) : (
                    <table className="min-w-full border">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Candidate</th>
                                <th className="border px-4 py-2">Party</th>
                                <th className="border px-4 py-2">Votes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map(c => (
                                <tr key={c.candidateId}>
                                    <td className="border px-4 py-2">{c.name}</td>
                                    <td className="border px-4 py-2">{c.party}</td>
                                    <td className="border px-4 py-2">{c.votes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

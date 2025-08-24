"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function VoterInfoPage() {
    const [states, setStates] = useState<string[]>(["Uttar Pradesh", "Bihar", "Maharashtra"]);
    const [assemblies, setAssemblies] = useState<string[]>([]);

    const [selectedState, setSelectedState] = useState("");
    const [selectedAssembly, setSelectedAssembly] = useState("");

    const [candidates, setCandidates] = useState<any[]>([]);
    const [filteredCandidates, setFilteredCandidates] = useState<any[]>([]);

    // Fetch assemblies based on selected state
    useEffect(() => {
        if (selectedState) {
            // Mock: Replace with actual API call
            const data = {
                "Uttar Pradesh": ["Lucknow", "Varanasi", "Kanpur"],
                Bihar: ["Patna", "Gaya", "Muzaffarpur"],
                Maharashtra: ["Mumbai", "Pune", "Nagpur"],
            };
            setAssemblies(data[selectedState] || []);
            setSelectedAssembly(""); // reset assembly
        }
    }, [selectedState]);

    // Fetch candidates
    const fetchCandidates = async () => {
        if (!selectedState || !selectedAssembly) {
            toast("Please select state and assembly first.");
            return;
        }

        // TODO: Replace with actual API call
        // Simulate fetch
        const mockData = [
            {
                id: "ravi-singh",
                name: "Ravi Singh",
                party: "Party A",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Flag_of_India.svg/1200px-Flag_of_India.svg.png",
                profileUrl: "/public/profile.jpg",
                description: "Focused on youth employment and digital India initiatives.",
                experience: "5 years as MLA, former IT Minister",
            },
            {
                id: "neha-verma",
                name: "Neha Verma",
                party: "Party B",
                flag: "https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_B.png",
                profileUrl: "/public/profile.jpg",
                description: "Works on women empowerment and education reform.",
                experience: "2-term MLA, Chairperson of Women’s Welfare",
            },
            {
                id: "amit-kumar",
                name: "Amit Kumar",
                party: "Independent",
                flag: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Independent_flag.png",
                profileUrl: "/public/profile.jpg",
                description: "Committed to transparency and local development.",
                experience: "Social worker, 10 years of community service",
            },
        ];



        setCandidates(mockData);
        setFilteredCandidates(mockData);
        toast("Candidates loaded",);
    };

    const handleSearchCandidate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value.toLowerCase();

        const filtered = candidates.filter((c) =>
            c.name.toLowerCase().includes(keyword) ||
            c.party.toLowerCase().includes(keyword)
        );

        setFilteredCandidates(filtered);
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-4 py-12 bg-gray-50">
            <div className="w-full max-w-xl space-y-6">
                <h1 className="text-2xl font-bold text-gray-800 text-center">Select Your Voting Region</h1>

                {/* State Dropdown */}
                <div >
                    <label className="block mb-1 text-sm">Select State</label>
                    <Select onValueChange={setSelectedState}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                            {states.map((state) => (
                                <SelectItem key={state} value={state}>
                                    {state}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Assembly Dropdown */}
                <div>
                    <label className="block mb-1 text-sm">Select Assembly</label>
                    <Select
                        onValueChange={setSelectedAssembly}
                        disabled={!selectedState}
                        value={selectedAssembly || undefined}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={selectedState ? "Select Assembly" : "Select state first"} />
                        </SelectTrigger>
                        <SelectContent>
                            {assemblies.map((assembly) => (
                                <SelectItem key={assembly} value={assembly}>
                                    {assembly}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Fetch Button */}
                <Button onClick={fetchCandidates} className="w-full bg-[#9e7b7f]">
                    Show Candidates
                </Button>
                {filteredCandidates.length > 0 && <div className="flex justify-end mb-4">
                    <Input
                        type="text"
                        placeholder="Search candidate by name or party..."
                        onChange={(e) => handleSearchCandidate(e)}
                        className="max-w-sm"
                    />
                </div>}

                {filteredCandidates.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 mt-6">
                        {filteredCandidates.map((candidate, idx) => (
                            <Card key={idx} className="p-4 shadow">
                                <div className="flex items-center gap-4">
                                    {/* Party Flag or Candidate Image */}
                                    <img
                                        src={candidate.flag}
                                        alt={`${candidate.name} flag`}
                                        className="w-14 h-14 rounded-md object-cover border"
                                    />

                                    {/* Candidate Info */}
                                    <div className="flex flex-col">
                                        <a
                                            href={candidate.profileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lg font-semibold text-blue-600 hover:underline"
                                        >
                                            {candidate.name}
                                        </a>
                                        <p className="text-sm text-gray-600">Party: {candidate.party}</p>
                                        <p className="text-sm text-gray-500">{candidate.description}</p>
                                        <p className="text-xs text-gray-400 mt-1 italic">{candidate.experience}</p>
                                    </div>
                                </div>
                                <Link className="w-full bg-[#9e7b7f] text-center rounded-lg py-2 hover:bg-[#8b6b6f] text-white" href={`/vote/${candidate.id}`}>View Candidate</Link>
                            </Card>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

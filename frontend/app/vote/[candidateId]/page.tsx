"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function CandidateVotePage() {
    const { candidateId } = useParams();
    const router = useRouter();

    const [candidate, setCandidate] = useState<any>(null);

    // User input
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [voterId, setVoterId] = useState("");

    useEffect(() => {
        // Replace with real fetch by candidateId
        const mockCandidates = [
            {
                id: "ravi-singh",
                name: "Ravi Singh",
                party: "Party A",
                flag: "https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_India.svg",
                description: "Youth and digital empowerment",
                experience: "5 years as MLA",
            },
            {
                id: "neha-verma",
                name: "Neha Verma",
                party: "Party B",
                flag: "https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_B.png",
                description: "Women’s education and equality",
                experience: "2-term MLA",
            },
        ];

        const found = mockCandidates.find((c) => c.id === candidateId);
        setCandidate(found);
    }, [candidateId]);

    const handleVote = () => {
        if ( !voterId) {
            toast.error("Please fill in all details before voting.");
            return;
        }

        // Simulate API call to record vote
        console.log("Vote submitted:", {
            candidateId,
            user: { name, phone, voterId },
        });

        // Simulate delay then redirect
        setTimeout(() => {
            router.push("/vote/success");
        }, 800);
    };

    if (!candidate) return <p className="p-6 text-center">Loading candidate info...</p>;

    return (
        <div className="min-h-screen p-6 flex flex-col items-center bg-gray-50">
            <Card className="w-full max-w-xl p-6 space-y-4 shadow-lg">
                <div className="flex items-center gap-4">
                    <img
                        src={candidate.flag}
                        alt={`${candidate.name} flag`}
                        className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                        <h2 className="text-xl font-bold">{candidate.name}</h2>
                        <p className="text-sm text-gray-600">Party: {candidate.party}</p>
                        <p className="text-sm">{candidate.description}</p>
                        <p className="text-xs text-gray-500 italic">{candidate.experience}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    {/* <Label>Your Full Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} required /> */}

                    {/* <Label>Phone Number</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} required /> */}

                    <Label>Voter ID Number</Label>
                    <Input value={voterId} onChange={(e) => setVoterId(e.target.value)} required />
                </div>

                {/* Confirm Vote Dialog */}
                <Dialog >
                    <DialogTitle>   
                        
                    </DialogTitle>
                    <DialogTrigger asChild title="voter">
                        <Button className="w-full bg-[#9e7b7f] hover:bg-[#8b6b6f] text-white">
                            Vote for {candidate.name}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <h3 className="text-lg font-semibold mb-2">Confirm Your Vote</h3>
                        <p>
                            You are voting for <strong>{candidate.name}</strong> from{" "}
                            <strong>{candidate.party}</strong>. This action cannot be undone.
                        </p>
                        <Button onClick={handleVote} className="mt-4 w-full bg-green-600 text-white">
                            Confirm and Submit Vote
                        </Button>
                    </DialogContent>
                </Dialog>
            </Card>
        </div>
    );
}

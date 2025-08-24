"use client"

import { CandidateForm } from '@/components/custom/cantidate-form'
import React, { useState } from 'react'
const stateData = {
    "Uttar Pradesh": ["Lucknow", "Varanasi", "Kanpur"],
    Bihar: ["Patna", "Gaya", "Muzaffarpur"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
}
const initialCandidates = [
    {
        id: "ravi-singh",
        name: "Ravi Singh",
        party: "Party A",
        flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Flag_of_India.svg/1200px-Flag_of_India.svg.png",
        profileUrl: "/public/profile.jpg",
        description: "Focused on youth employment and digital India initiatives.",
        experience: "5 years as MLA, former IT Minister",
        state: "Uttar Pradesh",
        assembly: "Lucknow",
    },
]

export default function page() {
    const [candidates, setCandidates] = useState(initialCandidates)
    const [editingCandidate, setEditingCandidate] = useState(null)

    const handleAdd = (candidate: any) => {
        setCandidates([...candidates, { ...candidate, id: Date.now().toString() }])
    }

    const handleEdit = (updated: any) => {
        setCandidates(candidates.map(c => (c.id === updated.id ? updated : c)))
        setEditingCandidate(null)
    }

    const handleDelete = (id: string) => {
        setCandidates(candidates.filter(c => c.id !== id))
    }
    return (
        <div>
            <CandidateForm
                stateData={stateData}
                onAdd={handleAdd}
                onEdit={handleEdit}
                editingCandidate={editingCandidate}
            />
        </div>
    )
}

'use client'

import { CandidateTable } from '@/components/custom/cantidate-table'
import React, { useState } from 'react'
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

const Page = () => {
  const [candidates, setCandidates] = useState(initialCandidates)
  return (
    <div>
      <CandidateTable
        data={candidates}
      // onEdit={setEditingCandidate}
      // onDelete={handleDelete}
      />
    </div>
  )
}
export default Page
"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { CandidateForm } from "@/components/custom/cantidate-form"
import { CandidateTable } from "@/components/custom/cantidate-table"

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

const stateData = {
  "Uttar Pradesh": ["Lucknow", "Varanasi", "Kanpur"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
}

export default function AdminPage() {
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-col p-6 gap-6">
          <CandidateForm
            stateData={stateData}
            onAdd={handleAdd}
            onEdit={handleEdit}
            editingCandidate={editingCandidate}
          />
          <CandidateTable
            data={candidates}
            // onEdit={setEditingCandidate}
            // onDelete={handleDelete}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

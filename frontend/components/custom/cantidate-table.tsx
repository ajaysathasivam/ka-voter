"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

type Candidate = {
    id: string | number
    name: string
    party: string
    state: string
    assembly: string
}

interface CandidateTableProps {
    data: Candidate[]
    onEdit: (candidate: Candidate) => void
    onDelete: (id: Candidate["id"]) => void
}

export function CandidateTable({ data, onEdit, onDelete }: CandidateTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Assembly</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((c) => (
                    <TableRow key={c.id}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.party}</TableCell>
                        <TableCell>{c.state}</TableCell>
                        <TableCell>{c.assembly}</TableCell>
                        <TableCell className="space-x-2">
                            <Button
                                onClick={() => onEdit(c)}
                                variant="default"
                                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={() => onDelete(c.id)}
                                variant="destructive"
                            >
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

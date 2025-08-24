"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

type Assembly = {
    id: number
    name: string
    state: string
}

type StateItem = {
    id: number
    name: string
}

export default function ManagementPage() {
    // --- States ---
    const [assemblies, setAssemblies] = React.useState<Assembly[]>([
        { id: 1, name: "Assembly 1", state: "State A" },
        { id: 2, name: "Assembly 2", state: "State B" },
    ])
    const [states, setStates] = React.useState<StateItem[]>([
        { id: 1, name: "State A" },
        { id: 2, name: "State B" },
    ])

    // Dialog control
    const [open, setOpen] = React.useState(false)
    const [editMode, setEditMode] = React.useState<"assembly" | "state" | null>(null)
    const [editingItem, setEditingItem] = React.useState<Assembly | StateItem | null>(null)

    // Form state
    const [formName, setFormName] = React.useState("")
    const [formState, setFormState] = React.useState("")

    // --- Handlers ---
    const handleAddAssembly = () => {
        setEditMode("assembly")
        setEditingItem(null)
        setFormName("")
        setFormState("")
        setOpen(true)
    }

    const handleAddState = () => {
        setEditMode("state")
        setEditingItem(null)
        setFormName("")
        setOpen(true)
    }

    const handleEdit = (item: Assembly | StateItem, type: "assembly" | "state") => {
        setEditMode(type)
        setEditingItem(item)
        setFormName(item.name)
        if (type === "assembly") setFormState((item as Assembly).state)
        setOpen(true)
    }

    const handleDelete = (id: number, type: "assembly" | "state") => {
        if (type === "assembly") {
            setAssemblies((prev) => prev.filter((a) => a.id !== id))
        } else {
            setStates((prev) => prev.filter((s) => s.id !== id))
        }
    }

    const handleSave = () => {
        if (editMode === "assembly") {
            if (editingItem) {
                setAssemblies((prev) =>
                    prev.map((a) =>
                        a.id === editingItem.id ? { ...a, name: formName, state: formState } : a
                    )
                )
            } else {
                setAssemblies((prev) => [
                    ...prev,
                    { id: Date.now(), name: formName, state: formState },
                ])
            }
        } else if (editMode === "state") {
            if (editingItem) {
                setStates((prev) =>
                    prev.map((s) => (s.id === editingItem.id ? { ...s, name: formName } : s))
                )
            } else {
                setStates((prev) => [...prev, { id: Date.now(), name: formName }])
            }
        }
        setOpen(false)
    }

    return (
        <div className="p-6 space-y-8">
            {/* Assemblies Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Assemblies</h2>
                    <Button onClick={handleAddAssembly}>Add Assembly</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assemblies.map((assembly) => (
                            <TableRow key={assembly.id}>
                                <TableCell>{assembly.name}</TableCell>
                                <TableCell>{assembly.state}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleEdit(assembly, "assembly")}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(assembly.id, "assembly")}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* States Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">States</h2>
                    <Button onClick={handleAddState}>Add State</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {states.map((state) => (
                            <TableRow key={state.id}>
                                <TableCell>{state.name}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleEdit(state, "state")}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(state.id, "state")}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog for Add/Edit */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem ? "Edit" : "Add"} {editMode === "assembly" ? "Assembly" : "State"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Input
                            placeholder="Enter name"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                        />
                        {editMode === "assembly" && (
                            <Input
                                placeholder="Enter state"
                                value={formState}
                                onChange={(e) => setFormState(e.target.value)}
                            />
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

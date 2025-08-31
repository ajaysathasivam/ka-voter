"use client"

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash, Pencil, Plus } from "lucide-react"; // icons
import apiCall from "@/api/apiCall";
import { API_URL } from "@/lib/common";

export default function StateDistrictAssemblyPage() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        type: "", id: "", parentId: "", stateId: "", districtId: "", name: ""
    });

    const [collapsedStates, setCollapsedStates] = useState({});
    const [collapsedDistricts, setCollapsedDistricts] = useState({});

    const fetchData = async () => {
        const res = await apiCall({ url: `${API_URL}/api/admin/states`, method: 'GET' });

        // Sort alphabetically
        res.sort((a, b) => a.name.localeCompare(b.name));
        res.forEach(s => {
            s.districts.sort((a, b) => a.name.localeCompare(b.name));
            s.districts.forEach(d => d.assemblies.sort((a, b) => a.name.localeCompare(b.name)));
        });

        setData(res);
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let url = API_URL, method = form.id ? "PUT" : "POST", body: any = { name: form.name };

        if (form.type === "state") url = form.id ? `/api/admin/states/${form.id}` : "/api/admin/states";
        if (form.type === "district") {
            url = form.id ? `/api/admin/districts/${form.id}?stateId=${form.stateId}` : "/api/admin/districts";
            if (!form.id) body.stateId = form.parentId;
        }
        if (form.type === "assembly") {
            url = form.id ? `/api/admin/assemblies/${form.id}?stateId=${form.stateId}&districtId=${form.districtId}` : "/api/admin/assemblies";
            if (!form.id) body.districtId = form.parentId;
        }
        const full_url = `${API_URL}${url}`
        console.log(full_url, method, body, "test")

        await apiCall({ url: full_url, method: method, body });
        setOpen(false);
        setForm({ type: "", id: "", parentId: "", stateId: "", districtId: "", name: "" });
        fetchData();
    };

    const handleDelete = async (type, id, stateId?, districtId?) => {
        let url = type === "state" ? `/api/admin/states/${id}`
            : type === "district" ? `/api/admin/districts/${id}?stateId=${stateId}`
                : `/api/admin/assemblies/${id}?stateId=${stateId}&districtId=${districtId}`;

        const full_url = `${API_URL}${url}`
        await apiCall({ url: full_url, method: "DELETE" });
        fetchData();
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">State / District / Assembly Management</h1>
                <Button
                    onClick={() => { setForm({ type: "state", id: "", parentId: "", stateId: "", districtId: "", name: "" }); setOpen(true); }}
                >
                    <Plus size={16} /> Add State
                </Button>
            </div>

            <div className="space-y-4">
                {data.map(state => (
                    <Card key={state._id} className="p-4 shadow-sm">
                        <CardContent>
                            <div className="flex justify-between items-center cursor-pointer" onClick={() => setCollapsedStates({ ...collapsedStates, [state._id]: !collapsedStates[state._id] })}>
                                <h2 className="text-xl font-semibold">{state.name}</h2>
                                <div className="space-x-2">
                                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setForm({ type: 'state', id: state._id, name: state.name }); setOpen(true); }}><Pencil size={14} /></Button>
                                    <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDelete('state', state._id); }}><Trash size={14} /></Button>
                                    <Button size="sm" onClick={(e) => { e.stopPropagation(); setForm({ type: 'district', parentId: state._id, stateId: state._id, name: "" }); setOpen(true); }}><Plus size={14} /> District</Button>
                                </div>
                            </div>

                            {!collapsedStates[state._id] && (
                                <div className="ml-6 mt-3 space-y-3">
                                    {state.districts.map(district => (
                                        <Card key={district._id} className="p-3 bg-gray-50 shadow-sm">
                                            <CardContent>
                                                <div className="flex justify-between items-center cursor-pointer" onClick={() => setCollapsedDistricts({ ...collapsedDistricts, [district._id]: !collapsedDistricts[district._id] })}>
                                                    <h3 className="text-lg">{district.name}</h3>
                                                    <div className="space-x-2">
                                                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setForm({ type: 'district', id: district._id, parentId: state._id, stateId: state._id, name: district.name }); setOpen(true); }}><Pencil size={14} /></Button>
                                                        <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDelete('district', district._id, state._id); }}><Trash size={14} /></Button>
                                                        <Button size="sm" onClick={(e) => { e.stopPropagation(); setForm({ type: 'assembly', parentId: district._id, stateId: state._id, districtId: district._id, name: "" }); setOpen(true); }}><Plus size={14} /> Assembly</Button>
                                                    </div>
                                                </div>

                                                {!collapsedDistricts[district._id] && (
                                                    <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
                                                        {district.assemblies.map(assembly => (
                                                            <li key={assembly._id} className="flex justify-between items-center">
                                                                <span className="bg-gray-200 px-2 py-1 rounded">{assembly.name}</span>
                                                                <div className="space-x-2">
                                                                    <Button size="sm" variant="outline" onClick={() => setForm({ type: "assembly", id: assembly._id, parentId: district._id, stateId: state._id, districtId: district._id, name: assembly.name }) || setOpen(true)}><Pencil size={14} /></Button>
                                                                    <Button size="sm" variant="destructive" onClick={() => handleDelete('assembly', assembly._id, state._id, district._id)}><Trash size={14} /></Button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{form.id ? "Edit" : "Add"} {form.type.charAt(0).toUpperCase() + form.type.slice(1)}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {form.type !== "state" && <p className="text-gray-600 text-sm">Parent: {form.type === "district" ? data.find(s => s._id === form.stateId)?.name : data.find(s => s._id === form.stateId)?.districts.find(d => d._id === form.districtId)?.name}</p>}
                        <Input placeholder="Enter name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { capitalizeFirstLetterOfEachWord } from '@/config';
import { fetchAllQuery } from '@/store/admin/query-slice';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { ArrowUpDown, Download, FileText, Filter, MessageSquare, Eye, Send } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { sendContactUsPageQuery } from '@/store/common-slice';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

const AdminContactQueryViewPage = () => {
    const [openDetailsDialogue, setOpenDetailsDialogue] = useState(false);
    const [sortOrder, setSortOrder] = useState('latest');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedQueryDetails, setSelectedQueryDetails] = useState(null);

    const dispatch = useDispatch();
    const { ContactQuery } = useSelector(state => state.contactQuery);

    useEffect(() => {
        dispatch(fetchAllQuery());
    }, [dispatch]);

    const handleFetchContactQueryDetails = (querySelected) => {
        setSelectedQueryDetails(querySelected);
        setOpenDetailsDialogue(true);
    };

    const convertToCSV = () => {
        const header = ['Email Id', 'Full Name', 'Phone Number', 'QueryMessage', 'Status', 'Created At', 'Updated At'];
        const rows = ContactQuery.map(item => [
            item.QueryDetails['Email Id'],
            item.QueryDetails.FullName,
            item.QueryDetails['Phone Number'],
            item.QueryMessage,
            item.Status,
            item.createdAt,
            item.updatedAt
        ]);
        return [header, ...rows].map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvContent = convertToCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, `Query_Data.csv`);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Query Data', 10, 20);
        doc.setFontSize(9);
        doc.text('Email Id', 10, 30);
        doc.text('Full Name', 60, 30);
        doc.text('Phone', 90, 30);
        doc.text('Status', 170, 30);
        doc.text('Date', 190, 30);

        ContactQuery.forEach((item, index) => {
            const yPos = 40 + (index * 10);
            doc.text(item.QueryDetails['Email Id'] || '', 10, yPos);
            doc.text(item.QueryDetails.FullName || '', 60, yPos);
            doc.text(item.QueryDetails['Phone Number'] || '', 90, yPos);
            doc.text(item.Status || '', 170, yPos);
            doc.text(new Date(item.createdAt).toLocaleDateString(), 190, yPos);
        });
        doc.save('Query_Data.pdf');
    };

    const downloadExcel = () => {
        const rows = ContactQuery.map(item => ({
            'Email Id': item.QueryDetails['Email Id'],
            'Full Name': item.QueryDetails.FullName,
            'Phone Number': item.QueryDetails['Phone Number'],
            'Query Message': item.QueryMessage,
            'Status': item.Status,
            'Created At': item.createdAt,
            'Updated At': item.updatedAt
        }));
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'QueryData');
        XLSX.writeFile(wb, 'Query_Data.xlsx');
    };

    const sortedQueryList = [...(ContactQuery || [])].sort((a, b) => {
        const dateA = new Date(a?.createdAt);
        const dateB = new Date(b?.createdAt);
        return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });

    const filteredQueryList = sortedQueryList.filter(query => {
        if (statusFilter === 'all') return true;
        return query?.Status === statusFilter;
    });

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'Responded': return 'bg-blue-500 hover:bg-blue-600';
            case 'Closed': return 'bg-green-500 hover:bg-green-600';
            default: return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Contact Queries</h1>
                    <p className="text-gray-600 mt-1">Manage customer inquiries and support requests</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={downloadCSV} variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" /> CSV
                    </Button>
                    <Button onClick={downloadPDF} variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" /> PDF
                    </Button>
                    <Button onClick={downloadExcel} variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" /> Excel
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest')}
                            >
                                <ArrowUpDown className="w-4 h-4 mr-2" />
                                {sortOrder === 'latest' ? 'Newest First' : 'Oldest First'}
                            </Button>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Responded">Responded</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Subject/Message</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredQueryList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p>No queries found</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredQueryList.map((query) => (
                                    <TableRow key={query._id} className="hover:bg-gray-50">
                                        <TableCell className="text-gray-600">
                                            {new Date(query?.createdAt).toLocaleDateString()}
                                            <div className="text-xs text-gray-400">
                                                {new Date(query?.createdAt).toLocaleTimeString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-gray-900">{query?.QueryDetails?.FullName}</p>
                                                <p className="text-sm text-gray-500">{query?.QueryDetails?.['Email Id']}</p>
                                                <p className="text-xs text-gray-400">{query?.QueryDetails?.['Phone Number']}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {query?.QueryMessage}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusBadgeColor(query?.Status)} text-white`}>
                                                {query?.Status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleFetchContactQueryDetails(query)}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <Dialog open={openDetailsDialogue} onOpenChange={setOpenDetailsDialogue}>
                {selectedQueryDetails && (
                    <AdminQueryDetailsView
                        query={selectedQueryDetails}
                        onClose={() => setOpenDetailsDialogue(false)}
                    />
                )}
            </Dialog>
        </div>
    );
};

const AdminQueryDetailsView = ({ query, onClose }) => {
    const initialFormData = {
        queryId: query?._id,
        email: '',
        Subject: '',
        status: query?.Status || 'Pending',
        resolvedMessage: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const dispatch = useDispatch();

    const handleSubmitStatus = async (e) => {
        e.preventDefault();
        const data = await dispatch(sendContactUsPageQuery({
            ...formData,
            queryId: query._id,
            email: query?.QueryDetails?.['Email Id']
        }));

        if (data?.payload?.Success) {
            onClose();
        }
    };

    const formatValue = (key, value) => {
        if (key.toLowerCase().includes("date")) {
            return new Date(value).toLocaleString();
        }
        return value;
    };

    return (
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Query Details
                </DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 py-4">
                {/* Query Info Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Customer Info</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-1">
                            <p><span className="font-semibold">Name:</span> {query?.QueryDetails?.FullName}</p>
                            <p><span className="font-semibold">Email:</span> {query?.QueryDetails?.['Email Id']}</p>
                            <p><span className="font-semibold">Phone:</span> {query?.QueryDetails?.['Phone Number']}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Query Info</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-1">
                            <p><span className="font-semibold">ID:</span> {query?._id}</p>
                            <p><span className="font-semibold">Created:</span> {new Date(query?.createdAt).toLocaleString()}</p>
                            <p><span className="font-semibold">Status:</span> <Badge>{query?.Status}</Badge></p>
                        </CardContent>
                    </Card>
                </div>

                {/* Message Content */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-semibold mb-2 text-sm text-gray-700">Message Content</h3>
                    <p className="text-gray-900 whitespace-pre-wrap">{query?.QueryMessage}</p>
                </div>

                <Separator />

                {/* Response Form */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Send Response</h3>

                    <div className="grid gap-2">
                        <Label>Update Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Responded">Responded</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Subject</Label>
                        <Input
                            value={formData.Subject}
                            onChange={(e) => setFormData({ ...formData, Subject: e.target.value })}
                            placeholder="Re: Your inquiry..."
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Response Message</Label>
                        <Textarea
                            value={formData.resolvedMessage}
                            onChange={(e) => setFormData({ ...formData, resolvedMessage: e.target.value })}
                            placeholder="Type your response here..."
                            rows={6}
                        />
                    </div>

                    <Button onClick={handleSubmitStatus} className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        Send Response & Update Status
                    </Button>
                </div>
            </div>
        </DialogContent>
    );
};

export default AdminContactQueryViewPage;

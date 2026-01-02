import { fetchFAQSWebstis, removeFAQById, setFAQSWebstis } from '@/store/common-slice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, X, HelpCircle, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";

const AdminFAQPage = () => {
	const { faqsWebsite } = useSelector(state => state.common);
	const dispatch = useDispatch();
	const { toast } = useToast();
	const [question, setQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	const handleAction = async (action, params) => {
		if (params) {
			await dispatch(action(params));
		} else {
			await dispatch(action());
		}
		dispatch(fetchFAQSWebstis());
	}
	// Handle form submission to add FAQ
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!question || !answer) {
			toast({
				title: 'Please provide both question and answer.',
				variant: 'destructive',
			});
			return;
		}
		await handleAction(setFAQSWebstis, { question, answer });
		setQuestion('');
		setAnswer('');
		toast({
			title: 'FAQ added successfully.',
		});
	};

	const removeFAQ = (id) => {
		setDeleteId(id);
		setOpenDeleteDialog(true);
	}

	const confirmDeleteFAQ = async () => {
		if (!deleteId) return;
		await handleAction(removeFAQById, { faqId: deleteId });
		toast({
			title: 'FAQ removed successfully.',
		});
		setOpenDeleteDialog(false);
		setDeleteId(null);
	};

	useEffect(() => {
		dispatch(fetchFAQSWebstis());
	}, [dispatch])
	return (
		<div className="w-full space-y-6">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
					<p className="text-gray-600 mt-1">Manage Frequently Asked Questions</p>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{/* Add FAQ Form - 1/3 width */}
				<Card className="md:col-span-1 h-fit">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Plus className="w-5 h-5" />
							Add New FAQ
						</CardTitle>
						<CardDescription>Create a new question and answer pair</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="question">Question</Label>
								<Input
									id="question"
									value={question}
									onChange={(e) => setQuestion(e.target.value)}
									placeholder="e.g., How do I track my order?"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="answer">Answer</Label>
								<Textarea
									id="answer"
									value={answer}
									onChange={(e) => setAnswer(e.target.value)}
									placeholder="Enter the detailed answer..."
									rows={6}
								/>
							</div>
							<Button type="submit" className="w-full btn-primary">
								<Save className="w-4 h-4 mr-2" />
								Save FAQ
							</Button>
						</form>
					</CardContent>
				</Card>

				{/* FAQ List - 2/3 width */}
				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<HelpCircle className="w-5 h-5" />
							Existing FAQs
						</CardTitle>
						<CardDescription>List of all active FAQs on the website</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{faqsWebsite && faqsWebsite.length > 0 ? (
							faqsWebsite.map((faq, index) => (
								<div key={faq._id || index} className="relative p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => removeFAQ(faq?._id)}
										className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
									>
										<X className="w-4 h-4" />
									</Button>
									<div className="pr-8">
										<h3 className="font-semibold text-gray-900 flex items-start gap-2">
											<HelpCircle className="w-4 h-4 mt-1 text-blue-500 shrink-0" />
											{faq.question}
										</h3>
										<p className="mt-2 text-gray-600 text-sm pl-6">
											{faq.answer}
										</p>
									</div>
								</div>
							))
						) : (
							<div className="text-center py-12 text-gray-500">
								<MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
								<p>No FAQs added yet</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete the FAQ.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={confirmDeleteFAQ}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AdminFAQPage
